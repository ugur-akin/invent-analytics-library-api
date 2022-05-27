const { DataTypes } = require('sequelize');
const db = require('../db');

const Rating = db.define('rating', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  rating: {
    type: DataTypes.INTEGER,
    validate: {
      min: 0,
      max: 10,
    },
  },
});

module.exports = Rating;
