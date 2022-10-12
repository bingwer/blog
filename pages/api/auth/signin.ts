import { NextApiRequest, NextApiResponse } from 'next';
import withHandler, { ResponseType } from '@libs/server/withHandler';
import bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';
import { prisma } from '@libs/server/prismaClient';

interface SignInResponseType extends ResponseType {
  msg?: string;
}

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SignInResponseType>,
) {
  const { userId, password }: any = req.body;

  if (!userId || !password) {
    res.status(500).json({ ok: false });
    return;
  }

  try {
    const salt = bcrypt.genSaltSync(10);
    const encryptedPassword = bcrypt.hashSync(password, salt);

    await prisma.user.create({
      data: {
        userId,
        password: encryptedPassword,
      },
    });

    res.status(200).json({ ok: true });
  } catch (e: Prisma.PrismaClientKnownRequestError | any) {
    if (e.code === 'P2002') {
      res.status(500).json({ ok: false, msg: 'username is duplicated' });
    } else {
      console.log(e);
      res.status(500).json({ ok: false, msg: e });
    }
  }
}

export default withHandler({ methods: ['POST'], handler });
