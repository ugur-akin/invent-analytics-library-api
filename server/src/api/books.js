const express = require('express');
const sequelize = require('sequelize');
const { Book, Loan } = require('../db/models');
const { ResourceNotFoundError } = require('../utils');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const books = await Book.findAll();

    res.json(books);
  } catch (error) {
    next(error);
  }
});

router.get('/:bookId', async (req, res, next) => {
  try {
    const book = await Book.findByPk(req.params.bookId);
    if (!book) {
      throw new ResourceNotFoundError('Book', req.params.bookId);
    }

    const [loansAgg] = await Loan.findLoansByBook(req.params.bookId, {
      where: {
        score: {
          [sequelize.Op.ne]: null,
        },
      },
      attributes: [[sequelize.fn('AVG', sequelize.col('score')), 'avgScore']],
    });

    const score = loansAgg.get('avgScore')
      ? loansAgg.get('avgScore').toFixed(2)
      : -1;

    const result = {
      id: book.id,
      name: book.name,
      score,
    };

    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { name } = req.body;

    await Book.create({ name });

    res.status(201).end();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
