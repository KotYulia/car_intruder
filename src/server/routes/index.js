const express = require('express');
const multer = require('multer');
const path = require('path');
const articleController = require('../controllers/article');

const app = express();
const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, '../public/images/');
  },
  filename(req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage });

app.use(express.static(path.join(__dirname, 'public')));

router.get('/api', (reg, res) => {
  res.send('Welcome to API');
});

router.post('/articles', upload.single('wallpaper'), articleController.create);

module.exports = router;
