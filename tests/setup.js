import { jest } from '@jest/globals';

// Set up test environment variables
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

// Make jest available globally
global.jest = jest; 