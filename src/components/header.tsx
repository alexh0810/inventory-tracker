import Link from 'next/link';
import { Button } from './ui/button';

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-xl font-bold">
              Stock Tracker
            </Link>
            <nav className="flex items-center space-x-2">
              <Button variant="ghost" asChild>
                <Link href="/">Dashboard</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link href="/analytics">Analytics</Link>
              </Button>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
