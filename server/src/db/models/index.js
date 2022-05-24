const User = require('./user');
const Account = require('./account');
const Transaction = require('./transaction');

User.hasMany(Account);
Account.belongsTo(User, {
  foreignKey: 'userId'
});

User.hasMany(Transaction);
Transaction.belongsTo(User, {
  foreignKey: 'userId'
});

Account.hasMany(Transaction);
Transaction.belongsTo(Account, {
  foreignKey: 'accountId'
});

module.exports = {
  User,
  Account,
  Transaction,
};
