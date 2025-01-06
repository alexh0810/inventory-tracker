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
      return await Item.find({
        $expr: {
          $lte: ['$quantity', '$minThreshold'],
        },
      });
    },
  },
  Mutation: {
    createItem: async (
      _: unknown,
      { input }: { input: CreateItemInput }
    ): Promise<IItem> => {
      await connectDB();

      // Convert name to lowercase for case-insensitive comparison
      const normalizedName = input.name.toLowerCase();

      // Try to find an existing item with the same name (case-insensitive)
      const existingItem = await Item.findOne({
        name: { $regex: new RegExp(`^${normalizedName}$`, 'i') },
      });

      if (existingItem) {
        // If item exists, update the quantity and other fields if provided
        existingItem.quantity += input.quantity;
        if (input.minThreshold) existingItem.minThreshold = input.minThreshold;
        if (input.category) existingItem.category = input.category;

        await existingItem.save();
        return existingItem;
      }

      // If item doesn't exist, create a new one
      const item = new Item(input);
      await item.save();
      return item;
    },
    updateItem: async (
      _: unknown,
      {
        _id,
        input,
        mode,
      }: { _id: string; input: UpdateItemInput; mode?: 'QUICK' | 'FULL' }
    ): Promise<IItem | null> => {
      await connectDB();

      if (mode === 'QUICK' && input.quantity !== undefined) {
        // Get current item
        const currentItem = await Item.findById(_id);
        if (!currentItem) return null;

        // Calculate new quantity
        const newQuantity = currentItem.quantity + input.quantity;

        // Prevent negative quantities
        if (newQuantity < 0) {
          throw new Error('Cannot reduce quantity below 0');
        }

        // Update with the new total
        return await Item.findByIdAndUpdate(
          _id,
          { ...input, quantity: newQuantity },
          { new: true, runValidators: true }
        );
      }

      // Full edit mode - direct updates
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
      }
      return 'GOOD';
    },
  },
};
