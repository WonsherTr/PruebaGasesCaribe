const r = require('express').Router();
const ctrl = require('../controllers/auth.controller');

// Dummy login (como exige el README)
r.post('/login', ctrl.loginDummy);

// Opcionales completos (login y registro reales)
r.post('/register', ctrl.register);
r.post('/login/real', ctrl.login);

module.exports = r;
