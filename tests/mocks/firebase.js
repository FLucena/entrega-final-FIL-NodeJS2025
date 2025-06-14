// ESM-compatible Firebase mock for Jest, using only plain functions
import { jest } from '@jest/globals';

// Create mock functions
const mockCollection = jest.fn();
const mockDoc = jest.fn();
const mockWhere = jest.fn();
const mockGet = jest.fn();
const mockAdd = jest.fn();
const mockUpdate = jest.fn();
const mockDelete = jest.fn();

// Create the mock Firestore instance
export const mockFirestore = {
  collection: mockCollection,
  doc: mockDoc,
  where: mockWhere,
  get: mockGet,
  add: mockAdd,
  update: mockUpdate,
  delete: mockDelete
};

// Set up the chainable behavior
mockCollection.mockReturnValue(mockFirestore);
mockDoc.mockReturnValue(mockFirestore);
mockWhere.mockReturnValue(mockFirestore);

// Mock Firebase Admin
const mockFirebaseAdmin = {
  initializeApp: jest.fn(),
  credential: {
    cert: jest.fn()
  },
  firestore: jest.fn(() => mockFirestore)
};

// Mock the entire firebase-admin module
jest.unstable_mockModule('firebase-admin', () => ({
  __esModule: true,
  default: mockFirebaseAdmin
}));

// Export the mock for direct use
export { mockFirebaseAdmin as default };

export function getMockFirestore() {
  return {
    collection: () => getMockFirestore(),
    doc: () => getMockFirestore(),
    where: () => getMockFirestore(),
    get: async () => ({
      empty: false,
      docs: [{
        id: 'test-id',
        data: () => ({
          email: 'test@example.com',
          password: '$2a$10$test',
          name: 'Test User'
        })
      }]
    }),
    add: async () => ({ id: 'test-id' }),
    update: async () => ({}),
    delete: async () => ({})
  };
} 