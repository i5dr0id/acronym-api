const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const routes = require('./routes/v1');



const app = express();

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// enable cors
app.use(cors());
app.options('*', cors());

// v1 api routes
app.use('/v1', routes);

module.exports = app;
