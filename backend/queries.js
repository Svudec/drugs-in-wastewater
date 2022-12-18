const Pool = require('pg').Pool

const pool = new Pool({
    user: 'apps',
    host: 'localhost',
    database: 'OR_lab',
    password: 'application$_acce$$',
    port: 5432,
})

const executeQuery = (query, returnOnlyFirst = false) =>
    new Promise((resolve, reject) => {
        let result = {}

        pool.query(query)
            .then(res => {
                if (res.rows.length === 0) {
                    result.status = 'error'
                    result.httpStatus = 404
                } else {
                    result.status = 'ok'
                    result.res = returnOnlyFirst && res.rows.length > 0 ? res.rows[0] : res.rows
                }
                resolve(result)
            })
            .catch(e => {
                result.status = 'error'
                result.httpStatus = 400
                result.message = e.message
                resolve(result)
            })
    });

const sendResponseGet = (queryResult, responseObject) => {
    if (queryResult.status === 'error') {
        responseObject.status(queryResult.httpStatus)
        .json({ ...queryResult, message: queryResult.httpStatus === 404 ? 'Requested resource not found!' : queryResult.message })
    } else {
        responseObject.status(200)
        .json({ ...queryResult, message: 'Requested resource fetched successfully' })
    }
}

const getAllQuery = (resource) => `select * from ${resource}`
const getByIdQuery = (resource, id) => ({
    text: `select * from ${resource} where id = $1`, values: [id]
})

const getAll = (resource) =>{
    return async (req, res) => {
        const queryRes = await executeQuery(getAllQuery(resource))
        sendResponseGet(queryRes, res)
    }
}

const getById = (resource) =>{
    return async (req, res) => {
        const queryRes = await executeQuery(getByIdQuery(resource, req.params.id), true)
        sendResponseGet(queryRes, res)
    }
}



module.exports = {
    executeQuery, sendResponseGet, getAll, getById
}