import { NextApiRequest, NextApiResponse } from 'next';
import withHandler, { ResponseType } from '@libs/server/withHandler';
import withSession from '@libs/server/withSession';
import { prisma } from '@libs/server/prismaClient';

const toastEditorEmptyString = '<p><br class="ProseMirror-trailingBreak"></p>';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>,
) {
  const {
    title,
    content,
    thumbnailPath,
    uuid,
    tags,
    description,
    url,
    isPrivate,
    selectedSeries,
  } = req.body;

  if (!title || !content || content === toastEditorEmptyString) {
    res.status(500).end();
    return;
  }

  try {
    await prisma.post.create({
      data: {
        title,
        content,
        description,
        uuid,
        url,
        isPrivate,
        ...(thumbnailPath && { thumbnailPath }),
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
        ...(selectedSeries && {
          Series: {
            create: {
              series: {
                connect: {
                  id: +selectedSeries,
                },
              },
            },
          },
        }),
      },
    });
    res.status(200).json({
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
