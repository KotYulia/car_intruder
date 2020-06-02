const fs = require('fs');
const { Article } = require('../../models');
const { sequelizeHelper: helper } = require('../../utils');

module.exports = {
  create(req, res) {
    const { title, author, category, longitude, latitude, description } = req.body;
    let imagePath;
    if (req.file) {
      imagePath = req.protocol + '://' + req.get('host') + '/' + (req.file.path).replace(/src\/server\/public\//, '');
    }
    return Article.create({
      title,
      image: imagePath,
      author,
      category,
      location: helper.toPoint({ longitude, latitude }),
      description,
    })
      .then((article) =>
        res.status(201).send({
          message: `Your article with the title ${title} has been created successfully `,
          article,
        }),
      )
      .catch((error) => res.status(400).send(error));
  },

  list(req, res) {
    return Article.findAll()
      .then((articles) => res.status(200).send({ articles }))
      .catch((error) => res.status(400).send(error));
  },

  singleArticle(req, res) {
    return Article.findByPk(req.params.articleId)
      .then((article) => res.status(200).send({ article }))
      .catch((error) => res.status(400).send(error));
  },

  update(req, res) {
    const { title, author, category, longitude, latitude, description } = req.body;
    let imagePath;
    if (req.file) {
      imagePath = req.file.path;
      imagePath.replace(/src\/server\/public\//, '');
    }
    return Article.findByPk(req.params.articleId)
      .then((article) => {
        article
          .update({
            title: title || article.title,
            image: imagePath || article.image,
            author: author || article.author,
            category: category || article.category,
            location: helper.toPoint({ longitude, latitude }) || article.location,
            description: description || article.description,
          })
          .then((updateArticle) => {
            res.status(200).send({
              message: 'Article updated successfully',
              data: {
                title: title || updateArticle.title,
                image: imagePath || updateArticle.image,
                author: author || updateArticle.author,
                category: category || updateArticle.category,
                location: helper.toPoint({ longitude, latitude }) || updateArticle.location,
                description: description || updateArticle.description,
              },
            });
          })
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },

  delete(req, res) {
    return Article.findByPk(req.params.articleId)
      .then((article) => {
        if (!article) {
          return res.status(400).send({
            message: 'Article Not Found',
          });
        }
        if (article.image) {
          fs.unlink(article.image, (err) => {
            if (err) throw err;
          });
        }
        return article
          .destroy()
          .then(() =>
            res.status(200).send({
              message: 'Article successfully deleted',
            }),
          )
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },
};
