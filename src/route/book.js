const express = require('express');
const router = express.Router();

const bookController = require('../controllers/BookController');

router.use('/', bookController.index);
module.exports = router;