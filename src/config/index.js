const localesRU = require('./locales/ru');
const credentials = require('./credentials');
const server = require('./config');
const telegramEvents = require('./telegramEvents');

module.exports = {
  credentials,
  server,
  telegramEvents,
  localesRU,
};
