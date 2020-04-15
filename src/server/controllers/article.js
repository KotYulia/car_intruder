const { Article } = require('../../models');
const { sequelizeHelper: helper } = require('../../utils');

module.exports = {
  create(req, res) {
    const { title, author, category, longitude, latitude, description } = req.body;
    const imagePath = req.file.path.replace(/^public\//, '');
    res.redirect(imagePath);
    return Article.create({
      title,
      image: imagePath,
      author,
      category,
      location: helper.toPoint({ longitude, latitude }),
      description,
    })
      .then((article) => res.status(201).send({ article }))
      .catch((error) => res.status(400).send(error));
  },
};
