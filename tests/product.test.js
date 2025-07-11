import request from 'supertest';
import jwt from 'jsonwebtoken';
import { mockFirestore } from './mocks/firebase.js';

let app;

beforeAll(async () => {
  ({ app } = await import('../index.js'));
});

process.env.JWT_SECRET = 'test-secret-key';
process.env.NODE_ENV = 'test';

let authToken;
let testProductId;

const testUser = {
  email: `test${Date.now()}@example.com`,
  password: 'password123',
  name: 'Test User'
};

const productData = {
  name: 'Test Product',
  description: 'Test Description',
  price: 99.99,
  stock: 10
};

describe('Product Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    authToken = jwt.sign(
      { id: 'test-user-id', email: testUser.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
  });

  describe('GET /api/products', () => {
    it('should get all products', async () => {
      const response = await request(app)
        .get('/api/products');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('products');
    });
  });

  describe('POST /api/products', () => {
    it('should create a new product', async () => {
      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${authToken}`)
        .send(productData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('product');
      testProductId = response.body.product.id;
    });

    it('should not create product without auth token', async () => {
      const response = await request(app)
        .post('/api/products')
        .send(productData);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/products/:id', () => {
    it('should get product by id', async () => {
      const response = await request(app)
        .get(`/api/products/${testProductId}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('product');
    });

    it('should return 404 for non-existent product', async () => {
      const response = await request(app)
        .get('/api/products/nonexistent-id');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('PUT /api/products/:id', () => {
    it('should update product', async () => {
      const updateData = {
        name: 'Updated Product',
        description: 'Updated Description',
        price: 149.99,
        stock: 20
      };

      const response = await request(app)
        .put(`/api/products/${testProductId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('product');
    });

    it('should not update product without auth token', async () => {
      const response = await request(app)
        .put(`/api/products/${testProductId}`)
        .send({ name: 'Updated Product' });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('DELETE /api/products/:id', () => {
    it('should delete product', async () => {
      const response = await request(app)
        .delete(`/api/products/${testProductId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
    });

    it('should not delete product without auth token', async () => {
      const response = await request(app)
        .delete(`/api/products/${testProductId}`);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });
  });
}); 