//var budgetModel = require('../models/budget')
var connection = require('../config/db')
var router = require('express').Router()


// Function for when no parameters given
function getAllBudgets() {
    connection.connect()
    var content = {}
    
    connection.query('SELECT * FROM Budgets', (err, results, fields) => {
        if (err) console.error(err)
        console.log('Raw Results:', results)
        content = results
    })

    connection.end()
    return content
}

// Function for when parameters given
function getBudgets(params) {
    var content = {}
    // TODO Grab all budgets from db as JSON objects (maybe sort by given params?)
        // Add each object to content variable iff params match, translate if necessary
        // What to do about meeting all params vs meeting any of the params?
        // TODO: Might need seperate file for parsing parameters into SQL queries
    return content
}

/**
 * @swagger
 * 
 * /budgets:
 *   get:
 *     tags:
 *     - users
 *     summary: Returns specified list of budgets
 *     operationId: getBudgets
 *     description: |
 *       Returns a list of budgets based on the query provided
 *       If fields of selection are empty, returns all for that field
 *     produces:
 *     - application/json
 *     parameters:
 *     - in: query
 *       name: selection
 *       description: pass an optional search string 
 *       required: false
 *       type: string
 *     responses:
 *       200:
 *         description: search results matching criteria
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/Budget'
 *       400:
 *         description: bad input parameter
 */
router.get('/budgets', (req, res) => {
    var content = {}
    if(Object.keys(req.params).length === 0) {
        content = getAllBudgets()
    }
    else content = getBudgets(req.params)
    res.send(JSON.stringify(content))
})

// Export router object for use in API
module.exports = router