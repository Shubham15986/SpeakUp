import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getProfile = async (req: Request, res: Response): Promise<any> => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'User ID required' });

    let user = await prisma.user.findUnique({ where: { id: String(userId) } });
    if (!user) {
      user = await prisma.user.create({ data: { id: String(userId), email: `${userId}@placeholder.com` } });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error('Error fetching profile:', err);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

export const updateProfile = async (req: Request, res: Response): Promise<any> => {
  try {
    const { userId, name, goals } = req.body;
    if (!userId) return res.status(400).json({ error: 'User ID required' });

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { name, goals }
    });

    res.status(200).json(updated);
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};
