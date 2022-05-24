const User = require('./user');
const Book = require('./book');
const Borrow = require('./borrow');

User.hasMany(Borrow);
Borrow.belongsTo(User);

Book.hasMany(Borrow);
Borrow.belongsTo(Book);

module.exports = {
  User,
  Book,
  Borrow,
};
