'use client';

import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useQuery } from '@apollo/client';
import { GET_STOCK_HISTORY } from '@/graphql/operations/analytics';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

interface StockHistory {
  _id: string;
  itemId: string;
  itemName: string;
  quantity: number;
  timestamp: string;
}

interface Item {
  _id: string;
  name: string;
  quantity: number;
}

interface StockTrend {
  name: string;
  quantity: number;
  date: string;
  timestamp: Date;
}

export function StockAnalyticsDashboard() {
  const { data, loading, error } = useQuery(GET_STOCK_HISTORY);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Failed to load analytics data</AlertDescription>
      </Alert>
    );
  }

  const stockHistory: StockHistory[] = data?.stockHistory || [];
  const currentItems = data?.items || [];

  // Create a map of current stock levels
  const currentStockMap = currentItems.reduce(
    (acc: { [key: string]: number }, item: Item) => {
      acc[item.name] = item.quantity;
      return acc;
    },
    {}
  );

  // Process data for trends
  const stockTrends = Object.entries(
    stockHistory.reduce(
      (acc: { [key: string]: { [date: string]: StockHistory } }, curr) => {
        if (!acc[curr.itemName]) {
          acc[curr.itemName] = {};
        }
        const date = new Date(curr.timestamp).toISOString().split('T')[0];
        // Keep only the latest entry for each date
        if (
          !acc[curr.itemName][date] ||
          new Date(curr.timestamp) >
            new Date(acc[curr.itemName][date].timestamp)
        ) {
          acc[curr.itemName][date] = curr;
        }
        return acc;
      },
      {}
    )
  ).reduce((acc: { [key: string]: StockTrend[] }, [itemName, dateEntries]) => {
    // Convert to array and sort by date
    acc[itemName] = Object.entries(dateEntries)
      .map(([date, entry]) => ({
        name: itemName,
        quantity: entry.quantity,
        date,
        timestamp: new Date(entry.timestamp),
      }))
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    return acc;
  }, {});

  // Generate consistent colors for each item
  const itemColors = Object.keys(stockTrends).reduce(
    (acc: { [key: string]: string }, itemName, index) => {
      const colors = [
        '#2563eb',
        '#dc2626',
        '#16a34a',
        '#9333ea',
        '#ea580c',
        '#0891b2',
        '#4f46e5',
      ];
      acc[itemName] = colors[index % colors.length];
      return acc;
    },
    {}
  );

  // Calculate predictions
  const predictions = Object.entries(stockTrends).map(([itemName, trends]) => {
    const recentTrend = trends.slice(-7); // Get last 7 days
    const currentStock = currentStockMap[itemName] || 0;

    if (recentTrend.length < 2) {
      return {
        itemName,
        avgDailyUsage: 0,
        daysUntilRestock: null,
        currentStock,
      };
    }

    let totalUsage = 0;
    let daysCounted = 0;

    for (let i = 0; i < recentTrend.length - 1; i++) {
      const curr = recentTrend[i];
      const next = recentTrend[i + 1];
      const usage = curr.quantity - next.quantity;
      if (usage > 0) {
        // Only count decreases in stock as usage
        totalUsage += usage;
        daysCounted++;
      }
    }

    const avgDailyUsage = daysCounted > 0 ? totalUsage / daysCounted : 0;
    const daysUntilRestock =
      avgDailyUsage > 0 ? Math.floor(currentStock / avgDailyUsage) : null;

    return {
      itemName,
      avgDailyUsage,
      daysUntilRestock,
      currentStock,
    };
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Stock Analytics Dashboard</h1>

      {/* Usage Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Stock Usage Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  type="category"
                  allowDuplicatedCategory={false}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                {Object.entries(stockTrends).map(([itemName, data]) => (
                  <Line
                    key={itemName}
                    type="monotone"
                    data={data}
                    dataKey="quantity"
                    name={itemName}
                    stroke={itemColors[itemName]}
                    connectNulls
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Predictions */}
      <Card>
        <CardHeader>
          <CardTitle>Restocking Predictions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {predictions.map((prediction) => (
              <Card key={prediction.itemName}>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {prediction.itemName}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="space-y-2">
                    <div>
                      <dt className="text-sm text-muted-foreground">
                        Average Daily Usage
                      </dt>
                      <dd className="text-2xl font-bold">
                        {prediction.avgDailyUsage.toFixed(2)} units
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm text-muted-foreground">
                        Current Stock
                      </dt>
                      <dd className="text-2xl font-bold">
                        {prediction.currentStock} units
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm text-muted-foreground">
                        Days Until Restock Needed
                      </dt>
                      <dd className="text-2xl font-bold">
                        {prediction.daysUntilRestock !== null
                          ? `${prediction.daysUntilRestock} days`
                          : 'N/A'}
                      </dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
