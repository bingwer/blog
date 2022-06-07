import { NextApiRequest, NextApiResponse } from 'next';
import withHandler, { ResponseType } from '@libs/server/withHandler';
import withSession from '@libs/server/withSession';
import { prisma } from '@libs/server/prismaClient';

export interface LoginResponseType extends ResponseType {
  user?: { userId: string };
}

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LoginResponseType>,
) {
  const { user: sessionUser } = req.session;

  try {
    const user = await prisma.user.findUnique({
      where: {
        userId: String(sessionUser?.userId),
      },
      select: {
        userId: true,
      },
    });

    if (!user) {
      res.json({
        ok: false,
      });
      return;
    }

    res.json({
      ok: true,
    });
  } catch (e: any) {
    console.log(e);
    res.status(500).end(e);
  }
}

export default withSession(withHandler({ methods: ['GET'], handler }));
