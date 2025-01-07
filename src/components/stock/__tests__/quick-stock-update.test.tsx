import { render, screen, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { QuickStockUpdate } from '../quick-stock-update';
import {
  GET_ITEMS,
  UPDATE_ITEM,
  GET_LOW_STOCK_ITEMS,
} from '@/graphql/operations/items';
import { toast } from 'react-hot-toast';
import userEvent from '@testing-library/user-event';
import React from 'react';

// Mock toast
jest.mock('react-hot-toast');

// Mock scrollIntoView
window.HTMLElement.prototype.scrollIntoView = jest.fn();

const mockItems = [
  {
    _id: '1',
    name: 'Coffee',
    quantity: 10,
    minThreshold: 5,
    category: 'BEVERAGE',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: '2',
    name: 'Tea',
    quantity: 15,
    minThreshold: 8,
    category: 'BEVERAGE',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Mock the select components
jest.mock('@/components/ui/select', () => ({
  Select: ({
    children,
    onValueChange,
  }: {
    children: React.ReactNode;
    onValueChange?: (value: string) => void;
  }) => {
    React.useEffect(() => {
      const root = document.querySelector('[data-testid="select-root"]');
      const handler = (e: Event) => {
        const customEvent = e as CustomEvent<string>;
        onValueChange?.(customEvent.detail);
      };
      root?.addEventListener('select-value-change', handler as EventListener);
      return () =>
        root?.removeEventListener(
          'select-value-change',
          handler as EventListener
        );
    }, [onValueChange]);

    return <div data-testid="select-root">{children}</div>;
  },
  SelectTrigger: ({ children }: { children: React.ReactNode }) => (
    <button type="button" data-testid="select-trigger">
      {children}
    </button>
  ),
  SelectContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="select-content">{children}</div>
  ),
  SelectItem: ({
    value,
    children,
  }: {
    value: string;
    children: React.ReactNode;
  }) => (
    <div
      role="option"
      aria-selected={false}
      data-testid="select-item"
      data-value={value}
      onClick={() => {
        const event = new CustomEvent<string>('select-value-change', {
          detail: value,
          bubbles: true,
        });
        document
          .querySelector('[data-testid="select-root"]')
          ?.dispatchEvent(event);
      }}
    >
      {children}
    </div>
  ),
  SelectValue: ({ placeholder }: { placeholder: string }) => (
    <span data-testid="select-value">{placeholder}</span>
  ),
}));

const mocks = [
  {
    request: {
      query: GET_ITEMS,
    },
    result: {
      data: {
        items: mockItems,
      },
    },
  },
  {
    request: {
      query: GET_LOW_STOCK_ITEMS,
    },
    result: {
      data: {
        lowStockItems: mockItems.filter(
          (item) => item.quantity <= item.minThreshold
        ),
      },
    },
  },
  {
    request: {
      query: UPDATE_ITEM,
      variables: {
        _id: '1',
        input: { quantity: 5 },
        mode: 'QUICK',
      },
    },
    result: {
      data: {
        updateItem: {
          _id: '1',
          name: 'Coffee',
          quantity: 15,
          minThreshold: 5,
          category: 'BEVERAGE',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      },
    },
  },
];

describe('QuickStockUpdate', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders select and quantity inputs', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <QuickStockUpdate />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('select-trigger')).toBeInTheDocument();
    });

    expect(screen.getByPlaceholderText('Quantity')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Remove' })).toBeInTheDocument();
  });

  it('validates form inputs', async () => {
    const user = userEvent.setup();

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <QuickStockUpdate />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('select-trigger')).toBeInTheDocument();
    });

    // Try to update without selecting item but with valid quantity
    const quantityInput = screen.getByPlaceholderText('Quantity');
    await user.type(quantityInput, '5');

    const addButton = screen.getByRole('button', { name: 'Add' });
    await user.click(addButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Please select an item');
    });

    // Now select an item
    const trigger = screen.getByTestId('select-trigger');
    await user.click(trigger);
    const targetItem = screen.getByRole('option', {
      name: 'Coffee (Current: 10)',
    });
    await user.click(targetItem);

    // Clear quantity and verify buttons are disabled
    await user.clear(quantityInput);

    expect(screen.getByRole('button', { name: 'Add' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Remove' })).toBeDisabled();
  });

  it('handles successful stock addition', async () => {
    const user = userEvent.setup();

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <QuickStockUpdate />
      </MockedProvider>
    );

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByTestId('select-trigger')).toBeInTheDocument();
    });

    // Click the trigger to open the select
    const trigger = screen.getByTestId('select-trigger');
    await user.click(trigger);

    // Find and click the desired option
    const targetItem = screen.getByRole('option', {
      name: 'Coffee (Current: 10)',
    });
    await user.click(targetItem);

    // Enter quantity
    const quantityInput = screen.getByPlaceholderText('Quantity');
    await user.type(quantityInput, '5');

    // Add stock
    const addButton = screen.getByRole('button', { name: 'Add' });
    await user.click(addButton);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Successfully added stock');
    });
  });

  it('handles error during update', async () => {
    const errorMock = {
      request: {
        query: UPDATE_ITEM,
        variables: {
          _id: '1',
          input: { quantity: -20 },
          mode: 'QUICK',
        },
      },
      error: new Error('Cannot reduce quantity below 0'),
    };

    const user = userEvent.setup();

    render(
      <MockedProvider mocks={[...mocks, errorMock]} addTypename={false}>
        <QuickStockUpdate />
      </MockedProvider>
    );

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByTestId('select-trigger')).toBeInTheDocument();
    });

    // Click the trigger to open the select
    const trigger = screen.getByTestId('select-trigger');
    await user.click(trigger);

    // Find and click the desired option
    const targetItem = screen.getByRole('option', {
      name: 'Coffee (Current: 10)',
    });
    await user.click(targetItem);

    // Enter quantity
    const quantityInput = screen.getByPlaceholderText('Quantity');
    await user.type(quantityInput, '20');

    // Click remove button
    const removeButton = screen.getByRole('button', { name: 'Remove' });
    await user.click(removeButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Cannot reduce quantity below 0'
      );
    });
  });

  it('handles error during update', async () => {
    const errorMock = {
      request: {
        query: UPDATE_ITEM,
        variables: {
          _id: '1',
          input: { quantity: 5 },
          mode: 'QUICK',
        },
      },
      error: new Error('Failed to update stock'),
    };

    const user = userEvent.setup();

    render(
      <MockedProvider mocks={[errorMock]} addTypename={false}>
        <QuickStockUpdate />
      </MockedProvider>
    );

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByTestId('select-trigger')).toBeInTheDocument();
    });

    // Select item and enter quantity
    const trigger = screen.getByTestId('select-trigger');
    await user.click(trigger);
    const targetItem = screen.getByRole('option', {
      name: 'Coffee (Current: 10)',
    });
    await user.click(targetItem);

    const quantityInput = screen.getByPlaceholderText('Quantity');
    await user.type(quantityInput, '5');

    // Try to add stock
    const addButton = screen.getByRole('button', { name: 'Add' });
    await user.click(addButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to update stock');
    });
  });
});
