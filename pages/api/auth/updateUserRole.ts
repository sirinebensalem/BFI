import prisma from '../../../lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'PUT') {
        const { userId, newRole } = req.body;

        try {
            await prisma.user.update({
                where: { id: userId },
                data: { role: newRole },
            });
            res.status(200).json({ message: 'Role updated successfully.' });
        } catch (error) {
            console.error('Error updating user role:', error);
            res.status(500).json({ error: 'An error occurred while updating the role.' });
        }
    } else if (req.method === 'DELETE') {
        const { id } = req.query;

        try {
            await prisma.user.delete({
                where: { id: id as string },
            });
            res.status(200).json({ message: 'User deleted successfully.' });
        } catch (error) {
            console.error('Error deleting user:', error);
            res.status(500).json({ error: 'An error occurred while deleting the user.' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed.' });
    }

}
