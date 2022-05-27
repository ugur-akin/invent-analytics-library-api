const express = require('express');
const { User, Book, Loan, Rating } = require('../db/models');
const { ResourceNotFoundError } = require('../utils');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    next(error);
  }
});

router.get('/:userId', async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.userId);
    if (!user) {
      throw new ResourceNotFoundError('User', req.params.userId);
    }
    const loans = await Loan.findLoansByUser(req.params.userId, {
      include: [Book, Rating],
    });

    const returnedLoans = [];
    const activeLoans = [];
    loans.forEach((loan) => {
      const projected = {
        name: loan.book.name,
      };

      if (loan.returnedAt) {
        projected.userScore = loan.rating.rating;
        returnedLoans.push(projected);
      } else {
        activeLoans.push(projected);
      }
    });

    const result = {
      id: user.id,
      name: user.name,
      books: {
        past: returnedLoans,
        present: activeLoans,
      },
    };

    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { name } = req.body;
    await User.create({ name });

    res.status(201).end();
  } catch (error) {
    next(error);
  }
});

router.post('/:userId/borrow/:bookId', async (req, res, next) => {
  try {
    // TODO: Clarify whether to worry about inventory size (e.g. assume only 1 copy or inf?)
    await Loan.loanBookToUser(req.params.userId, req.params.bookId);

    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

router.post('/:userId/return/:bookId', async (req, res, next) => {
  try {
    const { score } = req.body;

    await Loan.rateAndReturnBook(req.params.userId, req.params.bookId, score);

    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
