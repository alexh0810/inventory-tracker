import { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { CREATE_ITEM, GET_ITEMS } from '@/graphql/operations/items';
import { toast } from 'react-hot-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';

export function AddUpdateStock() {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    quantity: '',
    minThreshold: '10', // Default value
  });

  const { refetch } = useQuery(GET_ITEMS);

  const [createItem] = useMutation(CREATE_ITEM, {
    onCompleted: async (data) => {
      const isNewItem = !data.createItem._id;
      toast.success(
        isNewItem
          ? 'Item added successfully!'
          : 'Item quantity updated successfully!'
      );

      // Refetch items to update the list
      await refetch();

      // Reset form
      setFormData({
        name: '',
        category: '',
        quantity: '',
        minThreshold: '10',
      });
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.category || !formData.quantity) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await createItem({
        variables: {
          input: {
            name: formData.name,
            category: formData.category,
            quantity: parseInt(formData.quantity),
            minThreshold: parseInt(formData.minThreshold),
          },
        },
      });
    } catch (error) {
      console.error('Submission error:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add/Update Stock</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              placeholder="Item Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Select
              value={formData.category}
              onValueChange={(value) =>
                setFormData({ ...formData, category: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FOOD">Food</SelectItem>
                <SelectItem value="BEVERAGE">Beverage</SelectItem>
                <SelectItem value="SUPPLIES">Supplies</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Input
              type="number"
              placeholder="Quantity"
              value={formData.quantity}
              onChange={(e) =>
                setFormData({ ...formData, quantity: e.target.value })
              }
              required
              min="1"
            />
          </div>

          <div className="space-y-2">
            <Input
              type="number"
              placeholder="Minimum Threshold"
              value={formData.minThreshold}
              onChange={(e) =>
                setFormData({ ...formData, minThreshold: e.target.value })
              }
              required
              min="1"
            />
          </div>

          <Button type="submit" className="w-full py-3 bg-black text-white">
            Add/Update Item
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
