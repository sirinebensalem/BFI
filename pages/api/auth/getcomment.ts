import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { taskid } = req.body; // Extract taskid from query parameters
      const comments = await prisma.comment.findMany({
        where: {
          taskId: taskid, 
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
