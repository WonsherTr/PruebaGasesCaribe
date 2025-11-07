const { User } = require('../models');
module.exports = {
  list: () => User.findAll({ attributes: { exclude: ['passwordHash'] } })
};
