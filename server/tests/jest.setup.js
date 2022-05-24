const { beforeEach } = require('@jest/globals');
const { runSeed } = require('../src/db/seed');

// Seed db before each test case.
beforeEach(async () => {
  await runSeed();
});
