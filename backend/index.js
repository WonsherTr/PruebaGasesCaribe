require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => res.send('Welcome to assessment API'));
app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.use('/auth', require('./routes/auth.routes'));
app.use('/users', require('./routes/users.routes'));
app.use('/profile', require('./routes/profile.routes'));

const port = process.env.PORT || 3001;
sequelize.authenticate().then(() => {
  console.log('DB connected');
  app.listen(port, () => console.log(`API http://localhost:${port}`));
}).catch((e) => {
  console.error('DB error:', e);
  process.exit(1);
});
