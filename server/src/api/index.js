const express = require('express');

const users = require('./users');
const books = require('./books');

const router = express.Router();

router.use('/users', users);
router.use('/books', books);

module.exports = router;
