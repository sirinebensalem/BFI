import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import prisma from '../../../lib/prisma'; // Assuming you are using Prisma for database operations

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { id, hashedPassword, oldPassword, newPassword } = req.body;

      const passwordMatch = await bcrypt.compare(oldPassword, hashedPassword);

      if (passwordMatch) {
        const newPasswordHash = await bcrypt.hash(newPassword, 10); // Hash new password

        // Update the user's password in the database using Prisma
        await prisma.user.update({
          where: {
            id: id,
          },
          data: {
            hashedPassword: newPasswordHash,
          },
        });

        res.status(200).json({ message: 'Password updated successfully' });
      } else {
        res.status(401).json({ error: 'Old password does not match' });
      }
    } catch (error) {
      console.error('Error updating password:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
