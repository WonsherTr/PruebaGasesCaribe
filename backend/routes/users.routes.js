const r = require('express').Router();
const { getAll } = require('../controllers/users.controller');
r.get('/', getAll);
module.exports = r;
