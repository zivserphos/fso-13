const router = require("express").Router();
const { Op } = require("sequelize");
const { Blog, User } = require("../models/index");

const BlogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id);
  next();
};

router.get("/", async (req, res) => {
  let where = {};

  if (req.query.search) {
    where = {
      [Op.or]: [
        {
          title: {
            [Op.substring]: req.query.search,
          },
        },
        {
          author: {
            [Op.substring]: req.query.search,
          },
        },
      ],
    };
  }

  const blogs = await Blog.findAll({
    attributes: { exclude: ["userId"] },
    include: {
      model: User,
      attributes: ["name"],
    },
    where,
  });
  res.json(blogs);
});

router.post("/", async (req, res, next) => {
  try {
    const user = await User.findByPk(req.decodedToken.id);
    const blog = await Blog.create({
      ...req.body,
      userId: user.id,
      date: new Date(),
    });
    res.json(blog);
  } catch (error) {
    next(error);
    // return res.status(400).json({ error });
  }
});

router.get("/:id", BlogFinder, async (req, res) => {
  if (req.blog) {
    res.json(req.blog);
  } else {
    res.status(404).end();
  }
});

router.delete("/:id", BlogFinder, async (req, res) => {
  if (!req.blog) res.status(404).json("not exist");
  if (req.decodedToken.id === req.blog.userId) {
    await req.blog.destroy();
    res.json("blog has deleted successfully");
  } else {
    res.status(401).json("UNAUTORIZED");
  }
});

router.put("/:id", BlogFinder, async (req, res) => {
  console.log(req.blog.toJSON());
  if (req.blog) {
    await req.blog.update({ likes: req.body.likes });
    res.send(req.blog);
  }
  res.status(400).send("bad request");
});

module.exports = router;
