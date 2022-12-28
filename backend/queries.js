const Pool = require('pg').Pool
const copyTo = require('pg-copy-streams').to
const fs = require('fs')

const pool = new Pool({
    user: 'apps',
    host: 'localhost',
    database: 'OR_lab',
    password: 'application$_acce$$',
    port: 5432,
})

const executeQueryCopy = (query, path) =>
    new Promise((resolve, reject) => {
        pool.connect((err, client, done) => {
            if (err) {
                reject({ message: err.stack })
            }
            const file = fs.createWriteStream(path)
            const stream = client.query(copyTo(query))
            stream.pipe(file)
            stream.on('end', r => { done(r), resolve({}) })
            stream.on('error', r => { done(r), reject({ message: 'Query error!' }) })
            file.on('error', r => { done(r), reject({ message: "Can't write to path!" }) });
        })
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

const writeQuery = (query) =>
    new Promise((resolve, reject) => {
        let result = {}

        pool.query(query)
            .then(res => {
                if (['INSERT', 'UPDATE', 'DELETE'].includes(res.command) && res.rowCount > 0) {
                    result.status = 'ok'
                    result.res = []
                } else {
                    result.status = 'error'
                    result.httpStatus = 400
                    result.message = "Unable to execute write operation!"
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

const sendResponseWrite = (queryResult, responseObject) => {
    responseObject.status(200).json({ ...queryResult, message: 'Write operation successfull' })
}

const getAllQuery = (resource) => `select * from ${resource}`
const getByIdQuery = (resource, id) => ({
    text: `select * from ${resource} where id = $1`, values: [id]
})

const getAll = (resource) => {
    return async (req, res) => {
        const queryRes = await executeQuery(getAllQuery(resource))
        sendResponseGet(queryRes, res)
    }
}

const getById = (resource, fromWriteFn = false) => {
    return async (req, res) => {
        const queryRes = await executeQuery(getByIdQuery(resource, req.params.id), true)
        fromWriteFn ? sendResponseWrite(queryRes, res) : sendResponseGet(queryRes, res)
    }
}



module.exports = {
    executeQuery, executeQueryCopy, writeQuery, sendResponseGet, getAll, getById, getByIdQuery
}