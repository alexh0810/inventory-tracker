import { render, screen, fireEvent, waitFor } from '@/test/test-utils';
import { AddUpdateStock } from '../add-update-stock';
import { CREATE_ITEM, GET_ITEMS } from '@/graphql/operations/items';
import { toast } from 'react-hot-toast';

const mocks = [
  {
    request: {
      query: CREATE_ITEM,
      variables: {
        input: {
          name: 'New Item',
          category: 'FOOD',
          quantity: 10,
          minThreshold: 10,
        },
      },
    },
    result: {
      data: {
        createItem: {
          _id: '1',
          name: 'New Item',
          category: 'FOOD',
          quantity: 10,
          minThreshold: 10,
        },
      },
    },
  },
  {
    request: {
      query: GET_ITEMS,
    },
    result: {
      data: {
        items: [
          {
            _id: '1',
            name: 'New Item',
            category: 'FOOD',
            quantity: 10,
            minThreshold: 10,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
      },
    },
  },
  {
    request: {
      query: GET_ITEMS,
    },
    result: {
      data: {
        items: [
          {
            _id: '1',
            name: 'New Item',
            category: 'FOOD',
            quantity: 10,
            minThreshold: 10,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
      },
    },
  },
];

// Add jest mock for toast
jest.mock('react-hot-toast', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('AddUpdateStock', () => {
  it('renders form fields', () => {
    render(<AddUpdateStock />);

    expect(screen.getByPlaceholderText('Item Name')).toBeInTheDocument();
    expect(screen.getByText('Select Category')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Quantity')).toBeInTheDocument();
  });
  it('handles form submission', async () => {
    render(<AddUpdateStock />, { mocks });

    // Fill form
    fireEvent.change(screen.getByPlaceholderText('Item Name'), {
      target: { value: 'New Item' },
    });

    fireEvent.click(screen.getByText('Select Category'));
    fireEvent.click(screen.getByRole('option', { name: 'Food' }));

    fireEvent.change(screen.getByPlaceholderText('Quantity'), {
      target: { value: '10' },
    });

    // Submit form
    fireEvent.click(screen.getByText('Add/Update Item'));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        'Item quantity updated successfully!'
      );
    });
  });
});
