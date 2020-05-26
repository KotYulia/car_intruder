const Stage = require("telegraf/stage");

const createArticle = require('./createArticle');
const getNews = require('./getNews');
const findByLocation = require('./findByLocation');

const stage = new Stage();
stage.register(createArticle.scene);
stage.register(getNews.scene);
stage.register(findByLocation.scene);

module.exports = {
  stage,
  createArticle,
  getNews,
  findByLocation,
};
