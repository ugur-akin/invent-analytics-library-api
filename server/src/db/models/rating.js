const sequelize = require('sequelize');
const db = require('../db');

const Rating = db.define('rating', {
  id: {
    type: sequelize.DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  rating: {
    type: sequelize.DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0,
      max: 10,
    },
  },
  userId: {
    type: sequelize.DataTypes.BIGINT,
    allowNull: false,
  },
  bookId: {
    type: sequelize.DataTypes.BIGINT,
    allowNull: false,
  },
});

/**
 * Calculate average rating for a book.
 * Takes a function name to determine how to
 * aggregate multiple ratings by the same user.
 * Returns null if no ratings have been recorded.
 *
 * @param {Number} bookId
 * @param {Object} options options to be forwarded into query.
 * @returns Array<Loan>
 */
Rating.getAverageRatingForBook = async function (
  bookId,
  options,
  userAggFn = 'MAX'
) {
  const [queryResult] = await db.query(
    `
  SELECT AVG(aggRating) as avgRating 
  FROM ( 
    SELECT bookId, userId, ${userAggFn}(rating) as aggRating 
    from ratings
  GROUP BY userId)
  WHERE bookId = ${bookId};`,
    { type: sequelize.QueryTypes.SELECT }
  );

  console.log(queryResult);
  return queryResult.avgRating;
};

module.exports = Rating;
