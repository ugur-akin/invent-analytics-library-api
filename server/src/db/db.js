const Sequelize = require('sequelize');

const db = new Sequelize('database', '', '', {
  dialect: 'sqlite',
  storage: 'database.db',
  logging: false,
  define: {
    defaultScope: {
      attributes: { exclude: ['createdAt', 'updatedAt'] },
    },
  },
});

module.exports = db;
