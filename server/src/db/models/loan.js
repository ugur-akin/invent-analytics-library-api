const { DataTypes } = require('sequelize');
const db = require('../db');

const Loan = db.define('loan', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  takenAt: {
    type: DataTypes.DATE,
    allowNull: false,
    // TODO: validate against now
  },
  returnedAt: {
    type: DataTypes.DATE,
    // TODO: validate against now and takenAt
    // TODO: Validate score and returned date both exist or don't
  },
  score: {
    type: DataTypes.INTEGER,
    // TODO: Validate between 0-10
  },
});

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

module.exports = Loan;
