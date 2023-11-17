import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { taskid, username, newComment } = req.body;

      // TODO: Validate input data

      const comment = await prisma.comment.create({
        data: {
          text: newComment,
          taskId: taskid,
          username: username,
          
        },
      });

      res.status(201).json({ message: 'Comment added successfully', comment });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to add comment' });
    }
  } else if (req.method === 'GET') {
    try {
      const { taskId } = req.query;

      const comments = await prisma.comment.findMany({
        where: {
          taskId: String(taskId),
        },
      });

      res.status(200).json({ comments });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to fetch comments' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
