const router = require("express").Router();
const validateEmail = require("../util/validateEmail");
const { User, Blog } = require("../models");

router.get("/", async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      attributes: { exclude: ["userId"] },
    },
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

router.post("/", async (req, res) => {
  try {
    const username = req.body.username;
    if (!validateEmail(username)) {
      throw "Username must be a valid email";
    }
    const user = await User.create(req.body);
    res.json(user);
  } catch (error) {
    return res.status(400).json(error);
  }
});

router.get("/:id", async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (user) {
    res.json(user);
  } else {
    res.status(404).end();
  }
});

router.put("/:username", async (req, res) => {
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
      res.status(400).send("Bad Request");
    }
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;
