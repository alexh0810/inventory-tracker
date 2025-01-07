import { CurrentStockLevels } from '@/components/stock/current-stock-levels';
import { QuickStockUpdate } from '@/components/stock/quick-stock-update';

export default function Home() {
  return (
    <div className="container py-10 space-y-6">
      <QuickStockUpdate />
      <CurrentStockLevels />
    </div>
  );
}
