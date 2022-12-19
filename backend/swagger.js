const swaggerAutogen = require('swagger-autogen')()

const outputFile = './swagger_output.json'
const endpointsFiles = ['./endpoints/getCollectionEndpoints.js',
'./endpoints/cityEndpoints.js',
'./endpoints/countryEndpoints.js',
'./endpoints/institutionEndpoints.js',
'./endpoints/locationEndpoints.js',
'./endpoints/measurementEndpoints.js',
'./endpoints/metaboliteEndpoints.js',
'./queries.js']

swaggerAutogen(outputFile, endpointsFiles)