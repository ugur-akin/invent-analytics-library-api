const express = require('express');

const accounts = require('./accounts');
const transactions = require('./transactions');
const auth = require('./auth');

const router = express.Router();

router.use('/', auth);
router.use('/accounts', accounts);
router.use('/transactions', transactions);

module.exports = router;
