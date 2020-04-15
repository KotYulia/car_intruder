const telegram = require('./telegram');
const server = require('./server');

function init() {
  try {
    telegram.launch();
    server.listen();
  } catch (err) {
    console.error('Init failed:', err.stack);
    process.exit(1); // eslint-disable-line no-process-exit
  }
}

init();
