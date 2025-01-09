'use client';

import { useMutation } from '@apollo/client';
import { CREATE_ITEM, GET_ITEMS } from '@/graphql/operations/items';
import {
  StockItemForm,
  ItemFormData,
} from '@/components/stock/stock-item-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function AddItemPage() {
  const router = useRouter();
  const [addItem, { loading }] = useMutation(CREATE_ITEM, {
    refetchQueries: [{ query: GET_ITEMS }],
  });

  const handleSubmit = async (data: ItemFormData) => {
    try {
      await addItem({
        variables: { input: data },
      });
      toast.success('Item added successfully');
      router.push('/');
    } catch (error) {
      console.error('Error adding item:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to add item'
      );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Item</CardTitle>
      </CardHeader>
      <CardContent>
        <StockItemForm mode="add" onSubmit={handleSubmit} isLoading={loading} />
      </CardContent>
    </Card>
  );
}
