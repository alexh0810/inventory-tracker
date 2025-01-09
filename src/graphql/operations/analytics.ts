import { gql } from '@apollo/client';

export const GET_STOCK_HISTORY = gql`
  query GetStockHistory {
    items {
      _id
      name
      quantity
    }
    stockHistory {
      _id
      itemId
      itemName
      quantity
      timestamp
    }
  }
`;
