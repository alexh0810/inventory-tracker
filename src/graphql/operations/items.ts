import { gql } from '@apollo/client';

export const GET_ITEMS = gql`
  query GetItems {
    items {
      _id
      name
      quantity
      minThreshold
      category
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_ITEM = gql`
  mutation CreateItem($input: CreateItemInput!) {
    createItem(input: $input) {
      _id
      name
      quantity
      minThreshold
      category
    }
  }
`;

// Add other operations (UPDATE_ITEM, DELETE_ITEM, etc.)
