import { NextApiRequest, NextApiResponse } from 'next';
import withHandler, { ResponseType } from '@libs/server/withHandler';
import withSession from '@libs/server/withSession';
import { prisma } from '@libs/server/prismaClient';
import { Post } from '@prisma/client';

export interface PostResponseType extends ResponseType {
  post?: Post | {} | null;
}

const toastEditorEmptyString = '<p><br class="ProseMirror-trailingBreak"></p>';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PostResponseType>,
) {
  const { id, title, content, thumbnailPath, uuid, tags } = req.body;

  if (!title || !content || content === toastEditorEmptyString) {
    res.status(500).end();
    return;
  }

  if (req.method === 'POST') {
    try {
      await prisma.tempPost.create({
        data: {
          title,
          content,
          uuid,
          tags,
          ...(thumbnailPath && { thumbnailPath }),
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

  if (req.method === 'PUT') {
    try {
      await prisma.tempPost.update({
        where: {
          id: +id,
        },
        data: {
          title,
          content,
          tags,
          ...(thumbnailPath && { thumbnailPath }),
        },
      });
      res.status(200).json({
        ok: true,
      });
      return;
    } catch (e: any) {
      console.log(e);
      res.status(500).end(e);
    }
  }
}

export default withSession(withHandler({ methods: ['POST', 'PUT'], handler }));
