const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(cors());

app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const models = require('./models');

models.sequelize.sync().then(() => console.log('Database is fine')).catch((err) => console.log(err, 'Database is NOT fine'));

const userRouter = require('./routes/user');
const artPlaceRouter = require('./routes/artPlace');
const imageRouter = require('./routes/image');
const placeRouter = require('./routes/place');

app.use(express.static('public'));
app.use('/users', userRouter);
app.use('/artPlaces', artPlaceRouter);
app.use('/images', imageRouter);
app.use('/places', placeRouter);

module.exports = app;
