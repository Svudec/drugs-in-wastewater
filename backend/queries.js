const Pool = require('pg').Pool

const pool = new Pool({
    user: 'apps',
    host: 'localhost',
    database: 'OR_lab',
    password: 'application$_acce$$',
    port: 5432,
})

const getTable = (request, response) => {
    pool.query('SELECT * FROM location ORDER BY id ASC', (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

module.exports = {
    getTable
}