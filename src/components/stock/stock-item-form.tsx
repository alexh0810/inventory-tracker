import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  category: z.enum(['FOOD', 'BEVERAGE', 'SUPPLIES', 'OTHER']),
  quantity: z.number().min(0, 'Quantity must be 0 or greater'),
  minThreshold: z.number().min(0, 'Minimum threshold must be 0 or greater'),
});

export type ItemFormData = z.infer<typeof formSchema>;

interface StockItemFormProps {
  mode: 'add' | 'edit';
  initialData?: ItemFormData;
  onSubmit: (data: ItemFormData) => Promise<void>;
  isLoading?: boolean;
}

export function StockItemForm({
  mode,
  initialData,
  onSubmit,
  isLoading,
}: StockItemFormProps) {
  const form = useForm<ItemFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: '',
      category: 'FOOD',
      quantity: 0,
      minThreshold: 0,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="FOOD">Food</SelectItem>
                  <SelectItem value="BEVERAGE">Beverage</SelectItem>
                  <SelectItem value="SUPPLIES">Supplies</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantity</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  value={field.value || 'Quantity'}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="minThreshold"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Minimum Threshold</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              {mode === 'add' ? 'Adding...' : 'Saving...'}
            </div>
          ) : mode === 'add' ? (
            'Add Item'
          ) : (
            'Save Changes'
          )}
        </Button>
      </form>
    </Form>
  );
}
