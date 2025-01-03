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

export const GET_ITEM = gql`
  query GetItem($_id: ID!) {
    item(_id: $_id) {
      _id
      name
      category
      quantity
      minThreshold
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
  mutation UpdateItem($_id: ID!, $input: UpdateItemInput!, $mode: String) {
    updateItem(_id: $_id, input: $input, mode: $mode) {
      _id
      name
      category
      quantity
      minThreshold
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
