const { DataTypes } = require('sequelize');
const db = require('../db');

const Loan = db.define(
  'loan',
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    loanedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      validate: {
        loanedInFuture(value) {
          if (value > Date.now()) {
            throw new Error("Can't loan books in the future.");
          }
        },
      },
    },
    returnedAt: {
      type: DataTypes.DATE,
      defaultValue: null,
      validate: {
        returnedInFuture(value) {
          if (value > Date.now()) {
            throw new Error("Can't return books in the future.");
          }
        },
      },
    },
  },
  {
    validate: {
      // NOTE: In realistic circumstances, it would be best to make ratings optional
      notReturnedOrRated() {
        if (this.returnedAt !== null && this.ratingId === null) {
          throw new Error('Returned books must have a rating.');
        }

        if (this.returnedAt === null && this.ratingId !== null) {
          throw new Error("Can't rate book before returning it.");
        }
      },
      invalidLoanDates() {
        if (this.returnedAt && this.loanedAt > this.returnedAt) {
          throw new Error('Loan must start before its return date.');
        }
      },
    },
  }
);

/**
 * Get all loans for a user
 *
 * @param {Number} userId
 * @param {Object} options options to be forwarded into query.
 * @returns Array<Loan>
 */
Loan.findLoansByUser = async function (userId, options) {
  const { where: whereOption, ...restOptions } = options;

  let augmentedWhereClause = {
    userId,
  };
  if (whereOption) {
    augmentedWhereClause = { ...whereOption, ...augmentedWhereClause };
  }

  const augmentedOptions = {
    where: augmentedWhereClause,
    ...restOptions,
  };

  return Loan.findAll(augmentedOptions);
};

/**
 * Get all loans of the book given
 *
 * @param {Number} bookId
 * @param {Object} options options to be forwarded into query.
 * @returns Array<Loan>
 */
Loan.findLoansByBook = async function (bookId, options) {
  const { where: whereOption, ...otherOptions } = options;

  let augmentedWhereClause = {
    bookId,
  };
  if (whereOption) {
    augmentedWhereClause = { ...whereOption, ...augmentedWhereClause };
  }

  const augmentedOptions = {
    where: augmentedWhereClause,
    ...otherOptions,
  };

  return Loan.findAll(augmentedOptions);
};

/**
 * Loan book to user unless user has already loaned the same book and haven't returned it.
 *
 * @param {Number} userId
 * @param {Number} bookId
 * @param {Object} options options to be forwarded into query.
 * @returns Array<Loan>
 */
Loan.loanBookToUser = async function (userId, bookId, options) {
  const activeLoanOfSameBook = await Loan.findLoansByUser(userId, {
    where: {
      bookId,
      returnedAt: null,
    },
  });

  if (activeLoanOfSameBook.length !== 0) {
    const err = new Error('The user already has an active load on this book.');
    err.name = 'SequelizeValidationError';
    throw err;
  }

  return Loan.create(
    {
      userId,
      bookId,
    },
    options
  );
};

/**
 * Return and rate the book loaned by user. If there are no active bookings,
 * this function is a no-op. Relies on the users not being able to loan the same
 * book more than once without returning it first.
 *
 * @param {Number} userId
 * @param {Number} bookId
 * @param {Number} score rating score
 * @returns Array<Loan>
 */
Loan.returnAndRateBook = async function (userId, bookId, score) {
  const [activeLoan] = await Loan.findLoansByUser(userId, {
    where: {
      bookId,
      returnedAt: null,
    },
  });

  if (activeLoan) {
    activeLoan.returnedAt = new Date();
    activeLoan.score = score;

    return activeLoan.save();
  }
};

module.exports = Loan;
