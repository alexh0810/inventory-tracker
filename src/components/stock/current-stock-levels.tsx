// src/components/stock/current-stock-levels.tsx
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
import { Trash2, Download } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useState } from 'react';
import { convertToCSV, downloadCSV } from '@/lib/csv-utils';

interface Item {
  _id: string;
  name: string;
  category: string;
  quantity: number;
  minThreshold: number;
}

export function CurrentStockLevels() {
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
          <Button
            onClick={handleExportCSV}
            variant="default"
            size="sm"
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.items.map((item: Item) => (
              <TableRow key={item._id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.category.toLowerCase()}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
