import { jest } from '@jest/globals';

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key';
process.env.FIREBASE_TYPE = 'service_account';
process.env.FIREBASE_PROJECT_ID = 'test-project';
process.env.FIREBASE_PRIVATE_KEY_ID = 'test-key-id';
process.env.FIREBASE_PRIVATE_KEY = 'test-private-key';
process.env.FIREBASE_CLIENT_EMAIL = 'test@example.com';
process.env.FIREBASE_CLIENT_ID = 'test-client-id';
process.env.FIREBASE_AUTH_URI = 'https://test.auth.uri';
process.env.FIREBASE_TOKEN_URI = 'https://test.token.uri';
process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL = 'https://test.cert.url';
process.env.FIREBASE_CLIENT_X509_CERT_URL = 'https://test.client.cert.url';

jest.unstable_mockModule('firebase-admin', () => ({
  __esModule: true,
  default: {
    initializeApp: jest.fn(),
    credential: {
      cert: jest.fn()
    },
    firestore: jest.fn(() => ({
      collection: jest.fn(() => ({
        doc: jest.fn(() => ({
          get: jest.fn(() => ({
            exists: true,
            id: 'test-id',
            data: () => ({
              name: 'Test Product',
              description: 'Test Description',
              price: 99.99,
              stock: 10
            })
          })),
          update: jest.fn(),
          delete: jest.fn()
        })),
        where: jest.fn(() => ({
          get: jest.fn(() => ({
            empty: false,
            docs: [{
              id: 'test-id',
              data: () => ({
                email: 'test@example.com',
                password: '$2a$10$test',
                name: 'Test User'
              })
            }]
          }))
        })),
        get: jest.fn(() => ({
          empty: false,
          docs: [{
            id: 'test-id',
            data: () => ({
              name: 'Test Product',
              description: 'Test Description',
              price: 99.99,
              stock: 10
            })
          }]
        })),
        add: jest.fn(() => ({ id: 'test-id' }))
      }))
    })),
    apps: []
  }
}));

global.jest = jest; 