const Sequelize = require('sequelize');
const db = require('../db');

const Account = db.define(
  'account',
  {
    id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    plaidAccountId: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    mask: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    officialName: {
      type: Sequelize.STRING,
    },
    currentBalance: {
      // todo check if this should be str
      type: Sequelize.NUMERIC,
      allowNull: false,
    },
    isoCurrencyCode: {
      type: Sequelize.STRING,
    },
    unofficialCurrencyCode: {
      type: Sequelize.STRING,
    },
    accountType: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    accountSubtype: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

Account.getAccountsByUserId = async function (userId) {
  /**
   * Get all accounts for a given user.
   */
  return Account.findAll({
    where: {
      userId,
    },
  });
};

module.exports = Account;
