const express = require('express');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const router = require("./controller/notification.controller");

const app = express();

app.use(bodyParser.json()); //utilizes the body-parser package
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.set('Content-Type', 'application/json');
    next();
});

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'My API',
            version: '1.0.0',
            description: 'A sample API'
        },
        servers: [{
                url: 'http://localhost:3000'
            }
        ]
    },
    apis: ['./openApi.yml']
};

const openapiSpecification = swaggerJsdoc(options);

app.use('/', router);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification));

function cleanup() {
    console.log('Cleaning up...');
    // Perform cleanup tasks here...
    console.log('Done cleaning up.');
}

process.on('exit', (code) => {
    console.log(`Exiting with code ${code}`);
    cleanup();
});

process.on('SIGINT', () => {
    console.log('Received SIGINT signal');
    cleanup();
    process.exit(0);
});

app.listen(3000, () => console.log('Server started on port 3000.'));
