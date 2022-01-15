const router = require('express').Router();
const { User, Blog, ReadingList } = require('../models');
const { Op } = require('sequelize');

router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: [
      {
        model: Blog,
        attributes: { exclude: ['userId'] },
      },
      {
        model: Blog,
        as: 'reading',
        attributes: { exclude: ['userId'] },
        through: {
          attributes: [],
        },
      },
    ],
  });
  res.json(users);
});

router.get('/:id', async (req, res) => {
  console.log(req.query.read);
  let where = {};
  try {
    if (req.query.read) {
      where = {
        read: {
          [Op.eq]: req.query.read,
        },
      };
    }
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: [''] },
      include: [
        {
          model: Blog,
          as: 'reading',
          attributes: { exclude: ['userId'] },
          through: {
            attributes: { exclude: ['userId', 'createdAt', 'updatedAt'] },
            through: { attributes: ['read', 'id'] },
            where,
          },
        },
      ],
    });
    if (user) {
      res.json(user);
    } else {
      res.status(404).end();
    }
  } catch (err) {
    console.log(err);
  }
});

router.put('/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const { newUserName } = req.body;
    const user = await User.findOne({
      where: {
        username: username,
      },
    });
    if (user) {
      user.update({ username: newUserName });
    } else {
      res.status(400).send('Bad Request');
    }
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;
