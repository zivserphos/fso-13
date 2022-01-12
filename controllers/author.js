const jwt = require('jsonwebtoken');
const router = require('express').Router();
const sequelize = require('sequelize');
const { SECRET } = require('../util/config');

const { Blog, User } = require('../models/index');

router.get('/', async (req, res) => {
  try {
    const authors = await Blog.findAll({
      attributes: [
        'author',
        [sequelize.fn('COUNT', sequelize.col('title')), 'articles'],
        [sequelize.fn('SUM', sequelize.col('likes')), 'likes'],
      ],
      group: 'author',
    });
    res.send(authors);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
