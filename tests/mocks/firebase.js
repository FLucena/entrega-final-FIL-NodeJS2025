import { jest } from '@jest/globals';

const mockCollection = jest.fn();
const mockDoc = jest.fn();
const mockWhere = jest.fn();
const mockGet = jest.fn();
const mockAdd = jest.fn();
const mockUpdate = jest.fn();
const mockDelete = jest.fn();

export const mockFirestore = {
  collection: mockCollection,
  doc: mockDoc,
  where: mockWhere,
  get: mockGet,
  add: mockAdd,
  update: mockUpdate,
  delete: mockDelete
};

mockCollection.mockReturnValue(mockFirestore);
mockDoc.mockReturnValue(mockFirestore);
mockWhere.mockReturnValue(mockFirestore);

const mockFirebaseAdmin = {
  initializeApp: jest.fn(),
  credential: {
    cert: jest.fn()
  },
  firestore: jest.fn(() => mockFirestore),
  apps: []
};

jest.unstable_mockModule('firebase-admin', () => ({
  __esModule: true,
  default: mockFirebaseAdmin
}));

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