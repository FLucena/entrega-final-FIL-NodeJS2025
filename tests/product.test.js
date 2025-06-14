import request from 'supertest';
import jwt from 'jsonwebtoken';
import { mockFirestore } from './mocks/firebase.js';

let app;

beforeAll(async () => {
  ({ app } = await import('../index.js'));
});

// Set up test environment variables
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
    // Reset mock before each test
    jest.clearAllMocks();
    
    // Create a test token
    authToken = jwt.sign(
      { id: 'test-user-id', email: testUser.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
  });

  describe('GET /api/products', () => {
    it('should get all products', async () => {
      // Mock products collection
      mockFirestore.get.mockResolvedValueOnce({
        forEach: (callback) => {
          callback({
            id: 'test-id',
            data: () => productData
          });
        }
      });

      const response = await request(app)
        .get('/api/products');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('POST /api/products', () => {
    it('should create a new product', async () => {
      // Mock product creation
      mockFirestore.add.mockResolvedValueOnce({ id: 'test-id' });

      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${authToken}`)
        .send(productData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      testProductId = response.body.id;
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
      // Mock product retrieval
      mockFirestore.get.mockResolvedValueOnce({
        exists: true,
        id: 'test-id',
        data: () => productData
      });

      const response = await request(app)
        .get(`/api/products/${testProductId}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', testProductId);
    });

    it('should return 404 for non-existent product', async () => {
      // Mock non-existent product
      mockFirestore.get.mockResolvedValueOnce({
        exists: false
      });

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
        price: 149.99
      };

      // Mock product update
      mockFirestore.update.mockResolvedValueOnce({});

      const response = await request(app)
        .put(`/api/products/${testProductId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe(updateData.name);
      expect(response.body.price).toBe(updateData.price);
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
      // Mock product deletion
      mockFirestore.delete.mockResolvedValueOnce({});

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