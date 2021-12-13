const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const knex = require('knex');
const knexConfig = require ('./utils/knexfile');
const { Model } = require ('objection'); 

const app = express();
const port = 3000;

app.use(cors());

const environment = knex(process.env.NODE_ENV === "production" ? knexConfig.production : knexConfig.development);
Model.knex(environment);

app.use(express.json({limit: '100mb'}));
app.use(express.urlencoded({limit: '100mb', extended: true, parameterLimit: 100000}));
app.get("/", (req, res) => {
    res.send("Hello World");
});
app.use('/', require('./routes/users'));
app.use('/', require('./routes/projects'));

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});