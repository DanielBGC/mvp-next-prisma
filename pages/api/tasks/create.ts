import { prismaClient } from '../../../lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

// eslint-disable-next-line import/no-anonymous-default-export
export default async function (req: NextApiRequest, res: NextApiResponse) {
  const { title } = req.body;

  const task = await prismaClient.task.create({
    data: {
      title,
      isDone: false,
    },
  });

  return res.status(201).json(task);
}
