const User = require('./user');
const Book = require('./book');
const Loan = require('./loan');
const Rating = require('./rating');

User.hasMany(Loan);
Loan.belongsTo(User, {
  foreignKey: {
    allowNull: false,
  },
});

Book.hasMany(Loan);
Loan.belongsTo(Book, {
  foreignKey: {
    allowNull: false,
  },
});

User.hasMany(Rating);
Rating.belongsTo(User, {
  foreignKey: {
    allowNull: false,
  },
});
Book.hasMany(Rating);
Rating.belongsTo(Book, {
  foreignKey: {
    allowNull: false,
  },
});

Rating.hasOne(Loan);
Loan.belongsTo(Rating);

module.exports = {
  User,
  Book,
  Loan,
  Rating,
};
