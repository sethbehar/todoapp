const Pool = require('pg').Pool
require('dotenv').config()

const pool = new Pool({
    user: 'postgres',
    password: 'Mic9841pos',
    host: 'localhost',
    port: 5432,
    database: 'todoapp'
})

module.exports = pool