/* eslint-disable no-console */

const fs = require('fs');
const seedrandom = require('seedrandom');

const { User, Book, Borrow } = require('./models');
const db = require('./db');

const rawUsers = fs.readFileSync('src/db/json/users.json');
const { users: userJsons } = JSON.parse(rawUsers);

const rawBooks = fs.readFileSync('src/db/json/books.json');
const { books: bookJsons } = JSON.parse(rawBooks);

const _RANDOM_SEED = 294729043;
const _MAX_NUM_BORROWS = 50;
const _MIN_DATE = Date.UTC(2021, 0);
const _MAX_DATE = Date.now();

const _MIN_BORROW_DURATION_IN_MS = 1 * 60 * 60 * 100; // 1 hour
const _MAX_BORROW_DURATION_IN_MS = 10 * 24 * 60 * 60 * 100; // 10 days

seedrandom(_RANDOM_SEED, { global: true });

const randomDate = (minDate = _MIN_DATE, maxDate = _MAX_DATE) => {
  const msDiff = maxDate - minDate;
  const msElapsed = Math.floor(Math.random() * msDiff);
  const clampedMsElapsed = Math.min(
    Math.max(msElapsed, _MAX_BORROW_DURATION_IN_MS),
    _MIN_BORROW_DURATION_IN_MS
  );
  const result = minDate + clampedMsElapsed;
  return result;
};

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

  // Borrows
  let numBorrowsCreated = 0;
  const borrowPromises = users.flatMap(async (user) => {
    try {
      const numBorrows = Math.floor(Math.random() * _MAX_NUM_BORROWS);
      const borrowArray = Array.from({ length: numBorrows }, (i) => i);
      const borrowPromisesForUser = borrowArray.flatMap(() => {
        // NOTE: Exclude last book so we always have one without a score.
        const bookIdx = Math.floor(Math.random() * books.length);
        const book = books[bookIdx];
        const takenAt = randomDate();

        const isReturned = !!Math.round(Math.random());
        const returnedAt = isReturned ? randomDate(takenAt) : null;

        const score = isReturned ? Math.floor(Math.random() * 10) : null;

        const borrow = Borrow.create({
          userId: user.id,
          bookId: book.id,
          takenAt,
          returnedAt,
          score,
        }).then(() => (numBorrowsCreated += 1));

        return borrow;
      });

      return Promise.all(borrowPromisesForUser);
    } catch (error) {
      console.log('Something went wrong while simulating a borrow: ', error);
    }
  });

  await Promise.all(borrowPromises);

  console.log(`Successfully created ${numBorrowsCreated} borrows!`);
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
