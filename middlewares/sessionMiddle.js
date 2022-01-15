const Sessions = require('../models/sessions');
const User = require('../models/user');
const { SECRET } = require('../util/config');
const jwt = require('jsonwebtoken');

const sessionExtractor = async (req, res, next) => {
  try {
    const authorization = req.get('authorization');
    const currentToken = authorization.substring(7);
    const session = await Sessions.findOne({ where: { token: currentToken } });

    if (session) {
      next();
      return true;
    } else {
      const user = jwt.verify(currentToken, SECRET);
      const userToDisable = await User.findOne({
        where: { id: user.id },
      });
      userToDisable.update({ enabled: false });
      res.status(403).json({ error: 'Token expired , please login again !' });
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = sessionExtractor;
