const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const legacy = require('./endpoints/getAllEndpoints').default

const app = express()
const port = 8400
const resources = [
    { name: 'city', fn: require('./endpoints/cityEndpoints').default },
    { name: 'country', fn: require('./endpoints/countryEndpoints').default },
    { name: 'institution', fn: require('./endpoints/institutionEndpoints').default },
    { name: 'location', fn: require('./endpoints/locationEndpoints').default },
    { name: 'measurement', fn: require('./endpoints/measurementEndpoints').default },
    { name: 'metabolite', fn: require('./endpoints/metaboliteEndpoints').default }
]

app.use(cors())

app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)

app.use('/', legacy)

resources.forEach(res => app.use(`/api/v1/${res.name}/`, res.fn))

app.listen(port, () => {
    console.log(`Backend running on port ${port}.`)
})