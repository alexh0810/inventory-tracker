import { BarChart3, Home } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navigationItems = [
  {
    name: 'Home',
    href: '/',
    icon: Home,
  },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
  },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
      {navigationItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            'inline-flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
            pathname === item.href
              ? 'bg-accent text-accent-foreground'
              : 'text-muted-foreground'
          )}
        >
          <item.icon className="mr-2 h-4 w-4" />
          {item.name}
        </Link>
      ))}
    </nav>
  );
}
