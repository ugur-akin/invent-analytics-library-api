const { DataTypes } = require('sequelize');
const db = require('../db');

// TODO: Validate unique by composite of (userId, bookId, returnedAt)
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
      // validate: {
      //   isBefore: {
      //     args: DataTypes.NOW,
      //     msg: "Can't initiate loans in the future.",
      //   },
      // },
    },
    returnedAt: {
      type: DataTypes.DATE,
      defaultValue: null,
      validate: {
        isBefore: {
          args: DataTypes.NOW,
          msg: "Can't return books in the future.",
        },
      },
    },
    score: {
      type: DataTypes.INTEGER,
      defaultValue: null,
      validate: {
        min: 0,
        max: 10,
      },
    },
  }
  // {
  //   sequelize,
  //   validate: {
  //     notReturnedOrRated() {
  //       if ((this.returnedAt !== null) !== (this.score !== null)) {
  //         throw new Error(
  //           'A loan must either have both return date and score set or neither.'
  //         );
  //       }
  //     },
  //     invalidLoanDates() {
  //       if (this.returnedAt && this.loanedAt > this.returnedAt) {
  //         throw new Error('Loan must start before its return date.');
  //       }
  //     },
  //   },
  // }
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
  // TODO: Proper error handlign
  if (activeLoanOfSameBook.length !== 0) {
    throw new Error('Already loaned');
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
