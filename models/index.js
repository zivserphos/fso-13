const Blog = require('./blog');
const User = require('./user');
const ReadingList = require('./readingList');
const Sessions = require('./sessions');

User.hasMany(Blog);
Blog.belongsTo(User);

User.belongsToMany(Blog, { through: ReadingList, as: 'reading' });
Blog.belongsToMany(User, { through: ReadingList });
User.hasMany(ReadingList);

module.exports = {
  Blog,
  User,
  ReadingList,
  Sessions,
};
