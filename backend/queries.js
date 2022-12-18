const Pool = require('pg').Pool

const pool = new Pool({
    user: 'apps',
    host: 'localhost',
    database: 'OR_lab',
    password: 'application$_acce$$',
    port: 5432,
})

const executeQuery = (query) =>
    new Promise((resolve, reject) => {
        let result = {}

        pool.query(query)
            .then(res => {
                result.status = 'success'
                result.res = res.rows
                resolve(result)
            })
            .catch(e => {
                result.status = 'error'
                result.reason = e
                reject(result)
            })
    });

module.exports = {
    executeQuery
}