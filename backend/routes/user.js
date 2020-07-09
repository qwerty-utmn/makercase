const express = require('express');

const router = express.Router();

const db = require('../models');

const { Op } = db.Sequelize;

router.get('/:id', async (req, res) => {
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
  } catch (err) {
    console.error(err);
  }
});

module.exports = express();
