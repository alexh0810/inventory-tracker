import '@testing-library/jest-dom';
<<<<<<< HEAD
import { TextEncoder, TextDecoder } from 'node:util';

// Add TextEncoder polyfill
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Create a proper mock for Next.js navigation
const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  prefetch: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  refresh: jest.fn(),
  pathname: '/',
  route: '/',
  asPath: '/',
  query: {},
  events: {
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
  },
};

// Mock the entire next/navigation module
jest.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
  useParams: () => ({}),
}));

// Mock URL.createObjectURL
global.URL.createObjectURL = jest.fn();
global.URL.revokeObjectURL = jest.fn();

// Export mockRouter for test usage
export { mockRouter };

// Suppress mongoose warnings
process.env.SUPPRESS_JEST_WARNINGS = 'true';
=======

jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    };
  },
  usePathname() {
    return '';
  },
}));
>>>>>>> feature/stock-alert
