import mongoose, { Document, Schema } from 'mongoose';

export interface IStockHistory extends Document {
  itemId: mongoose.Types.ObjectId;
  itemName: string;
  quantity: number;
  timestamp: Date;
}

const stockHistorySchema = new Schema<IStockHistory>({
  itemId: { type: Schema.Types.ObjectId, required: true, ref: 'Item' },
  itemName: { type: String, required: true },
  quantity: { type: Number, required: true },
  timestamp: { type: Date, required: true },
});

export const StockHistory =
  mongoose.models.StockHistory ||
  mongoose.model<IStockHistory>('StockHistory', stockHistorySchema);
