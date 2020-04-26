const express = require('express');
const multer = require('multer');
const path = require('path');
const articleController = require('../controllers/article');

const app = express();
const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, `${process.cwd()}/src/public/uploads`);
  },
  filename(req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});
app.use(express.static(path.join(__dirname, 'public')));
// eslint-disable-next-line object-shorthand
const upload = multer({ storage: storage });

router.get('/', articleController.list);
router.post('/articles', upload.single('photo'), articleController.create);
router.post('/articles/:articleId', upload.single('photo'), articleController.update);
router.delete('/articles/:articleId', articleController.delete);

module.exports = router;
