import { useQuery } from '@apollo/client';
import { GET_LOW_STOCK_ITEMS } from '@/graphql/operations/items';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Item {
  _id: string;
  name: string;
  quantity: number;
  minThreshold: number;
}

export function LowStockAlerts() {
  const { data, loading } = useQuery(GET_LOW_STOCK_ITEMS);

  const lowStockItems = data?.lowStockItems || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Low Stock Alerts</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div>Loading...</div>
        ) : lowStockItems.length === 0 ? (
          <div>No low stock items</div>
        ) : (
          <ul className="space-y-2">
            {lowStockItems.map((item: Item) => (
              <li key={item._id} className="text-red-600">
                {item.name} - {item.quantity} remaining
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
