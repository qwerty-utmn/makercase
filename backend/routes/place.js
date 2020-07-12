const express = require('express');
const upload = require('../scripts/fileUpload');

const router = express.Router();

const db = require('../models');
const { verifyToken } = require('../services/auth');

router.post('/', verifyToken, upload.array('images', 3), async (req, res) => {
  try {
    const {
      coordinates, name, description, address
    } = req.body;
    const formattedCoortdinates = coordinates.map((coord) => +coord);
    const newPlace = await db.Place.create({
      coordinates: formattedCoortdinates,
      name,
      description,
      address,
      creator_id: req.user.id
    });
    const imagesArray = req.files.map(file => ({ path: file.filename, artPlace_id: +newPlace.id }));
    await db.Image.bulkCreate(imagesArray);
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
  }
});

router.get('/', async (req, res) => {
  try {
    const places = await db.Place.findAll();
    res.status(200).json(places);
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
