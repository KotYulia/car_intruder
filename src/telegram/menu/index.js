const Markup = require('telegraf/markup');
const {
  localesRU: {
    MAIN_BUTTONS,
  },
} = require('../../config');

const mainMenu = Markup
  .keyboard([
    [MAIN_BUTTONS.NEWS],
    [MAIN_BUTTONS.FIND_WITNESSES],
    [MAIN_BUTTONS.VIOLATION_REPORT],
    [MAIN_BUTTONS.ACCIDENT_REPORT]
  ])
  .oneTime()
  .resize()
  .extra();

module.exports = {
  mainMenu,
};
