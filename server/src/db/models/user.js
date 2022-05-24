const Sequelize = require('sequelize');
const db = require('../db');

const User = db.define('user', {
  id: {
    type: Sequelize.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = User;
