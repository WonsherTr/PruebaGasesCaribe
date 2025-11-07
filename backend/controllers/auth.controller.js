const { register, login } = require('../services/auth.service');

exports.register = async (req, res) => {
  try {
    const user = await register(req.body);
    res.status(201).json(user);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

exports.loginDummy = async (req, res) => {
  try {
    const { token } = await login({ email: req.body.email, dummy: true });
    res.json({ token });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { token } = await login({ email: req.body.email, password: req.body.password });
    res.json({ token });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};
