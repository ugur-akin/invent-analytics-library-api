const User = require('./user');
const Book = require('./book');
const Loan = require('./loan');
const Rating = require('./rating');

User.hasMany(Loan);
Loan.belongsTo(User);

Book.hasMany(Loan);
Loan.belongsTo(Book);

User.hasMany(Rating);
Rating.belongsTo(User);
Book.hasMany(Rating);
Rating.belongsTo(Book);

Rating.hasOne(Loan);
Loan.belongsTo(Rating);

module.exports = {
  User,
  Book,
  Loan,
  Rating,
};
