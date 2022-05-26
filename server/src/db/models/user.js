const Sequelize = require('sequelize');
const db = require('../db');

// NOTE: A more elaborate check might be in order if we really wanted to tighten up dirty names.
const _USER_NAME_REGEX = /^[\p{L}\-'. ]+$/iu;

const User = db.define('user', {
  id: {
    type: Sequelize.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      is: {
        args: _USER_NAME_REGEX,
        msg: 'Can only contain unicode alphabetic characters, spaces, or special characters "-", "\'", ".".',
      },
      len: [2],
    },
  },
});

module.exports = User;
