const credentials = require('../config/credentials')
const budgetModel = require('../models/budget')
var router = require('express').Router()


// Function for when no parameters given
function getAllBudgets() {
    var JSON = {}
    // TODO Grab all budgets from db as JSON objects
        // Add each object to JSON variable, translate if necessary
    return JSON
}

// Function for when parameters given
function getBudgets(params) {
    var JSON = {}
    // TODO Grab all budgets from db as JSON objects (maybe sort by given params?)
        // Add each object to JSON variable iff params match, translate if necessary
        // What to do about meeting all params vs meeting any of the params?
    return JSON
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
    var JSON = {}
    if(Object.keys(req.params).length === 0) {
        JSON = getAllBudgets()
    }
    else JSON = getBudgets(req.params)
    res.send(JSON) // TODO may need to stringify
})

// Export router object for use in API
module.exports = router