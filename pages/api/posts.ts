import fs from 'fs';
import matter from 'gray-matter';
import type { NextApiHandler } from 'next';
import path from 'path';
import { readPostsInfo } from '../../lib/helper';

const handler: NextApiHandler = (req, res) => {
  const { method } = req;

  switch (method) {
    case 'GET': {
      const data = readPostsInfo();
      return res.json({ postInfo: data });
    }
    default:
      return res.status(404).send('Not found');
  }
};

readPostsInfo();

export default handler;
