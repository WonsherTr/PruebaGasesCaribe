const request = require('supertest');
const express = require('express');

// Small app wrapper to test routes without hitting a real DB
function buildApp() {
  const app = express();
  app.get('/api/health', (_req, res) => res.json({ ok: true }));
  app.get('/', (_req, res) => res.send('Welcome to assessment API'));
  return app;
}

describe('Health & Root endpoints', () => {
  const app = buildApp();

  it('GET /api/health -> { ok: true }', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true });
  });

  it('GET / -> welcome message', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.text).toMatch(/Welcome to assessment API/);
  });
});
