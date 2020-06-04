const express = require('express');
const multer = require('multer');
const articleController = require('../controllers/article');

const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    // cb(null, `${process.cwd()}/src/public/uploads`);
    cb(null, `./src/server/public/uploads`);
  },
  filename(req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

// eslint-disable-next-line object-shorthand
const upload = multer({ storage: storage });

router.get('/', articleController.list);
router.get('/articles/:articleId', articleController.singleArticle);
router.get('/map', articleController.listLocations);
router.post('/articles', upload.single('photo'), articleController.create);
router.post('/articles/:articleId', upload.single('photo'), articleController.update);
router.delete('/articles/:articleId', articleController.delete);

module.exports = router;
