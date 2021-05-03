var connection = require('../config/db');
var router = require('express').Router();

/**
 * @swagger
 * 
 * /minutes:
 *   get:
 *     tags:
 *     - users
 *     summary: Returns specified list of minutes
 *     operationId: getMinutes
 *     description: |
 *       Returns a list of minutes links by request dot number
 *     produces:
 *     - application/json
 *     responses:
 *       200:
 *         description: search results matching criteria
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/Minutes'
 *       400:
 *         description: bad input parameter
 */
router.get('/', (req, res) => {
    var sqlQuery = 'SELECT FRMinutes.*,`Funding Requests`.`Dot Number` from FRMinutes LEFT JOIN `Funding Requests` ON FRMinutes.FR_ID=`Funding Requests`.ID UNION SELECT ReallocMinutes.*,`Reallocations`.`Dot Number` from ReallocMinutes LEFT JOIN `Reallocations` ON ReallocMinutes.Realloc_ID=`Reallocations`.ID'
    var content

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