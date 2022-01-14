const { User, Blog } = require('../models');
const ReadingList = require('../models/readingList');
const router = require('express').Router();

router.get('/', async (req, res) => {
  try {
    const readingList = await ReadingList.findAll({
      // include: [
      //   {
      //     model: User,
      //     attributes: ['name'],
      //   },
      //   {
      //     model: Blog,
      //     attributes: { exclude: 'user_Id' },
      //   },
      // ],
    });
    res.json(readingList);
  } catch (err) {
    console.log(err);
  }
});

router.post('/', async (req, res) => {
  try {
    console.log(req.body);
    const addedBlog = await ReadingList.create({
      ...req.body,
    });
    console.log(addedBlog);
    res.json(addedBlog);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
