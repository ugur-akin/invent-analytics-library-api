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
  const { whereOption, ...restOptions } = options;

  let augmentedWhereClause = {
    userId,
  };
  if (whereOption) {
    augmentedWhereClause = { ...whereOption, ...augmentedWhereClause };
  }

  return Loan.findAll({
    where: augmentedWhereClause,
    ...restOptions,
  });
};

module.exports = Loan;
