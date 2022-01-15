const jwt = require('jsonwebtoken');
const router = require('express').Router();
const { Sessions } = require('../models/index');
const { SECRET } = require('../util/config');
const validateEmail = require('../util/validateEmail');

const User = require('../models/user');

router.post('/sign-up', async (req, res) => {
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

router.post('/', async (request, response) => {
  try {
    const body = request.body;

    const user = await User.findOne({
      where: {
        username: body.username,
      },
    });

    const passwordCorrect = body.password === 'secret';
    if (!(user && passwordCorrect)) {
      return response.status(401).json({
        error: 'invalid username or password',
      });
    }

    const userForToken = {
      username: user.username,
      id: user.id,
    };

    const token = jwt.sign(userForToken, SECRET, { expiresIn: 60 * 60 });
    const session = await Sessions.create({
      userId: user.id,
      token: token,
    });
    user.update({ enabled: true });
    response
      .status(200)
      .send({ token, username: user.username, name: user.name });
  } catch (err) {
    console.log(err);
  }
});

router.delete('/', async (req, res) => {
  try {
    const authorization = req.get('authorization');
    const currentToken = authorization.substring(7);
    const isUserLogged = await localSessionExtractor(currentToken);
    if (isUserLogged.id) {
      const deletedSessions = await Sessions.findOne({
        where: { userId: isUserLogged.id },
      });
      await deletedSessions.destroy();
      const userToDisable = await User.findOne({
        where: { id: isUserLogged.id },
      });
      userToDisable.update({ enabled: false });
      res.status(200).json({ message: ' Logged out ' });
    } else {
      return res.status(401).json({
        error: 'You must be logged in to logout :joy:',
      });
    }
  } catch (error) {
    res.status(400).json("Delete didn't pass well");
  }
});
const localSessionExtractor = async (token) => {
  const session = await Sessions.findOne({ where: { token: token } });
  if (session) {
    return {
      isHe: true,
      id: session.userId,
    };
  } else {
    return false;
  }
};

module.exports = router;
