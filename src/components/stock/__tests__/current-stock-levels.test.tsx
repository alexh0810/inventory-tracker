import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { CurrentStockLevels } from '../current-stock-levels';
import { GET_ITEMS, DELETE_ITEM } from '@/graphql/operations/items';
import { mockRouter, resetRouterMocks } from '@/test-utils/router-mock';
import { toast } from 'react-hot-toast';

// Mock toast
jest.mock('react-hot-toast');

// Mock CSV utilities
jest.mock('@/lib/csv-utils', () => ({
  convertToCSV: jest.fn(() => 'mock,csv,data'),
  downloadCSV: jest.fn(),
}));

const mockItems = [
  {
    _id: '1',
    name: 'Test Item 1',
    category: 'CATEGORY_1',
    quantity: 5,
    minThreshold: 10,
  },
  {
    _id: '2',
    name: 'Test Item 2',
    category: 'CATEGORY_2',
    quantity: 15,
    minThreshold: 10,
  },
];

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
      query: DELETE_ITEM,
      variables: { _id: '1' },
    },
    result: {
      data: {
        deleteItem: { _id: '1' },
      },
    },
  },
];

describe('CurrentStockLevels', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    resetRouterMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders loading state initially', () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <CurrentStockLevels />
      </MockedProvider>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders items and their stock status correctly', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <CurrentStockLevels />
      </MockedProvider>
    );

    // Wait for items to load
    await waitFor(() => {
      expect(screen.getByText('Test Item 1')).toBeInTheDocument();
    });

    // Check if items are rendered with correct status
    expect(screen.getByText('Test Item 1')).toBeInTheDocument();
    expect(screen.getByText('Test Item 2')).toBeInTheDocument();
    expect(screen.getByText('LOW')).toBeInTheDocument();
    expect(screen.getByText('GOOD')).toBeInTheDocument();
  });

  it('navigates to add item page when Add Item button is clicked', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <CurrentStockLevels />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Add Item')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Add Item'));
    expect(mockRouter.push).toHaveBeenCalledWith('/stock/add');
  });

  it('handles CSV export', async () => {
    const { convertToCSV, downloadCSV } = jest.requireMock('@/lib/csv-utils');

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <CurrentStockLevels />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Export CSV')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Export CSV'));

    expect(convertToCSV).toHaveBeenCalledWith(mockItems);
    expect(downloadCSV).toHaveBeenCalled();
  });

  it('handles item deletion', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <CurrentStockLevels />
      </MockedProvider>
    );

    // Wait for items to load
    await waitFor(() => {
      expect(screen.getByText('Test Item 1')).toBeInTheDocument();
    });

    // Click delete button for first item
    const deleteButtons = screen.getAllByLabelText('Delete item');
    fireEvent.click(deleteButtons[0]);

    // Confirm deletion in dialog
    const deleteConfirmButton = screen.getByText('Delete');
    fireEvent.click(deleteConfirmButton);

    // Verify success toast
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Item deleted successfully');
    });
  });

  it('navigates to edit page when edit button is clicked', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <CurrentStockLevels />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Item 1')).toBeInTheDocument();
    });

    const editButtons = screen.getAllByLabelText('Edit item');
    fireEvent.click(editButtons[0]);

    expect(mockRouter.push).toHaveBeenCalledWith('/stock/edit/1');
  });

  it('handles GraphQL error state', async () => {
    const errorMock = [
      {
        request: {
          query: GET_ITEMS,
        },
        error: new Error('Failed to load items'),
      },
    ];

    render(
      <MockedProvider mocks={errorMock} addTypename={false}>
        <CurrentStockLevels />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(
        screen.getByText('Error loading stock levels')
      ).toBeInTheDocument();
    });
  });
});
