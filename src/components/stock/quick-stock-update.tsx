'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import {
  GET_ITEMS,
  GET_LOW_STOCK_ITEMS,
  UPDATE_ITEM,
} from '@/graphql/operations/items';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Minus } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { ApolloError } from '@apollo/client';
import { Item } from '@/types/item';

export function QuickStockUpdate() {
  const [selectedItem, setSelectedItem] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(0);
  const { data } = useQuery(GET_ITEMS);

  const [updateQuantity, { loading: updating }] = useMutation(UPDATE_ITEM, {
    refetchQueries: [{ query: GET_ITEMS }, { query: GET_LOW_STOCK_ITEMS }],
  });

  const handleUpdate = async (operation: 'add' | 'remove') => {
    if (!selectedItem) {
      toast.error('Please select an item');
      return;
    }

    if (quantity <= 0) {
      toast.error('Quantity must be greater than 0');
      return;
    }

    try {
      const response = await updateQuantity({
        variables: {
          _id: selectedItem.trim(),
          input: {
            quantity: operation === 'add' ? quantity : -quantity,
          },
          mode: 'QUICK',
        },
      });

      if (response.data) {
        toast.success(`Successfully ${operation}ed stock`);
        setQuantity(0);
        setSelectedItem('');
      }
    } catch (error: unknown) {
      console.error('Error updating stock:', error);
      if (error instanceof ApolloError) {
        const message =
          error.graphQLErrors[0]?.message ||
          error.networkError?.message ||
          'Failed to update stock';
        toast.error(message);
      } else {
        toast.error('An unexpected error occurred');
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Stock Update</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Select value={selectedItem} onValueChange={setSelectedItem}>
            <SelectTrigger>
              <SelectValue placeholder="Select item to update" />
            </SelectTrigger>
            <SelectContent>
              {data?.items.map((item: Item) => (
                <SelectItem key={item._id} value={item._id}>
                  {item.name} (Current: {item.quantity})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex gap-2">
            <Input
              type="number"
              min="0"
              value={quantity || ''}
              onChange={(e) => {
                const value = e.target.value;
                setQuantity(value ? Number(value) : 0);
              }}
              placeholder="Quantity"
            />
            <Button
              onClick={() => handleUpdate('add')}
              disabled={updating || !quantity}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add
            </Button>
            <Button
              onClick={() => handleUpdate('remove')}
              disabled={updating || !quantity}
              variant="ghost"
              className="flex items-center gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Minus className="h-4 w-4" />
              Remove
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
