const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');

// Mock minimal models layer to avoid DB for unit tests
jest.mock('../models', () => ({
  User: { findAll: jest.fn().mockResolvedValue([]) }
}), { virtual: true });

const usersRoutes = require('../routes/users.routes');
const authRoutes = require('../routes/auth.routes');

const app = express();
app.use(express.json());
app.use('/users', usersRoutes);
app.use('/auth', authRoutes);

describe('Required endpoints (dummy auth + users list)', () => {
  test('POST /auth/login returns a JWT with sub:-1', async () => {
    const res = await request(app).post('/auth/login').send({ email: 'a@b.com' });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeTruthy();
    // decode (without verifying secret) just to inspect payload
    const payload = JSON.parse(Buffer.from(res.body.token.split('.')[1], 'base64').toString());
    expect(payload.sub).toBe(-1);
  });

  test('GET /users returns an array (empty mocked)', async () => {
    const res = await request(app).get('/users');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
