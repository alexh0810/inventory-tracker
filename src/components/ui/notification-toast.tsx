'use client';

import { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_LOW_STOCK_ITEMS } from '@/graphql/operations/items';
import { Bell, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '../ui/badge';

type Item = {
  _id: string;
  name: string;
  quantity: number;
  minThreshold: number;
};

export function StockNotifications() {
  const { data, startPolling, stopPolling } = useQuery(GET_LOW_STOCK_ITEMS, {
    fetchPolicy: 'cache-and-network',
  });

  const [isOpen, setIsOpen] = useState(true);
  const [lastDataHash, setLastDataHash] = useState('');

  // Show notification when low stock data changes
  useEffect(() => {
    if (data?.lowStockItems) {
      const newHash = JSON.stringify(
        data.lowStockItems.map((item: Item) => ({
          id: item._id,
          quantity: item.quantity,
          minThreshold: item.minThreshold,
        }))
      );

      if (newHash !== lastDataHash) {
        setIsOpen(true);
        setLastDataHash(newHash);
      }
    }
  }, [data?.lowStockItems, lastDataHash]);

  useEffect(() => {
    startPolling(30000);
    return () => stopPolling();
  }, [startPolling, stopPolling]);

  const lowStockCount = data?.lowStockItems?.length || 0;

  if (lowStockCount === 0 || !isOpen) return null;

  return (
    <div
      data-testid="stock-notification"
      className="fixed top-4 right-4 z-50 w-80 bg-white rounded-lg shadow-lg border border-destructive/20"
    >
      <div className="p-4 bg-destructive/10 rounded-t-lg border-b border-destructive/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-destructive">
            <Bell className="h-5 w-5" />
            <span className="font-semibold">Low Stock Alert</span>
            <Badge variant="outline" className="ml-2 bg-destructive/10">
              {lowStockCount}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-destructive/20"
            onClick={() => setIsOpen(false)}
            aria-label="close"
          >
            <X className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </div>
      <div className="p-4 max-h-[60vh] overflow-y-auto">
        <div className="space-y-3">
          {data?.lowStockItems?.map((item: Item) => (
            <div
              key={item._id}
              data-testid="stock-item"
              className="p-3 bg-destructive/5 rounded-md border border-destructive/10"
            >
              <p className="font-medium text-destructive">{item.name}</p>
              <div className="flex justify-between items-center mt-1 text-sm text-muted-foreground">
                <span>Current: {item.quantity}</span>
                <span>Minimum: {item.minThreshold}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
