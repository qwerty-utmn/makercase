const express = require('express');

const router = express.Router();

const db = require('../models');

router.get('/:id', async (req, res) => {
  try {
    const images = await db.Image.findAll({
      where: {
        artPlace_id: req.params.id
      }
    });
    res.status(200).json(images);
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;