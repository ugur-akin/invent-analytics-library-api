const globals = require('@jest/globals');
const request = require('supertest');
const app = require('../src/app');
const { User } = require('../src/db/models');
const { generateSignedJWT } = require('../src/utils');
const { TEST_USER } = require('./utils');

const {
  describe, it, expect
} = globals;

describe('POST /api/signup', () => {
  const newUser = {
    email: 'test2@test.com',
    rawPassword: 'secr3t'
  };
  it('should allow a new user to signup', async () => {
    const res = await request(app)
      .post('/api/signup')
      .send({ email: newUser.email, password: newUser.rawPassword });
    expect(res.body.email).toEqual(newUser.email);
    expect(res.body.id).toEqual(2);
    expect(res.status).toEqual(200);
    expect(res.body.token).toBeTruthy();
  });

  it('should not allow a duplicate user to sign up', async () => {
    await User.create({
      email: newUser.email,
      passwordDigest: newUser.rawPassword
    });
    const res = await request(app)
      .post('/api/signup')
      .send({ email: newUser.email, password: newUser.rawPassword });
    expect(res.status).toEqual(400);
  });
});

describe('GET /api/user', () => {
  it(`should return the authenticated user (${TEST_USER.email}) and jwt token.`, async () => {
    const res = await request(app)
      .get('/api/user').set('Authorization', `Bearer ${generateSignedJWT(TEST_USER.id)}`)
      .send();
    expect(res.body.email).toEqual(TEST_USER.email);
    expect(res.body.id).toEqual(1);
    expect(res.status).toEqual(200);
  });
});
