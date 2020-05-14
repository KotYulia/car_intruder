const { newArticle } = require('../../services');
const WizardScene = require("telegraf/scenes/wizard");
const fs = require('fs');
const https = require('https');
const bot = require('../bot');
const {
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
    ctx.reply('Шаг 1: придумайте заглавие');
    article.category = articleObj.articleCategory.category;
    article.author = ctx.message.from.username;
    return ctx.wizard.next();
  },
  (ctx) => {
    ctx.reply('Шаг 2: опишите, что произошло');
    article.title = ctx.message.text;
    return ctx.wizard.next();
  },
  (ctx) => {
    ctx.reply('Шаг 3: добавьте фото');
    article.description = ctx.message.text;
    return ctx.wizard.next();
  },
  async (ctx) => {
    ctx.reply('Шаг 4: укажите location');
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
    return await ctx.wizard.next();
  },
  (ctx) => {
    ctx.reply('Ваша статья успешно создана');
    article.longitude = ctx.message.location.longitude;
    article.latitude = ctx.message.location.latitude;
    newArticle(article);
    return ctx.scene.leave();
  }
);

module.exports = {
  name,
  scene,
};
