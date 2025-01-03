import { gql } from '@apollo/client';

export const typeDefs = gql`
  enum Category {
    FOOD
    BEVERAGE
    SUPPLIES
    OTHER
  }

  enum StockStatus {
    LOW
    MEDIUM
    GOOD
  }

  type Item {
    _id: ID!
    name: String!
    quantity: Int!
    minThreshold: Int!
    category: Category!
    stockStatus: StockStatus!
    createdAt: String!
    updatedAt: String!
  }

  input CreateItemInput {
    name: String!
    quantity: Int!
    minThreshold: Int!
    category: Category!
  }

  input UpdateItemInput {
    name: String
    quantity: Int
    minThreshold: Int
    category: Category
  }

  type Query {
    items: [Item!]!
    item(_id: ID!): Item
    lowStockItems: [Item!]!
  }

  type Mutation {
    createItem(input: CreateItemInput!): Item!
    updateItem(_id: ID!, input: UpdateItemInput!): Item!
    deleteItem(_id: ID!): Item!
  }
`;
