const mysql = require('mysql')

// Make connection to database
var connection = mysql.createConnection({
    host    : process.env.DB_HOST,
    user    : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_NAME,
})

// Export connection for use by API
module.exports = connection