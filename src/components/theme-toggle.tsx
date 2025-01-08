'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <Button variant="ghost" size="sm" className="w-12 h-12 relative" />;
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="w-12 h-12 relative"
    >
      {theme === 'dark' ? (
        <Sun className="h-7 w-7" />
      ) : (
        <Moon className="h-7 w-7" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
