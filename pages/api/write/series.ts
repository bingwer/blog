import { NextApiRequest, NextApiResponse } from 'next';
import withHandler, { ResponseType } from '@libs/server/withHandler';
import withSession from '@libs/server/withSession';
import { prisma } from '@libs/server/prismaClient';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>,
) {
  const { seriesName: name, seriesURL: url, thumbnailPath } = req.body;

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
          ...(thumbnailPath && { thumbnailPath }),
        },
      });

      res.status(200).json({
        ok: true,
      });
    }
  } catch (e: any) {
    console.log(e);
    res.status(500).end(e);
  }
}

export default withSession(
  withHandler({ methods: ['POST', 'DELETE'], handler }),
);
