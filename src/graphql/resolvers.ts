import Item, { IItem } from '@/models/item';
import { StockHistory } from '@/models/stock-history';
import connectDB from '@/lib/db';

interface CreateItemInput {
  name: string;
  quantity: number;
  category: string;
}

const resolvers = {
  Query: {
    items: async () => {
      await connectDB();
      return await Item.find();
    },
    item: async (_: unknown, { _id }: { _id: string }) => {
      await connectDB();
      return await Item.findById(_id);
    },
    lowStockItems: async () => {
      await connectDB();
      try {
        const items = await Item.find({
          $expr: {
            $lte: ['$quantity', '$minThreshold'],
          },
        });

        return items;
      } catch (error) {
        console.error('Error fetching low stock items:', error);
        throw new Error('Failed to fetch low stock items');
      }
    },
    stockHistory: async () => {
      await connectDB();
      try {
        const history = await StockHistory.find().sort({ timestamp: -1 });
        return history;
      } catch (error) {
        console.error('Error fetching stock history:', error);
        throw new Error('Failed to fetch stock history');
      }
    },
  },
  Mutation: {
    createItem: async (_: unknown, { input }: { input: CreateItemInput }) => {
      await connectDB();
      const item = new Item(input);
      return await item.save();
    },
    deleteItem: async (_: unknown, { _id }: { _id: string }) => {
      await connectDB();
      return await Item.findByIdAndDelete(_id);
    },
    updateItem: async (
      _: unknown,
      {
        _id,
        input,
        mode,
      }: { _id: string; input: { quantity: number }; mode?: string }
    ) => {
      await connectDB();
      try {
        const item = await Item.findById(_id);
        if (!item) {
          throw new Error('Item not found');
        }

        if (mode === 'QUICK') {
          // Calculate new quantity
          const newQuantity = item.quantity + input.quantity;

          // Prevent negative quantities
          if (newQuantity < 0) {
            throw new Error('Cannot reduce quantity below 0');
          }

          // Create stock history entry
          await StockHistory.create({
            itemId: item._id,
            itemName: item.name,
            quantity: newQuantity,
            timestamp: new Date(),
          });

          // Update item quantity
          item.quantity = newQuantity;
          await item.save();
          return item;
        }

        // Full edit mode - direct updates
        return await Item.findByIdAndUpdate(_id, input, {
          new: true,
          runValidators: true,
        });
      } catch (error) {
        console.error('Error updating item:', error);
        throw new Error('Failed to update item');
      }
    },
  },
  Item: {
    category: async (parent: IItem) => {
      return parent.category;
    },
  },
  StockHistory: {
    timestamp: (parent: { timestamp: Date }) => {
      return parent.timestamp.toISOString();
    },
  },
};

export default resolvers;
