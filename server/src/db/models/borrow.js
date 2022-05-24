const { DataTypes } = require('sequelize');
const db = require('../db');

const Borrow = db.define('borrow', {
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
  },
  score: {
    type: DataTypes.INTEGER,
    //TODO: Validate between 0-10
  },
});

module.exports = Borrow;
