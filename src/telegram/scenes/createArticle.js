const { newArticle } = require('../../services');
const WizardScene = require("telegraf/scenes/wizard");
const fs = require('fs');
const https = require('https');
const bot = require('../bot');
const {
  localesRU: { CREATE_ARTICLE },
  telegramEvents: {
    SCENES: { CREATE_ARTICLE: name },
  },
} = require('../../config');
const articleObj = require('../index');

function getFileLink(id) {
  return bot.telegram.getFileLink(id);
}

let article = {};

const scene = new WizardScene(
  name,
  (ctx) => {
    ctx.reply(CREATE_ARTICLE.TITLE);
    article.category = articleObj.articleCategory.category;
    article.author = ctx.message.from.username;
    return ctx.wizard.next();
  },
  (ctx) => {
    if (!ctx.message.text) {
      ctx.reply(CREATE_ARTICLE.ERROR);
      return ctx.scene.leave();
    }
    ctx.reply(CREATE_ARTICLE.DESCRIPTION);
    article.title = ctx.message.text;
    return ctx.wizard.next();
  },
  (ctx) => {
    if (ctx.message.text) {
      article.description = ctx.message.text;
    }
    ctx.reply(CREATE_ARTICLE.PHOTO);
    return ctx.wizard.next();
  },
  async (ctx) => {
    if (ctx.message && ctx.message.photo) {
      const img = ctx.message.photo[ctx.message.photo.length - 1].file_id;
      const imageLink = await getFileLink(img);
      const imageLocalLink = `${process.cwd()}/src/public/uploads/${img}.jpg`;
      article.image = imageLocalLink;
      const file = await fs.createWriteStream(imageLocalLink);
      await https.get(imageLink, (response) => {
        response.on('data', (chunk) => {
          file.write(chunk);
        });
      });
    }
    ctx.reply(CREATE_ARTICLE.LOCATION);
    return ctx.wizard.next();
  },
  (ctx) => {
    if (ctx.message && ctx.message.location) {
      article.latitude = ctx.message.location.latitude;
      article.longitude = ctx.message.location.longitude;
      newArticle(article);
      ctx.reply(CREATE_ARTICLE.ENTER);
      return ctx.scene.leave();
    }
    ctx.reply(CREATE_ARTICLE.ERROR);
    return ctx.scene.leave();
  }
);

module.exports = {
  name,
  scene,
};
