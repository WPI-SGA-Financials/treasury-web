//var budgetModel = require('../models/budget')
var connection = require('../config/db')
// var querystring = require('querystring')
var router = require('express').Router()

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
router.get('/', (req, res) => {
    var sqlQuery = 'SELECT * FROM Budgets'
    var content

    // Check for query
    if(req.query) {
        sqlQuery += ' WHERE'
        var first = true
        // Add each query param to sqlQuery string
        for(const [key, value] of Object.entries(req.query)) {
            if(!first) {sqlQuery += ' AND'}
            sqlQuery += ' `' + key + '`="' + value + '"'
        }
    }

    // Obtain data from db
    connection.connect()
    connection.query(sqlQuery, (err, results) => {
        if (err) console.error(err)
        content = results
        connection.end()
        res.send(content)
    })    
})

// Export router object for use in API
module.exports = router