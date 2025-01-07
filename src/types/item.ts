export interface Item {
  _id: string;
  name: string;
  quantity: number;
  minThreshold: number;
  category: 'FOOD' | 'BEVERAGE' | 'SUPPLIES' | 'OTHER';
  createdAt?: string;
  updatedAt?: string;
}
