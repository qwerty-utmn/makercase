const express = require('express');

const router = express.Router();

const { check, validationResult } = require('express-validator');
const db = require('../models');
const { route } = require('./user');
const { sequelize } = require('../models');

const { Op } = db.Sequelize;

router.get('/', async (req, res) => {
  try {
    const places = await db.ArtPlace.findAll();
    res.status(200).json(place);
  } catch (err) {
    console.error(err);
  }
});
/*
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
*/
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const place = await db.ArtPlace.findOne({
      where: {
        id: {
          [Op.eq]: id
        }
      },
      include: [{
        model: db.Image
      }]
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

function customIsFloat(n) {
  return Number(n) === n && n % 1 !== 0;
}

router.put('/:id', [
  check('coordinates', 'error in lon')
    .custom(value => customIsFloat(value[0])),
  check('coordinates', 'error in lat')
    .custom(value => customIsFloat(value[1])),
  check('name', 'Name length should be 2 to 30 characters')
    .isLength({ min: 2, max: 30 }),
  check('description', 'Description length should be max 255 chars')
    .isLength({ min: 1, max: 255 }),
  check('author_name', 'Author_name length should be 2 to 30 characters')
    .isLength({ min: 2, max: 30 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.json(errors);
    } else {
      const {
        coordinates, name, description, author_name
      } = req.body;
      console.log(req.body);
      db.ArtPlace.findOrCreate({
        where: {
          id: req.params.id
        },
        defaults: {
          coordinates,
          name,
          description,
          author_name
        }
      }).then((result) => res.json(result));
    }
  } catch (err) {
    console.error(err);
  }
});
module.exports = router;
