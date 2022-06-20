import { NextApiRequest, NextApiResponse } from 'next';
import withHandler, { ResponseType } from '@libs/server/withHandler';
import withSession from '@libs/server/withSession';
import { prisma } from '@libs/server/prismaClient';

export interface CustomSeries {
  id: number;
  name: string;
  url: string;
}

export interface SeiresResponseType extends ResponseType {
  series: CustomSeries[];
}

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SeiresResponseType>,
) {
  try {
    const series = await prisma.series.findMany({
      select: {
        id: true,
        name: true,
        url: true,
      },
    });
    res.status(200).json({ ok: true, series });
  } catch (e: any) {
    console.log(e);
    res.status(500).end(e);
  }
}

export default withSession(withHandler({ methods: ['GET'], handler }));
