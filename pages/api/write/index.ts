import { NextApiRequest, NextApiResponse } from 'next';
import withHandler, { ResponseType } from '@libs/server/withHandler';
import withSession from '@libs/server/withSession';
import { prisma } from '@libs/server/prismaClient';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>,
) {
  const { title, content, thumbnailPath, uuid, isTemp, tags } = req.body;

  if (!title || !content) {
    res.status(500).end();
    return;
  }

  try {
    await prisma.post.create({
      data: {
        title,
        content,
        thumbnailPath,
        uuid,
        isTemp,
        ...(tags.length > 0 && {
          Tags: {
            create: tags.map((tagName: string) => {
              return {
                tag: {
                  connectOrCreate: {
                    where: {
                      name: tagName,
                    },
                    create: {
                      name: tagName,
                    },
                  },
                },
              };
            }),
          },
        }),
      },
    });
    res.json({
      ok: true,
    });
  } catch (e: any) {
    console.log(e);
    res.status(500).end(e);
  }
}

export default withSession(
  withHandler({ methods: ['POST', 'PUT', 'DELETE'], handler }),
);
