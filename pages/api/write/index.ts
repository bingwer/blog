import { NextApiRequest, NextApiResponse } from 'next';
import withHandler, { ResponseType } from '@libs/server/withHandler';
import withSession from '@libs/server/withSession';
import { prisma } from '@libs/server/prismaClient';
import { Post, Tag, TempPost } from '@prisma/client';

export interface PostResponseType extends ResponseType {
  post?: Post | TempPost | {} | null;
}

const toastEditorEmptyString = '<p><br class="ProseMirror-trailingBreak"></p>';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PostResponseType>,
) {
  const {
    id: PostId,
    title,
    content,
    thumbnailPath,
    uuid,
    tags,
    description,
    url,
    isPrivate,
    selectedSeries,
    postType,
  } = req.body;

  if (req.method === 'GET') {
    const { id, type } = req.query;

    if (type === 'temp') {
      const post = await prisma.tempPost.findUnique({
        where: {
          id: +id,
        },
      });

      const postWithTags = {
        ...post,
        tags: post?.tags?.split(','),
      };

      res.status(200).json({
        ok: true,
        post: post ? postWithTags : null,
      });
      return;
    }

    const post = await prisma.post.findUnique({
      where: {
        id: +id,
      },
      include: {
        tags: {
          select: {
            tag: true,
          },
        },
        series: {
          select: {
            id: true,
          },
        },
      },
    });

    const postWithTags = {
      ...post,
      tags: post?.tags.map(({ tag }: { tag: Tag }) => {
        return tag.name;
      }),
    };

    res.status(200).json({
      ok: true,
      post: post ? postWithTags : null,
    });

    return;
  }

  if (!title || !content || content === toastEditorEmptyString) {
    res.status(500).end();
    return;
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
            tags: {
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
            series: {
              connect: {
                id: +selectedSeries,
              },
            },
          }),
        },
      });

      if (postType) {
        await prisma.tempPost.delete({
          where: {
            id: +PostId,
          },
        });
      }

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

  if (req.method === 'PUT') {
    const { id } = req.body;
    try {
      await prisma.post_Tag.deleteMany({
        where: {
          postId: +id,
        },
      });

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
            tags: {
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
          ...(selectedSeries
            ? {
                series: {
                  connect: {
                    id: +selectedSeries,
                  },
                },
              }
            : {
                series: {
                  disconnect: true,
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
