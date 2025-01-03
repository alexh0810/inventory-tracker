'use client';
import { useParams } from 'next/navigation';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ITEM, UPDATE_ITEM } from '@/graphql/operations/items';
import {
  StockItemForm,
  ItemFormData,
} from '@/components/stock/stock-item-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function EditItemPage() {
  const params = useParams() ?? {};
  const itemId = params.id as string;
  const router = useRouter();

  const { data, loading: queryLoading } = useQuery(GET_ITEM, {
    variables: { _id: itemId },
  });

  const [updateItem, { loading: mutationLoading }] = useMutation(UPDATE_ITEM);

  const handleSubmit = async (data: ItemFormData) => {
    try {
      await updateItem({
        variables: {
          _id: itemId,
          input: data,
        },
      });
      toast.success('Item updated successfully');
      router.push('/');
    } catch (error) {
      console.error('Error updating item:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to update item'
      );
    }
  };

  if (queryLoading) return <div>Loading...</div>;
  if (!data?.item) return <div>Item not found</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Item: {data.item.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <StockItemForm
          mode="edit"
          initialData={data.item}
          onSubmit={handleSubmit}
          isLoading={mutationLoading}
        />
      </CardContent>
    </Card>
  );
}
