const router = require('express').Router();
const { User } = require('../db/models');
const { generateSignedJWT } = require('../utils');

/**
 * Signup a new user
 * req.body is expected to contain {email: required(string), password: required(string)}
 */
router.post('/signup', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'email and password required' });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: 'Password must be at least 6 characters' });
    }

    const user = await User.create({ email, passwordDigest: password });

    const token = generateSignedJWT(user.id);
    res.json({
      ...user.toJSON(),
      token,
    });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res
        .status(400)
        .json({ error: 'User with provided email already exists' });
    }
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ error: 'Validation error' });
    }
    next(error);
  }
});

/**
 * Authenticate an existing user
 * req.body is expected to contain {email: required(string), password: required(string)}
 */
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'email and password required' });
    }

    const user = await User.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (!user) {
      return res.status(401).json({ error: 'Wrong email and/or password' });
    }
    if (!User.correctPassword(user, password)) {
      return res.status(401).json({ error: 'Wrong email and/or password' });
    }
    const token = generateSignedJWT(user.id);

    res.json({
      ...user.toJSON(),
      token,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Get the authenticated user
 */
router.get('/user', async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Please log in' });
    }
    res.json({
      ...req.user,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
