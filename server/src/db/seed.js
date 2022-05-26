/* eslint-disable no-console */

const fs = require('fs');
const seedrandom = require('seedrandom');

const { User, Book, Loan } = require('./models');
const db = require('./db');

const rawUsers = fs.readFileSync('src/db/json/users.json');
const { users: userJsons } = JSON.parse(rawUsers);

const rawBooks = fs.readFileSync('src/db/json/books.json');
const { books: bookJsons } = JSON.parse(rawBooks);

const _RANDOM_SEED = 294729043;
const _MAX_NUM_LOANS = 50;
const _MIN_DATE = Date.UTC(2021, 0);
const _MAX_DATE = Date.now();

const _MIN_LOAN_DURATION_IN_MS = 1 * 60 * 60 * 100; // 1 hour
const _MAX_LOAN_DURATION_IN_MS = 6 * 30 * 24 * 60 * 60 * 100; // 6 months

seedrandom(_RANDOM_SEED, { global: true });

const randomDateEpoch = (minDate = _MIN_DATE, maxDate = _MAX_DATE) => {
  const msDiff = maxDate - minDate;
  const msElapsed = Math.floor(Math.random() * msDiff);
  const clampedMsElapsed = Math.min(
    Math.max(msElapsed, _MAX_LOAN_DURATION_IN_MS),
    _MIN_LOAN_DURATION_IN_MS
  );

  const result = minDate + clampedMsElapsed;
  return result;
};

const epochToDateStr = (epoch) => new Date(epoch).toUTCString();

async function seed() {
  await db.sync({ force: true });
  console.log('db schema synced!');

  // Users
  const userPromises = Promise.all(
    userJsons.map(async ({ name }) => {
      try {
        const user = await User.create({
          name,
        });
        return user;
      } catch (error) {
        console.log('Something went wrong while creating a user:', error);
      }
    })
  );

  // Books
  const bookPromises = Promise.all(
    bookJsons.map(async ({ name }) => {
      try {
        const book = await Book.create({
          name,
        });
        return book;
      } catch (error) {
        console.log('Something went wrong while creating a book:', error);
      }
    })
  );

  const users = await userPromises;
  const books = await bookPromises;

  console.log(`Successfully created ${users.length} users!`);
  console.log(`Successfully created ${books.length} books!`);

  // Loans
  let numLoansCreated = 0;
  const loanPromises = users.flatMap(async (user) => {
    try {
      const numLoans = Math.floor(Math.random() * _MAX_NUM_LOANS);
      const loanArray = Array.from({ length: numLoans }, (i) => i);
      const loanPromisesForUser = loanArray.flatMap(() => {
        // NOTE: Exclude last book so we always have one without a score.
        const bookIdx = Math.floor(Math.random() * (books.length - 1));
        const book = books[bookIdx];
        const loanedAt = randomDateEpoch();

        const isReturned = !!Math.round(Math.random());
        const maxReturnDate = Math.min(
          loanedAt + _MAX_LOAN_DURATION_IN_MS,
          _MAX_DATE
        );
        const returnedAt = isReturned
          ? randomDateEpoch(loanedAt, maxReturnDate)
          : null;
        const score = isReturned ? Math.floor(Math.random() * 10) : null;

        console.log(loanedAt, returnedAt);

        const loan = Loan.create({
          userId: user.id,
          bookId: book.id,
          loanedAt,
          returnedAt,
          score,
        }).then(() => (numLoansCreated += 1));

        return loan;
      });

      return Promise.all(loanPromisesForUser);
    } catch (error) {
      console.log('Something went wrong while simulating a loan: ', error);
    }
  });

  await Promise.all(loanPromises);

  console.log(`Successfully created ${numLoansCreated} loans!`);
}

async function runSeed() {
  console.log('seeding...');
  try {
    await seed();
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  }
}

if (module === require.main) {
  runSeed();
}

module.exports = { runSeed };
