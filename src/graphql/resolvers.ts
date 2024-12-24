import Item from '@/models/item';
import { IItem } from '@/models/item';
import connectDB from '@/lib/db';

interface CreateItemInput {
  name: string;
  quantity: number;
  minThreshold: number;
  category: 'FOOD' | 'BEVERAGE' | 'SUPPLIES' | 'OTHER';
}

interface UpdateItemInput {
  name?: string;
  quantity?: number;
  minThreshold?: number;
  category?: 'FOOD' | 'BEVERAGE' | 'SUPPLIES' | 'OTHER';
}

export const resolvers = {
  Query: {
    items: async (): Promise<IItem[]> => {
      await connectDB();
      return await Item.find({});
    },
    item: async (
      _: unknown,
      { _id }: { _id: string }
    ): Promise<IItem | null> => {
      await connectDB();
      return await Item.findById(_id);
    },
    lowStockItems: async (): Promise<IItem[]> => {
      await connectDB();
      return await Item.findLowStock();
    },
  },
  Mutation: {
    createItem: async (
      _: unknown,
      { input }: { input: CreateItemInput }
    ): Promise<IItem> => {
      await connectDB();
      const item = new Item(input);
      await item.save();
      return item;
    },
    updateItem: async (
      _: unknown,
      { _id, input }: { _id: string; input: UpdateItemInput }
    ): Promise<IItem | null> => {
      await connectDB();
      return await Item.findByIdAndUpdate(_id, input, {
        new: true,
        runValidators: true,
      });
    },
    deleteItem: async (
      _: unknown,
      { _id }: { _id: string }
    ): Promise<IItem | null> => {
      await connectDB();
      return await Item.findByIdAndDelete(_id);
    },
  },
  Item: {
    stockStatus: (parent: IItem) => {
      if (parent.quantity <= parent.minThreshold) {
        return 'LOW';
      } else if (parent.quantity <= parent.minThreshold * 1.5) {
        return 'MEDIUM';
      } else {
        return 'GOOD';
      }
    },
  },
};
