import { resolvers } from '../resolvers';
import ItemModel from '@/models/item';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer: MongoMemoryServer;

jest.mock('@/models/item');

// Mock the database connection
jest.mock('@/lib/db', () => ({
  __esModule: true,
  default: jest.fn().mockResolvedValue(undefined),
}));

describe('GraphQL Resolvers', () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    const { default: mockedConnectDB } = jest.requireMock('@/lib/db');
    mockedConnectDB.mockResolvedValue(undefined);
  });

  describe('Query resolvers', () => {
    it('gets all items', async () => {
      const mockItems = [
        { _id: '1', name: 'Test Item', category: 'FOOD', quantity: 5 },
      ];

      (ItemModel.find as jest.Mock).mockResolvedValue(mockItems);

      const result = await resolvers.Query.items();
      expect(result).toEqual(mockItems);
    });
  });

  describe('Mutation resolvers', () => {
    it('creates an item', async () => {
      const mockItem = {
        name: 'New Item',
        category: 'FOOD' as const,
        quantity: 10,
        minThreshold: 5,
      };

      const mockCreatedItem = {
        _id: '1',
        ...mockItem,
      };

      (ItemModel.findOne as jest.Mock).mockResolvedValue(null);

      // Create a mock instance with save method
      const mockInstance = {
        ...mockCreatedItem,
        save: jest.fn().mockResolvedValue(mockCreatedItem),
      };

      // Update the mock implementation to return the instance
      (ItemModel as unknown as jest.Mock).mockImplementation(
        () => mockInstance
      );

      const result = await resolvers.Mutation.createItem(null, {
        input: mockItem,
      });

      // Compare only the data properties, excluding the save method
      const { save, ...resultWithoutSave } = result;
      expect(resultWithoutSave).toEqual(mockCreatedItem);
      expect(result._id).toBe('1');
      expect(result.name).toBe(mockItem.name);
    });

    it('deletes an item', async () => {
      const mockId = '1';
      (ItemModel.findByIdAndDelete as jest.Mock).mockResolvedValue({
        _id: mockId,
      });

      const result = await resolvers.Mutation.deleteItem(null, { _id: mockId });
      expect(result?._id).toBe(mockId);
    });
  });
});
