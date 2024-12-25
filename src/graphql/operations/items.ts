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

export const UPDATE_ITEM = gql`
  mutation UpdateItem($id: ID!, $input: UpdateItemInput!) {
    updateItem(id: $id, input: $input) {
      _id
      name
      quantity
      minThreshold
      category
    }
  }
`;

export const DELETE_ITEM = gql`
  mutation DeleteItem($_id: ID!) {
    deleteItem(_id: $_id) {
      _id
    }
  }
`;
