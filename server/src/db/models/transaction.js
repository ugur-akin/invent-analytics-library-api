const Sequelize = require('sequelize');
const db = require('../db');

const Transaction = db.define(
  'transaction',
  {
    id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    plaidTransactionId: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    plaidCategoryId: {
      type: Sequelize.STRING,
    },
    categories: {
      type: Sequelize.STRING, // comma delimited
    },
    type: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    amount: {
      type: Sequelize.STRING,
      allowNull: false,
      get() {
        const strAmount = this.getDataValue('amount');
        return strAmount ? Number.parseFloat(strAmount) : 0.00;
      },
      set(value) {
        if (value && typeof value === 'number') {
          value = value.toString();
        }
        this.setDataValue('amount', value);
      }
    },
    isoCurrencyCode: {
      type: Sequelize.STRING,
    },
    unofficialCurrencyCode: {
      type: Sequelize.STRING,
    },
    date: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    pending: {
      type: Sequelize.BOOLEAN,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Get all transactions for a user between startDate and endDate
 *
 * @param {Number} userId
 * @param {Date} startDate
 * @param {Date} endDate
 * @returns Array<Transaction>
 */
Transaction.getTransactionsForRange = async function (
  userId,
  startDate,
  endDate
) {
  return Transaction.findAll({
    where: {
      userId,
      date: {
        [Sequelize.Op.between]: [startDate, endDate],
      },
    },
  });
};

module.exports = Transaction;
