const r = require('express').Router();
const requireAuth = require('../middlewares/auth.middleware');
const ctrl = require('../controllers/profile.controller');

r.get('/me', requireAuth, ctrl.getMe);
r.put('/me', requireAuth, ctrl.updateMe);

module.exports = r;
