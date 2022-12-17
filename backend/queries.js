const Pool = require('pg').Pool

const pool = new Pool({
    user: 'apps',
    host: 'localhost',
    database: 'OR_lab',
    password: 'application$_acce$$',
    port: 5432,
})

const executeQuery = (query) => {
    return (request, response) => {
        pool.query(query, (error, results) => {
            if (error) {
                response.status(500).json({message: "Moj error"})
            }
            response.status(200).json(results.rows)
        })
    }
}

module.exports={
    executeQuery
}