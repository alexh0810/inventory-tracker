import Link from 'next/link';
import { useRouter } from 'next/router';
import { Button } from './ui/button';

export function Header() {
  const router = useRouter();

  return (
    <header className="border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-xl font-bold">
              Stock Tracker
            </Link>
            <nav className="flex items-center space-x-2">
              <Button
                variant={router.pathname === '/' ? 'default' : 'ghost'}
                asChild
              >
                <Link href="/">Dashboard</Link>
              </Button>
              <Button
                variant={router.pathname === '/add-item' ? 'default' : 'ghost'}
                asChild
              >
                <Link href="/add-item">Add Item</Link>
              </Button>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
