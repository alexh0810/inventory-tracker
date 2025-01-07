'use client';

import { use } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import {
  GET_ITEM,
  UPDATE_ITEM,
  GET_ITEMS,
  GET_LOW_STOCK_ITEMS,
} from '@/graphql/operations/items';
import { StockItemForm } from '@/components/stock/stock-item-form';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function EditStockPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const { data, loading } = useQuery(GET_ITEM, {
    variables: { _id: id },
  });

  const [updateItem, { loading: isUpdating }] = useMutation(UPDATE_ITEM, {
    refetchQueries: [{ query: GET_ITEMS }, { query: GET_LOW_STOCK_ITEMS }],
    onCompleted: () => {
      toast.success('Item updated successfully');
      router.push('/');
    },
  });

  if (loading) return <div>Loading...</div>;
  if (!data?.item) return <div>Item not found</div>;

  const handleSubmit = async (formData: any) => {
    try {
      await updateItem({
        variables: {
          _id: id,
          input: formData,
          mode: 'FULL',
        },
      });
    } catch (error) {
      toast.error('Failed to update item');
      console.error(error);
    }
  };

  return (
    <div className="container py-10">
      <h1 className="text-2xl font-bold mb-6">Edit Stock Item</h1>
      <StockItemForm
        mode="edit"
        initialData={data.item}
        onSubmit={handleSubmit}
        isLoading={isUpdating}
      />
    </div>
  );
}
