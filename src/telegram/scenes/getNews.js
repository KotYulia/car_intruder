const { listArticles } = require('../../services');
const WizardScene = require("telegraf/scenes/wizard");
const {
  telegramEvents: {
    SCENES: { GET_NEWS: name },
  },
} = require('../../config');

function getDateWithoutTime(date) {
  return require('moment')(date).format('DD.MM.YYYY HH:mm');
}

const scene = new WizardScene(
  name,
  async (ctx) => {
    try {
      const articles = await listArticles();
      let counter = 10;
      if (counter > articles.length) {
        counter = articles.length;
      }
      for (let i = 0; i < counter; ++i) {
        await ctx.replyWithHTML(`<strong>${articles[i].title}</strong>`);
        if (articles[i].image) {
          const url = articles[i].image;
          ctx.replyWithPhoto({ url: url });
        }
        if (articles[i].description) {
          await ctx.reply(articles[i].description);
        }
        await ctx.replyWithLocation(articles[i].location.split(', ')[0], articles[i].location.split(', ')[1]);
        await ctx.replyWithHTML(`<em>Автор: ${articles[i].author}  (${getDateWithoutTime(articles[i].createdAt)})</em>`);
        await ctx.replyWithHTML('----------------------------------------------');
      }
      return await ctx.scene.leave();
    } catch (error) {
      throw error;
    }
  },
);

module.exports = {
  name,
  scene,
};
