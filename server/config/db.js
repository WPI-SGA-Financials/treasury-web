const mysql = require('mysql')

// Load credentials and make connection to database
// TODO may need to move .env file or point config to it
require('dotenv').config()
var connection = mysql.createConnection({
    host    : process.env.DB_HOST,
    user    : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_NAME,
})

// Export connection for use by API
module.exports = connection