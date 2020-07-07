const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');

const http = require('http');

const app = express();

app.use(cors());

app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const models = require('./models');

models.sequelize.sync().then(() => console.log('Database is fine')).catch((err) => console.log(err, 'Database is NOT fine'));

const appRouter = require('./routes/index');


app.use('/api', appRouter);

module.exports = app;
