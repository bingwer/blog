import { NextApiRequest, NextApiResponse } from 'next';
import withHandler, { ResponseType } from '@libs/server/withHandler';
import withSession from '@libs/server/withSession';
import { prisma } from '@libs/server/prismaClient';
import { Post } from '@prisma/client';

export interface PostResponseType extends ResponseType {
  post?: Post | {};
}

const toastEditorEmptyString = '<p><br class="ProseMirror-trailingBreak"></p>';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PostResponseType>,
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

  const { id } = req.query;

  if (req.method === 'GET') {
    const post = await prisma.post.findUnique({
      where: {
        id: +id,
      },
      include: {
        Tags: {
          select: {
            tag: true,
          },
        },
        Series: {
          select: {
            series: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    });

    const postWithTags = {
      ...post,
      Tags: post?.Tags.map(tag => {
        return tag.tag.name;
      }),
      Series: post?.Series[0]?.series.id,
    };

    res.status(200).json({
      ok: true,
      post: postWithTags || {},
    });

    return;
  }

  if (!title || !content || content === toastEditorEmptyString) {
    res.status(500).end();
    return;
  }

  if (req.method === 'PUT') {
    if (!title || !content || content === toastEditorEmptyString) {
      res.status(500).end();
      return;
    }

    try {
      await prisma.post.update({
        where: {
          id: +id,
        },
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
              update: tags.map((tagName: string) => {
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
              update: {
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
      return;
    } catch (e: any) {
      console.log(e);
      res.status(500).end(e);
      return;
    }
  }

  if (req.method === 'POST') {
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
      return;
    } catch (e: any) {
      console.log(e);
      res.status(500).end(e);
      return;
    }
  }

  if (req.method === 'DELETE') {
    //
  }
}

export default withSession(
  withHandler({ methods: ['GET', 'POST', 'PUT', 'DELETE'], handler }),
);
