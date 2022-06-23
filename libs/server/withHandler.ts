import { NextApiRequest, NextApiResponse } from 'next';

export interface ResponseType {
  ok: boolean;
}

type methods = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface WithHandlerProps {
  methods: methods[];
  handler: (req: NextApiRequest, res: NextApiResponse) => void;
  isPrivate?: boolean;
}

export default function withHandler({
  methods: handlerMethods,
  handler,
  isPrivate = false,
}: WithHandlerProps) {
  return async function WrappedHandler(
    req: NextApiRequest,
    res: NextApiResponse,
  ): Promise<any> {
    if (req.method && !handlerMethods.includes(req.method as any)) {
      return res.status(405).end();
    }

    if (isPrivate && !req.session?.user) {
      return res.status(401).json({ ok: false });
    }

    try {
      await handler(req, res);
    } catch (error) {
      return res.status(500).json({ error });
    }
  };
}
