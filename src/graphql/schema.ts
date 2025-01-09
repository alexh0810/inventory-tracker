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
    GOOD
  }

  type Item {
    _id: ID!
    name: String!
    quantity: Int!
    minThreshold: Int
    category: Category
    stockStatus: StockStatus
    createdAt: String
    updatedAt: String
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

  type StockHistory {
    _id: ID!
    itemId: ID!
    itemName: String!
    quantity: Int!
    timestamp: String!
  }

  type Query {
    items: [Item!]!
    item(_id: ID!): Item
    lowStockItems: [Item!]!
    stockHistory: [StockHistory!]!
  }

  type Mutation {
    createItem(input: CreateItemInput!): Item!
    updateItem(_id: ID!, input: UpdateItemInput!, mode: String): Item!
    deleteItem(_id: ID!): Item
  }
`;
