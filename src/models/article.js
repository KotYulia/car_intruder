'use strict';
module.exports = (sequelize, DataTypes) => {
  const Article = sequelize.define('Article', {
    title: DataTypes.STRING,
    image: DataTypes.STRING,
    author: DataTypes.STRING,
    category: DataTypes.STRING,
    location: DataTypes.STRING,
    description: DataTypes.TEXT
  }, {});
  Article.associate = function(models) {
    // associations can be defined here
  };
  return Article;
};