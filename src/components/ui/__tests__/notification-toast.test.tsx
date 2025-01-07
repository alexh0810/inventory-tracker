import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { StockNotifications } from '../notification-toast';
import { GET_LOW_STOCK_ITEMS } from '@/graphql/operations/items';
import { InMemoryCache } from '@apollo/client';

// Mock Next.js router
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

const mockLowStockItems = [
  {
    _id: '1',
    name: 'Coffee',
    quantity: 5,
    minThreshold: 10,
  },
  {
    _id: '2',
    name: 'Tea',
    quantity: 2,
    minThreshold: 5,
  },
];

describe('StockNotifications', () => {
  const mocks = [
    {
      request: {
        query: GET_LOW_STOCK_ITEMS,
        variables: {},
      },
      result: {
        data: {
          lowStockItems: mockLowStockItems,
        },
      },
    },
  ];

  it('renders low stock alerts when items are below threshold', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <StockNotifications />
      </MockedProvider>
    );

    await waitFor(
      () => {
        const alertText = screen.getByText('Low Stock Alert', {
          selector: 'span.font-semibold',
        });
        expect(alertText).toBeInTheDocument();
      },
      { timeout: 2000 }
    );

    expect(
      screen.getByText('Coffee', {
        selector: 'p.font-medium.text-destructive',
      })
    ).toBeInTheDocument();
    expect(screen.getByText('Current: 5')).toBeInTheDocument();
  });

  it('shows correct count of low stock items', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <StockNotifications />
      </MockedProvider>
    );

    await waitFor(
      () => {
        expect(
          screen.getByText('2', { selector: 'div.ml-2' })
        ).toBeInTheDocument();
      },
      { timeout: 2000 }
    );
  });

  it('can be closed temporarily', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <StockNotifications />
      </MockedProvider>
    );

    await waitFor(
      () => {
        const alertText = screen.getByText('Low Stock Alert', {
          selector: 'span.font-semibold',
        });
        expect(alertText).toBeInTheDocument();
      },
      { timeout: 2000 }
    );

    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);

    expect(
      screen.queryByText('Low Stock Alert', { selector: 'span.font-semibold' })
    ).not.toBeInTheDocument();
  });

  it('reopens when stock data changes', async () => {
    const cache = new InMemoryCache();

    // Initialize cache with initial data
    cache.writeQuery({
      query: GET_LOW_STOCK_ITEMS,
      data: {
        lowStockItems: mockLowStockItems,
      },
    });

    // Setup initial render with first mock
    const { rerender } = render(
      <MockedProvider
        mocks={mocks}
        cache={cache}
        addTypename={false}
        defaultOptions={{
          watchQuery: {
            fetchPolicy: 'cache-and-network',
          },
        }}
      >
        <StockNotifications />
      </MockedProvider>
    );

    // Wait for initial render
    await waitFor(
      () => {
        const container = screen.getByTestId('stock-notification');
        expect(container).toBeInTheDocument();
      },
      { timeout: 2000 }
    );

    // Close notification
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);

    // Verify it's closed
    expect(screen.queryByTestId('stock-notification')).not.toBeInTheDocument();

    // Create new mock with updated data
    const updatedMock = {
      request: {
        query: GET_LOW_STOCK_ITEMS,
        variables: {},
      },
      newData: true,
      result: {
        data: {
          lowStockItems: [
            ...mockLowStockItems,
            {
              _id: '3',
              name: 'Sugar',
              quantity: 1,
              minThreshold: 5,
            },
          ],
        },
      },
    };

    // Update cache with new data
    cache.writeQuery({
      query: GET_LOW_STOCK_ITEMS,
      data: updatedMock.result.data,
    });

    // Rerender with new mock
    rerender(
      <MockedProvider mocks={[updatedMock]} cache={cache} addTypename={false}>
        <StockNotifications />
      </MockedProvider>
    );

    // Wait for and verify the update
    await waitFor(
      () => {
        const items = screen.getAllByTestId('stock-item');
        expect(items).toHaveLength(3);
      },
      { timeout: 2000 }
    );
  });
});
