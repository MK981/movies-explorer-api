require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');

const { errors } = require('celebrate');

const { requestLogger, errorLogger } = require('./middlewares/logger');
const limiter = require('./middlewares/limiter');
const errorHandler = require('./middlewares/error-handler');

const { PORT = 3000, NODE_ENV, DATA_BASE } = process.env;

const app = express();

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// mongoose.connect('mongodb://localhost:27017/moviesdb');
mongoose.connect(NODE_ENV === 'production' ? DATA_BASE : 'mongodb://localhost:27017/moviesdb');

app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://maxweb.nomoredomains.rocks',
    'https://maxweb.nomoredomains.rocks',
  ],
  credentials: true,
}));

app.use(requestLogger);

app.use(limiter);

app.use(require('./routes/index'));

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT);
