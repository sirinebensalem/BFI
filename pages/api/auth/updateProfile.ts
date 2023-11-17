import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '../../../lib/prisma'; // Assuming you are using Prisma for database operations

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id, username, email } = req.body;

  try {
    // Assuming you have a 'User' model in your Prisma schema
    const updatedUser = await prisma.user.update({
      where: { id }, // Use the user's ID to find the user to update
      data: {
        username,
        email,
      },
    });

    return res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return res.status(500).json({ error: 'An error occurred while updating user profile' });
  }
}
