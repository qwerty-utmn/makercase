const express = require('express');

const router = express.Router();

const { check, validationResult } = require('express-validator');
const db = require('../models');

const { Op } = db.Sequelize;
const { verifyToken } = require('../services/auth');

const upload = require('../scripts/fileUpload');
const { sequelize } = require('../models');
const moment = require('moment');

router.get('/', async (req, res) => {
  try {
    const places = await db.ArtPlace.findAll({
      include: [{
        model: db.Image
      }]
    });
    res.status(200).json(places);
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

router.post('/', verifyToken, upload.array('images', 3), async (req, res) => {
  try {
    const {
      coordinates, name, description, author_name
    } = req.body;
    const formattedCoortdinates = coordinates.map((coord) => +coord);
    const newArtPlace = await db.ArtPlace.create({
      coordinates: formattedCoortdinates,
      name,
      description,
      author_name
    });
    const imagesArray = req.files.map(file => ({ path: file.filename, artPlace_id: +newArtPlace.id }));
    await db.Image.bulkCreate(imagesArray);
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
  }
});

function customIsFloat(n) {
  return Number(n) === n && n % 1 !== 0;
}

router.post('/:id/comment', verifyToken, async (req, res) => {
  const { text } = req.body;
  const artPlace = await db.ArtPlace.findOne({
    where: {
      id: {
        [Op.eq]: +req.params.id
      }
    }
  });
  console.log('ArtPlace', artPlace);
  await sequelize.query(`INSERT INTO "Comment" ("user_id","artPlace_id","text", "createdAt", "updatedAt") VALUES (${req.user.id},${artPlace.id},'${text}','${moment().format('YYYY/MM/DD HH:mm:ss')}','${moment().format('YYYY/MM/DD HH:mm:ss')}')`);
  res.sendStatus(200);
});

router.post('/:id/mark', verifyToken, async (req, res) => {
  const { mark } = req.body;
  const artPlace = await db.ArtPlace.findOne({
    where: {
      id: {
        [Op.eq]: req.params.id
      }
    }
  });
  await db.Mark.create({
    artPlace_id: artPlace.id,
    user_id: req.user.id,
    mark
  });
  res.sendStatus(200);
});

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

router.put('/:id/image', upload.array('images', 3), async (req, res) => {
  if (req.files && req.files.length) {
    try {
      const imagesArray = req.files.map(file => ({ path: file.filename, artPlace_id: +req.params.id }));
      await db.Image.bulkCreate(imagesArray);
      res.sendStatus(200);
    } catch (err) {
      res.status(400).json(err);
      console.log(err);
    }
  } else {
    console.log('no files to add in artPlace');
  }
});

module.exports = router;
