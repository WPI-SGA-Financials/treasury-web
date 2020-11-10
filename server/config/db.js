const dotenv = require('dotenv')
const credentials = dotenv.config({path: './server/.env'})
const mysql = require('mysql')

// Load credentials and make connection to database
// TODO may need to move .env file or point config to it
if(credentials.error) {throw credentials.error}
console.log('Parsed:', credentials.parsed)
var connection = mysql.createConnection({
    host    : process.env.DB_HOST,
    user    : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_NAME,
})

// Function to send sql query through connection
const sendQuery = function(sqlQuery) {
    connection.connect()
    connection.query(sqlQuery, (err, results, fields) => {
        if (err) console.error(err)
        console.log('Raw results:', results)
        content = results
    })
    connection.end()
    console.log(content)
    console.log('Content above')
    res.send(JSON.stringify(content))
}

// Export connection for use by API
module.exports = connection