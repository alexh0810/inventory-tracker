import { CurrentStockLevels } from '@/components/stock/current-stock-levels';
import { QuickStockUpdate } from '@/components/stock/quick-stock-update';

export default function HomePage() {
  return (
    <div className="container py-6 space-y-6">
      <QuickStockUpdate />
      <CurrentStockLevels />
    </div>
  );
}
