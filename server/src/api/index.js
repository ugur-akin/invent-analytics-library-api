const express = require('express');

const auth = require('./auth');
const users = require('./users');

const router = express.Router();

router.use('/', auth);
router.use('/users', users);
// router.use('/books', books);
// router.use('/borrows', borrows);

module.exports = router;
