// Create a mock router object
export const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  refresh: jest.fn(),
  prefetch: jest.fn(),
};

// Mock the useRouter hook
jest.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
}));

// Helper to reset all mock functions
export const resetRouterMocks = () => {
  mockRouter.push.mockReset();
  mockRouter.replace.mockReset();
  mockRouter.back.mockReset();
  mockRouter.forward.mockReset();
  mockRouter.refresh.mockReset();
  mockRouter.prefetch.mockReset();
};
