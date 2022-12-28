const express = require('express')
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger_output.json')
const openApiFile = require('./openapi.json')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()
const port = 8400
const resources = [
    require('./endpoints/getCollectionEndpoints').default,
    require('./endpoints/cityEndpoints').default,
    require('./endpoints/countryEndpoints').default,
    require('./endpoints/institutionEndpoints').default,
    require('./endpoints/locationEndpoints').default,
    require('./endpoints/measurementEndpoints').default,
    require('./endpoints/metaboliteEndpoints').default
]

app.use(cors())

app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)


resources.forEach(res => app.use(res))

app.get('/swagger', swaggerUi.setup(swaggerFile));
app.use('/swagger', swaggerUi.serve);

app.get('/open-api', (req, res) => {res.status(200).json(openApiFile)})

//serve collection files
app.use('/collection', express.static('exported'))

//handle non existant endpoints
app.use((req, res, next) => {
    res.status(501).json({ status: "Not implemented", message: "Method for requested resource not implemented!" });
});

app.listen(port, () => {
    console.log(`Backend running on port ${port}.`)
})