const express = require('express');

const router = express.Router();

const db = require('../models');
const { verifyToken } = require('../services/auth');

router.post('/', verifyToken, async (req, res) => {
  try {
    const {
      coordinates, address, name, description
    } = req.body;
    await db.Place.create({
      coordinates,
      address,
      name,
      description,
      creator_id: req.user.id
    });
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
