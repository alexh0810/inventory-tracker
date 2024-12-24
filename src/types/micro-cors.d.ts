import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

declare module 'micro-cors' {
  export default function cors(options?: {
    allowMethods?: string[];
    allowHeaders?: string[];
    origin?: string;
    maxAge?: number;
  }): (
    handler: (
      req: NextApiRequest,
      res: NextApiResponse
    ) => Promise<void | NextApiResponse>
  ) => NextApiHandler;
}
