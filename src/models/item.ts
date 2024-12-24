import mongoose, { Document, Model } from 'mongoose';

// Interface for static methods
interface IItemModel extends Model<IItem> {
  findLowStock(): Promise<IItem[]>;
}

// Interface for the Item document
export interface IItem extends Document {
  name: string;
  quantity: number;
  minThreshold: number;
  category: 'FOOD' | 'BEVERAGE' | 'SUPPLIES' | 'OTHER';
  createdAt: Date;
  updatedAt: Date;
  isLowStock(): boolean;
}

// Schema definition
const ItemSchema = new mongoose.Schema<IItem, IItemModel>(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name for this item'],
      trim: true,
      maxlength: [60, 'Name cannot be more than 60 characters'],
    },
    quantity: {
      type: Number,
      required: [true, 'Please provide the quantity'],
      min: [0, 'Quantity cannot be negative'],
    },
    minThreshold: {
      type: Number,
      required: [true, 'Please provide a minimum threshold'],
      min: [0, 'Minimum threshold cannot be negative'],
    },
    category: {
      type: String,
      required: [true, 'Please provide a category'],
      trim: true,
      enum: {
        values: ['FOOD', 'BEVERAGE', 'SUPPLIES', 'OTHER'],
        message: '{VALUE} is not a valid category',
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Add virtual field for stock status
ItemSchema.virtual('stockStatus').get(function (this: IItem) {
  if (this.quantity <= this.minThreshold) {
    return 'LOW';
  } else if (this.quantity <= this.minThreshold * 1.5) {
    return 'MEDIUM';
  } else {
    return 'GOOD';
  }
});

// Instance method
ItemSchema.methods.isLowStock = function (): boolean {
  return this.quantity <= this.minThreshold;
};

// Static method
ItemSchema.statics.findLowStock = function () {
  return this.find({
    $expr: {
      $lte: ['$quantity', '$minThreshold'],
    },
  });
};

// Add middleware (hooks)
ItemSchema.pre('save', function (next) {
  next();
});

// Create and export the model with proper typing
const Item = (mongoose.models.Item ||
  mongoose.model<IItem, IItemModel>('Item', ItemSchema)) as IItemModel;

export default Item;
