/* eslint-disable func-names */
/* eslint-disable object-shorthand */
import { NextApiRequest, NextApiResponse } from 'next';
import withHandler, { ResponseType } from '@libs/server/withHandler';
import nextConnect from 'next-connect';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import withSession from '@libs/server/withSession';

export const config = {
  api: {
    bodyParser: false,
  },
};

interface uploadType extends ResponseType {
  filePath?: string;
}

interface NextApiRequestWithFile extends NextApiRequest {
  file: {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    destination: string;
    filename: string;
    path: string;
    size: number;
  };
}

const handler = nextConnect<NextApiRequest, NextApiResponse>({});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const filePath = `public/posts/${path.basename(
      file.originalname,
      path.extname(file.originalname) || 'undefined',
    )}`;
    fs.mkdirSync(filePath, { recursive: true });
    cb(null, filePath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
});

const uploadFile = upload.single('file');

handler.use(uploadFile);

handler.post(
  (req: NextApiRequestWithFile, res: NextApiResponse<uploadType>) => {
    try {
      const filePath = req.file.path.replace('public', '');
      res.status(200).json({ ok: true, filePath });
    } catch (e) {
      console.log(e);
      res.status(500).end();
    }
  },
);

export default withSession(
  withHandler({ methods: ['POST'], handler, isPrivate: true }),
);
