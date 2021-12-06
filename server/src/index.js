const express = require('express');
const cors = require('cors');
const knex = require('knex');
const knexConfig = require ('./utils/knexfile');
const { Model } = require ('objection'); 

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const environment = knex(process.env.NODE_ENV === "production" ? knexConfig.production : knexConfig.development);
Model.knex(environment);

app.get("/", (req, res) => {
    res.send("Hello World");
});
app.use('/', require('./routes/users'));

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});