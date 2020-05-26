const session = require("telegraf/session");
const bot = require('./bot');
const {
  localesRU: {
    WELCOME_MESSAGE,
    MAIN_BUTTONS,
  },
} = require('../config');
const { mainMenu } = require('./menu');
const { stage, createArticle, getNews, findByLocation } = require('./scenes');

bot.use(session());
bot.use(stage.middleware());

bot.command('start', ({ reply }) => {
  return reply(WELCOME_MESSAGE, mainMenu)
});

let article = {};

bot.hears(MAIN_BUTTONS.VIOLATION_REPORT, (ctx) => {
  article.category = 'нарушения';
  ctx.scene.enter(createArticle.name);
});
bot.hears(MAIN_BUTTONS.ACCIDENT_REPORT, (ctx) => {
  article.category = 'аварии';
  ctx.scene.enter(createArticle.name);
});

bot.hears(MAIN_BUTTONS.NEWS, ctx => {
  ctx.scene.enter(getNews.name);
});

bot.hears(MAIN_BUTTONS.FIND_WITNESSES, ctx => {
  ctx.scene.enter(findByLocation.name);
});

bot.launch();

exports.articleCategory = article;
module.exports = {
  launch: () => bot.launch(),
};
