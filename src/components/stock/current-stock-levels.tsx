'use client';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ITEMS, DELETE_ITEM } from '@/graphql/operations/items';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Trash2, Download, Plus, Pencil } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useState } from 'react';
import { convertToCSV, downloadCSV } from '@/lib/csv-utils';
import { useRouter } from 'next/navigation';

interface Item {
  _id: string;
  name: string;
  category: string;
  quantity: number;
  minThreshold: number;
}

const getStockStatus = (quantity: number, minThreshold: number) => {
  if (quantity <= minThreshold) {
    return { status: 'LOW', color: 'text-red-600' };
  }
  return { status: 'GOOD', color: 'text-green-600' };
};

export function CurrentStockLevels() {
  const router = useRouter();
  const { data, loading, error } = useQuery(GET_ITEMS);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const [deleteItem] = useMutation(DELETE_ITEM, {
    refetchQueries: [{ query: GET_ITEMS }],
    onCompleted: () => {
      toast.success('Item deleted successfully');
      setIsDeleteDialogOpen(false);
      setItemToDelete(null);
    },
    onError: (error) => {
      toast.error(`Error deleting item: ${error.message}`);
      setIsDeleteDialogOpen(false);
      setItemToDelete(null);
    },
  });

  const handleExportCSV = () => {
    if (!data?.items) return;

    const csvContent = convertToCSV(data.items);
    const timestamp = new Date().toISOString().split('T')[0];
    downloadCSV(csvContent, `stock-levels-${timestamp}.csv`);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading stock levels</div>;

  const handleDelete = async () => {
    if (!itemToDelete) return;

    try {
      await deleteItem({
        variables: { _id: itemToDelete },
      });
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Current Stock Levels</CardTitle>
          <div className="flex gap-2">
            <Button
              onClick={() => router.push('/stock/add')}
              variant="default"
              size="sm"
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Item
            </Button>
            <Button
              onClick={handleExportCSV}
              variant="ghost"
              size="sm"
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Stock Level</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.items.map((item: Item) => {
              const { status, color } = getStockStatus(
                item.quantity,
                item.minThreshold
              );
              return (
                <TableRow key={item._id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.category.toLowerCase()}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className={color}>{item.quantity}</span>
                      <span className="text-xs text-muted-foreground">
                        Min: {item.minThreshold}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`font-medium ${color}`}>{status}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        aria-label="Edit item"
                        onClick={() => router.push(`/stock/edit/${item._id}`)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <AlertDialog
                        open={isDeleteDialogOpen && itemToDelete === item._id}
                        onOpenChange={(open) => {
                          setIsDeleteDialogOpen(open);
                          if (!open) setItemToDelete(null);
                        }}
                      >
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            aria-label="Delete item"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => {
                              setItemToDelete(item._id);
                              setIsDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-white">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Item</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete &quot;{item.name}
                              &quot;? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel
                              onClick={() => {
                                setIsDeleteDialogOpen(false);
                                setItemToDelete(null);
                              }}
                            >
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={handleDelete}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
