const { me, updateMe } = require('../services/auth.service');

exports.getMe = async (req, res) => {
  const data = await me(req.auth.sub);
  res.json(data);
};

exports.updateMe = async (req, res) => {
  try {
    const data = await updateMe(req.auth.sub, req.body);
    res.json(data);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};
