const { Article } = require('../models');
const { sequelizeHelper: helper } = require('../utils');

const newArticle = async(articleObj) => {
  const { title, author, category, longitude, latitude, description, image } = articleObj;
  try {
    await Article.create({
      title,
      image,
      author,
      category,
      location: helper.toPoint({ longitude, latitude }),
      description,
    });
    console.log(`Article created`);
  } catch (error) {
    throw error;
  }
};

const listArticles = async() => {
  try {
    const articles = await Article.findAll();
    return articles;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  newArticle,
  listArticles,
};
