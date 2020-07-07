const express = require('express');

const router = express.Router();

const db = require('../models');

const { Op } = db.Sequelize;

router.get('/', async (req, res) => {
  try {
    const places = await db.ArtPlace.findAll();
    res.json(places);
  } catch (err) {
    console.error(err);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const place = await db.ArtPlace.findOne({
      where: {
        id: {
          [Op.eq]: id
        }
      }
    });
    res.status(200).json(place);
  } catch (err) {
    console.error(err);
  }
});

router.post('/', async (req, res) => {
  try {

  } catch (err) {
    console.error(err);
  }
});

router.put('/:id', async (req, res) => {
  try {

  } catch (err) {
    console.error(err);
  }
});

module.exports = express();
