import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma'; // Assuming you are using Prisma for database operations

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { id } = req.body;
      const user = await prisma.user.findUnique({
        where: {
          id: id,
        },
        select: {
          hashedPassword: true,
        },
      });

      if (user) {
        res.status(200).json({ hashedPassword: user.hashedPassword });
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
