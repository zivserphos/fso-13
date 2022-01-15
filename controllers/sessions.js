const sessionsRouter = require('express').Router();
const Sessions = require('../models/sessions');
sessionsRouter.get('/', async (req, res) => {
  console.log('Ggggggggggggggggggggg');
  try {
    const activeSessions = await Sessions.findAll();
    res.send(activeSessions);
  } catch (error) {
    res.status(400).json({ error: "couldn't load sessions" });
  }
});

module.exports = sessionsRouter;
