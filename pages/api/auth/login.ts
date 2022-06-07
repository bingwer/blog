import { NextApiRequest, NextApiResponse } from 'next';
import withHandler, { ResponseType } from '@libs/server/withHandler';
import bcrypt from 'bcrypt';
import withSession from '@libs/server/withSession';
import { prisma } from '@libs/server/prismaClient';

export interface LoginResponseType extends ResponseType {
  user?: { userId: string };
}

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LoginResponseType>,
) {
  const { userId, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: {
        userId: String(userId),
      },
    });

    if (!user) {
      res.status(401).json({ ok: false });
      return;
    }

    const isPassword = await bcrypt.compareSync(password, user.password);

    if (!isPassword) {
      res.status(401).json({ ok: false });
      return;
    }

    req.session.user = {
      userId: user.userId,
    };

    await req.session.save();

    res.json({
      ok: true,
      user: { userId },
    });
  } catch (e: any) {
    console.log(e);
    res.status(500).end(e);
  }
}

export default withSession(withHandler({ methods: ['POST'], handler }));
