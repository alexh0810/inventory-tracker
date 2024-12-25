import { CurrentStockLevels } from '@/components/stock/current-stock-levels';
import { LowStockAlerts } from '@/components/stock/low-stock-alerts';
import { AddUpdateStock } from '@/components/stock/add-update-stock';

export default function Dashboard() {
  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <h1 className="text-4xl font-bold">Event Stock Tracker</h1>

      <div className="space-y-6">
        <CurrentStockLevels />
        <LowStockAlerts />
        <AddUpdateStock />
      </div>
    </div>
  );
}
