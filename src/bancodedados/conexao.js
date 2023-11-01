const { Pool } = require('pg')

const pool = new Pool({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'CIO2010a+',
    database: 'dindin'
})
 
const query = (text, param) => {
    return pool.query(text, param);
}

module.exports = {
    query
}