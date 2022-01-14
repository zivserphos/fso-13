const router = require('express').Router();
const validateEmail = require('../util/validateEmail');
const { User, Blog, ReadingList } = require('../models');

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

// router.post("/", async (req, res) => {
//   try {
//     const username = req.body.username;
//     if (!validateEmail(username)) {
//       throw "Username must be a valid email";
//     }
//     console.log(validateEmail(username));
//     const user = await User.create(req.body);
//     res.json(user);
//     res.end();
//   } catch (error) {
//     return res.status(400).json({ error });
//   }
// });

router.post('/', async (req, res) => {
  try {
    const username = req.body.username;
    if (!validateEmail(username)) {
      throw 'Username must be a valid email';
    }
    const user = await User.create(req.body);
    res.json(user);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: [''] },
      include: [
        {
          model: Blog,
          as: 'reading',
          attributes: { exclude: ['userId'] },
          through: {
            attributes: [],
          },
        },
        {
          model: ReadingList,
          attributes: { exclude: ['userId', 'blogId'] },
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
