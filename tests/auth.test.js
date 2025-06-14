import { mockFirestore } from './mocks/firebase.js';
import request from 'supertest';
import bcrypt from 'bcryptjs';

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
  let hashedPassword;

  beforeAll(async () => {
    hashedPassword = await bcrypt.hash(testUser.password, 10);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      // Mock empty user collection
      mockFirestore.get.mockResolvedValueOnce({ empty: true });
      
      // Mock successful user creation
      mockFirestore.add.mockResolvedValueOnce({ id: 'test-user-id' });

      const response = await request(app)
        .post('/api/auth/register')
        .send(testUser);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user.email).toBe(testUser.email);
    });

    it('should not register user with existing email', async () => {
      mockFirestore.get.mockResolvedValueOnce({ empty: false });

      const response = await request(app)
        .post('/api/auth/register')
        .send(testUser);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'El usuario ya existe');
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
          password: '12345'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'La contraseña debe tener al menos 6 caracteres');
    });

    it('should not register user with missing fields', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: testUser.email
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Todos los campos son requeridos');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      // Mock existing user with correct password
      mockFirestore.get.mockResolvedValueOnce({
        empty: false,
        docs: [{
          id: 'test-user-id',
          data: () => ({
            email: testUser.email,
            password: hashedPassword,
            name: testUser.name
          })
        }]
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user.email).toBe(testUser.email);
    });

    it('should not login with invalid credentials', async () => {
      // Mock existing user with wrong password
      mockFirestore.get.mockResolvedValueOnce({
        empty: false,
        docs: [{
          id: 'test-user-id',
          data: () => ({
            email: testUser.email,
            password: hashedPassword,
            name: testUser.name
          })
        }]
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    it('should not login with non-existent user', async () => {
      // Mock non-existent user
      mockFirestore.get.mockResolvedValueOnce({ empty: true });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });
  });
}); 