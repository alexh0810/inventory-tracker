import { ApolloServer } from 'apollo-server-micro';
import { typeDefs } from '../../graphql/schema';
import resolvers from '../../graphql/resolvers';
import Cors from 'micro-cors';
import { NextApiRequest, NextApiResponse } from 'next';
import { RequestHandler } from 'micro';

const cors = Cors();

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: async () => {
    return {};
  },
  introspection: true,
});

const startServer = apolloServer.start();

export default cors(async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'OPTIONS') {
    res.end();
    return false;
  }

  await startServer;

  await apolloServer.createHandler({
    path: '/api/graphql',
  })(req, res);
} as RequestHandler);

export const config = {
  api: {
    bodyParser: false,
  },
};
