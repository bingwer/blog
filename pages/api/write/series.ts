import { NextApiRequest, NextApiResponse } from 'next';
import withHandler, { ResponseType } from '@libs/server/withHandler';
import withSession from '@libs/server/withSession';
import { prisma } from '@libs/server/prismaClient';
import { Series } from '@prisma/client';

interface SeiresReturnType extends ResponseType {
  series?: Series[];
}

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SeiresReturnType>,
) {
  const { seriesName: name, seriesURL: url } = req.body;

  if (!name || !url) {
    res.status(500).end();
    return;
  }

  try {
    if (req.method === 'POST') {
      await prisma.series.create({
        data: {
          name,
          url,
        },
      });

      res.status(200).json({
        ok: true,
      });
    }

    if (req.method === 'GET') {
      const series = await prisma.series.findMany();
      res.status(200).json({ ok: true, series });
    }
  } catch (e: any) {
    console.log(e);
    res.status(500).end(e);
  }
}

export default withSession(
  withHandler({ methods: ['POST', 'DELETE'], handler }),
);
