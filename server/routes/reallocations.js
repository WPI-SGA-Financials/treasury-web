var connection = require('../config/db')
var router = require('express').Router()

/**
 * @swagger
 * 
 * /reallocations:
 *   get:
 *     tags:
 *     - users
 *     summary: Returns specified list of reallocations
 *     operationId: getReallocs
 *     description: |
 *       Returns a list of reallocations based on the query provided
 *       If fields of selection are empty, returns all for that field
 *     parameters:
 *     - in: query
 *       name: selection
 *       description: pass an optional search string 
 *       required: false
 *       type: string
 *     produces:
 *     - application/json
 *     responses:
 *       200:
 *         description: search results matching criteria
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/Reallocation'
 *       400:
 *         description: bad input parameter
 */
router.get('/', (req, res) => {
    var sqlQuery = 'SELECT * FROM Reallocations'
    var content

    // Check for query
    if(Object.entries(req.query).length != 0) {
        sqlQuery += ' WHERE'
        var first = true
        // Add each query param to sqlQuery string
        for(const [key, value] of Object.entries(req.query)) {
            if(!first) {sqlQuery += ' AND'}
            sqlQuery += ' `' + key + '`="' + value + '"'
            first = false
        }
        console.log('Finished:', sqlQuery)
    }

    // Obtain data from db
    connection.query(sqlQuery, (err, results) => {
        if (err) console.error(err)
        console.log('Sent:', sqlQuery)
        content = results
        res.send(content)
    })    
})

// Export router object for use in API
module.exports = router