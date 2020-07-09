const express = require('express');

const router = express.Router();

const db = require('../models');

const { Op } = db.Sequelize;
const { verifyToken, generateToken } = require('../services/auth');

router.get('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const user = await db.User.findOne({
      where: {
        id: {
          [Op.eq]: id
        }
      }
    });
    res.json(user);
  } catch (err) {
    console.error(err);
  }
});

router.post('/', async (req, res) => {
  try {
    const { user } = req.body;
    await db.User.create(user);
    res.status(200).json('hello');
  } catch (err) {
    console.error(err);
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { user } = req.body;
    await db.User.update(user, {
      where: {
        id: {
          [Op.eq]: id
        }
      }
    });
    res.status(200).json('success');
  } catch (err) {
    console.error(err);
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await db.User.findOne({
      where: {
        email: {
          [Op.eq]: email.trim()
        },
        password: {
          [Op.eq]: password.trim()
        }
      }
    });
    if (user) {
      const token = await generateToken(user);
      return res.json({
        token,
        user
      });
    }
    res.status(400).json({
      error: 1
    });
  } catch (err) {
    console.error(err);
  }
});

router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    let user = await db.User.findOne({
      where: {
        email: {
          [Op.eq]: email.trim()
        }
      },
    });
    if (user) {
      return res.status(400).json({
        error: 1
      });
    }
    user = await db.User.create({
      email,
      password,
      name
    });
    const token = await generateToken(user);
    res.status(200).json({ token, user });
  } catch (err) {
    console.error(err);
  }
});

module.exports = express();
