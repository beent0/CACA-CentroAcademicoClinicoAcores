const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');

describe('Auth API', () => {
  beforeAll(async () => {
    // Liga ao MongoDB de teste ou usa o atual local
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('deve retornar erro ao tentar login com credenciais inválidas', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'naoexiste@teste.com',
        password: 'wrongpassword'
      });
    
    expect(res.statusCode).toEqual(401);
    expect(res.body.success).toBe(false);
  });

  it('deve retornar erro ao tentar registar com email inválido', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        nome: 'Teste',
        email: 'email-invalido',
        password: '123'
      });
    
    expect(res.statusCode).toEqual(400);
  });
});
