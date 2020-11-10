var connection = require('../config/db')
var router = require('express').Router()

/**
 * @swagger
 * 
 * /studentLifeFee:
 *   get:
 *     tags:
 *       - users
 *     summary: Returns data about the student life fee
 *     operationId: getLifeFees
 *     description: |
 *       Returns data about the student life fee over the course of it's history
 *       Automatically returns all available entries
 *     produces:
 *     - application/json
 *     responses:
 *       200:
 *         description: student life fee records
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/LifeFee'
 */
router.get('/', (req, res) => {
    var sqlQuery = 'SELECT * FROM `Student Life Fee`'
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