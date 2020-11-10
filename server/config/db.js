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

connection.connect()

// TODO Make function for handlind disconnects

// Export connection for use by API
module.exports = connection