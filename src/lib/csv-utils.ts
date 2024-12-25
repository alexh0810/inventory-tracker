interface StockItem {
  name: string;
  category: string;
  quantity: number;
  minThreshold: number;
}

export function convertToCSV(items: StockItem[]): string {
  const headers = ['Name', 'Category', 'Current Quantity', 'Min Threshold'];
  const rows = items.map((item) => [
    item.name,
    item.category.toLowerCase(),
    item.quantity.toString(),
    item.minThreshold.toString(),
  ]);

  return [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
}

export function downloadCSV(csvContent: string, filename: string): void {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
