const express = require('express');
const router = express.Router();

const bookController = require('../app/controllers/BookController');

router.use('/', bookController.index);
module.exports = router;