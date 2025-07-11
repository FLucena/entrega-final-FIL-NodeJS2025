import request from 'supertest';
import { mockFirestore } from './mocks/firebase.js';

let app;

beforeAll(async () => {
  ({ app } = await import('../index.js'));
});

process.env.JWT_SECRET = 'test-secret-key';
process.env.NODE_ENV = 'test';

const testUser = {
  email: `test${Date.now()}@example.com`,
  password: 'password123',
  name: 'Test User'
};

describe('Auth Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send(testUser);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
    });

    it('should not register user with existing email', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send(testUser);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Usuario ya existe');
    });

    it('should not register user with invalid email', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          ...testUser,
          email: 'invalid-email'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Formato de email inválido');
    });

    it('should not register user with short password', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          ...testUser,
          password: '123'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Contraseña inválida');
    });

    it('should not register user with missing fields', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: testUser.email
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Campos requeridos faltantes');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
    });

    it('should not login with invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'Credenciales inválidas');
    });

    it('should not login with non-existent user', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'Credenciales inválidas');
    });
  });
}); 