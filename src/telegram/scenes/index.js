const Stage = require("telegraf/stage");

const createArticle = require('./createArticle');

const stage = new Stage();
stage.register(createArticle.scene);

module.exports = {
  stage,
  createArticle,
};
