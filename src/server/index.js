const express = require('express');
const path = require('path');
require('express-async-errors'); // Catch async errors by error handler
const helmet = require('helmet'); // Secure your Express apps by setting various HTTP headers
const cors = require('cors'); // CORS support
const morgan = require('morgan'); // Log HTTP requests (Method, status, endpoint, serve time, etc...)
const statusCodes = require('http').STATUS_CODES; // List of status codes

const bodyParser = require('body-parser');
const rootRouter = require('./routes'); // All our routes are here
const config = require('../config');

const app = express();

app.use(helmet());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use(express.static(path.join(__dirname, 'public')));

const corsOptions = {
  origin: '*',
  methods: 'GET,PUT,POST,DELETE',
};
app.use(cors(corsOptions));

// Our app routes
app.use('/', rootRouter);

// Invalid route handler (404)
app.use((req, res) => {
  console.error(`Resource '${req.path}' not found!`);
  res.status(404).json({ error: statusCodes[404] });
});

// Error handler
app.use((err, req, res, next) => {
  res.status(500).json({ error: `${err.message} See logs for details` });
  next(err);
});

function listen() {
  const server = app.listen(config.server.httpServer.port, config.server.httpServer.address, () => {
    console.log(`Server is listening at [${server.address().address}]:${server.address().port}`);
  });
}

module.exports = {
  listen,
};
