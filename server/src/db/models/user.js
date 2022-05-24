const Sequelize = require('sequelize');
const crypto = require('crypto');
const db = require('../db');

const User = db.define(
  'user',
  {
    email: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
    },
    passwordDigest: {
      type: Sequelize.STRING,
      validate: {
        min: 6,
      },
      allowNull: false,
    },
    salt: {
      type: Sequelize.STRING,
    },
  },
  {
    timestamps: true,
  }
);

User.correctPassword = function (user, password) {
  return User.encryptPassword(password, user.salt) === user.passwordDigest;
};

User.createSalt = function () {
  return crypto.randomBytes(16).toString('base64');
};

User.encryptPassword = function (plainPassword, salt) {
  return crypto
    .createHash('RSA-SHA256')
    .update(plainPassword)
    .update(salt)
    .digest('hex');
};

const setSaltAndPassword = (user) => {
  if (user.changed('passwordDigest')) {
    user.salt = User.createSalt();
    user.passwordDigest = User.encryptPassword(user.passwordDigest, user.salt);
  }
};

User.beforeCreate(setSaltAndPassword);
User.beforeUpdate(setSaltAndPassword);
User.beforeBulkCreate((users) => {
  users.forEach(setSaltAndPassword);
});

module.exports = User;
