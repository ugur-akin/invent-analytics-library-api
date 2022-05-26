const User = require('./user');
const Book = require('./book');
const Loan = require('./loan');

User.hasMany(Loan);
Loan.belongsTo(User);

Book.hasMany(Loan);
Loan.belongsTo(Book);

module.exports = {
  User,
  Book,
  Loan,
};
