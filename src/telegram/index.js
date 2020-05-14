const session = require("telegraf/session");
const bot = require('./bot');
const {
  localesRU: {
    WELCOME_MESSAGE,
    MAIN_BUTTONS,
  },
} = require('../config');
const { mainMenu } = require('./menu');
const { stage, createArticle } = require('./scenes');

bot.use(session());
bot.use(stage.middleware());

let article = {};

bot.hears(MAIN_BUTTONS.VIOLATION_REPORT, (ctx) => {
  article.category = 'нарушения';
  ctx.scene.enter(createArticle.name);
});
bot.hears(MAIN_BUTTONS.ACCIDENT_REPORT, (ctx) => {
  article.category = 'аварии';
  ctx.scene.enter(createArticle.name);
});

bot.command('start', ({ reply }) => {
  return reply(WELCOME_MESSAGE, mainMenu)
});

bot.hears('🔍 Новости', ctx => ctx.reply('Yay!'));

bot.launch();

exports.articleCategory = article;
module.exports = {
  launch: () => bot.launch(),
};
