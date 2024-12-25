import { render, screen, fireEvent, waitFor } from '@/test/test-utils';
import { CurrentStockLevels } from '../current-stock-levels';
import { GET_ITEMS, DELETE_ITEM } from '@/graphql/operations/items';
import { convertToCSV } from '@/lib/csv-utils';

const mocks = [
  {
    request: {
      query: GET_ITEMS,
    },
    result: {
      data: {
        items: [
          {
            _id: '1',
            name: 'Test Item',
            category: 'FOOD',
            quantity: 5,
            minThreshold: 2,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
      },
    },
  },
  {
    request: {
      query: DELETE_ITEM,
      variables: { _id: '1' },
    },
    result: {
      data: {
        deleteItem: { _id: '1' },
      },
    },
    newData: () => ({
      data: {
        items: [],
      },
    }),
  },
  {
    request: {
      query: GET_ITEMS,
    },
    result: {
      data: {
        items: [],
      },
    },
  },
];

describe('CurrentStockLevels', () => {
  it('renders loading state initially', () => {
    render(<CurrentStockLevels />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders items after loading', async () => {
    render(<CurrentStockLevels />, { mocks });

    await waitFor(() => {
      expect(screen.getByText('Test Item')).toBeInTheDocument();
    });

    expect(screen.getByText('food')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('handles delete confirmation flow', async () => {
    render(<CurrentStockLevels />, { mocks });

    await waitFor(() => {
      expect(screen.getByText('Test Item')).toBeInTheDocument();
    });

    // Find and click the delete button by its aria-label
    const deleteButton = screen.getByRole('button', {
      name: /delete item/i,
    });
    fireEvent.click(deleteButton);

    // Confirm deletion
    const confirmButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(screen.queryByText('Test Item')).not.toBeInTheDocument();
    });
  });
});

describe('CSV Export', () => {
  it('generates correct CSV format', () => {
    const mockItems = [
      {
        _id: '1',
        name: 'Test Item',
        category: 'FOOD',
        quantity: 5,
        minThreshold: 2,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    const expectedCSV =
      'Name,Category,Current Quantity,Min Threshold\nTest Item,food,5,2';
    const result = convertToCSV(mockItems);
    expect(result).toBe(expectedCSV);
  });

  it('shows export button and handles click', async () => {
    global.URL.createObjectURL = jest.fn();

    render(<CurrentStockLevels />, { mocks });

    await waitFor(() => {
      expect(screen.getByText('Export CSV')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Export CSV'));

    // Verify that URL.createObjectURL was called
    expect(global.URL.createObjectURL).toHaveBeenCalled();
  });
});