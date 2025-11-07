const { list } = require('../services/users.service');
exports.getAll = async (_req, res) => {
  const users = await list();
  res.json(users);
};
