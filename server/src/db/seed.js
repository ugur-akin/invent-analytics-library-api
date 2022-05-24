/* eslint-disable no-console */

const fs = require('fs');

const { DateTime } = require('luxon');
const { User, Account, Transaction } = require('./models');
const db = require('./db');

const rawAccounts = fs.readFileSync('src/db/json/accounts.json');
const { accounts } = JSON.parse(rawAccounts);

const rawTransactions = fs.readFileSync('src/db/json/transactions.json');
const { transactions } = JSON.parse(rawTransactions);

const strToDate = (dateStr) => DateTime.fromJSDate(new Date(dateStr));

async function seed() {
  await db.sync({ force: true });
  console.log('db schema synced!');

  // Users
  const user1 = await User.create({
    email: 'test@test.com',
    passwordDigest: 'sample',
  });

  // Accounts
  const accountLookup = {};
  accounts.forEach(async (accountJSON) => {
    try {
      const account = await Account.create({
        name: accountJSON.name,
        plaidAccountId: accountJSON.plaid_account_id,
        mask: accountJSON.mask,
        officialName: accountJSON.official_name,
        currentBalance: Number.parseFloat(accountJSON.current_balance),
        isoCurrencyCode: accountJSON.iso_currency_code,
        unofficialCurrencyCode: accountJSON.unofficial_currency_code,
        accountSubtype: accountJSON.account_subtype,
        accountType: accountJSON.account_type,
      });
      accountLookup[account.plaidAccountId] = account;
      account.setUser(user1);
    } catch (error) {
      console.log('error', error);
    }
  });

  // Transactions
  let latestDateFound = strToDate(transactions[0].date);
  transactions.forEach((transaction) => {
    if (strToDate(transaction.date) > latestDateFound) {
      latestDateFound = strToDate(transaction.date);
    }
  });

  const today = DateTime.now();
  const monthsOffsetFromToday = (today.year - latestDateFound.year) * 12
    + (today.month - latestDateFound.month);

  const monthsOffsetFromLastMonth = monthsOffsetFromToday > 0 ? monthsOffsetFromToday - 1 : 0;

  transactions.forEach(async (transactionJSON) => {
    // Shift dates so the transactions are dated up to and including the end of last month
    const transactionDate = strToDate(transactionJSON.date);
    const shiftedTransactionDate = transactionDate.plus({
      months: monthsOffsetFromLastMonth,
    });
    const transaction = await Transaction.create({
      plaidTransactionId: transactionJSON.plaid_transaction_id,
      plaidCategoryId: transactionJSON.plaid_category_id,
      categories: transactionJSON.categories,
      type: transactionJSON.type,
      name: transactionJSON.name,
      amount: transactionJSON.amount,
      isoCurrencyCode: transactionJSON.iso_currency_code,
      unofficialCurrencyCode: transactionJSON.unofficial_currency_code,
      date: shiftedTransactionDate.toSQL(),
      pending: transactionJSON.pending,
    });

    transaction.setAccount(accountLookup[transactionJSON.plaid_account_id]);
    transaction.setUser(user1);
  });

  console.log('seeded users, accounts and transactions');
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
