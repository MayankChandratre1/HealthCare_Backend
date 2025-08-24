import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';
import { z } from 'zod';
import { hashPassword } from '../utils/auth';


const prisma = new PrismaClient();

const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['ADMIN', 'STAFF'])
});

const updateUserSchema = z.object({
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  role: z.enum(['ADMIN', 'STAFF']).optional()
});

export const getUsers = async (req: AuthRequest, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      where: { hospitalId: req.user!.hospitalId },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch users' });
  }
};

export const getUser = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findFirst({
      where: { 
        id,
        hospitalId: req.user!.hospitalId 
      },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch user' });
  }
};

export const createUser = async (req: AuthRequest, res: Response) => {
  try {
    const data = userSchema.parse(req.body);
    
    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email }
    });

    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }

    const passwordHash = await hashPassword(data.password);
    
    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        role: data.role,
        hospitalId: req.user!.hospitalId
      },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true
      }
    });

    res.status(201).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Invalid user data' });
  }
};

export const updateUser = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const data = updateUserSchema.parse(req.body);

    // Check if email already exists for other users
    if (data.email) {
      const existingUser = await prisma.user.findFirst({
        where: { 
          email: data.email,
          NOT: { id }
        }
      });

      if (existingUser) {
        return res.status(400).json({ success: false, message: 'Email already exists' });
      }
    }

    const updateData: any = {};
    if (data.email) updateData.email = data.email;
    if (data.role) updateData.role = data.role;
    if (data.password) updateData.passwordHash = await hashPassword(data.password);

    const user = await prisma.user.updateMany({
      where: { 
        id,
        hospitalId: req.user!.hospitalId 
      },
      data: updateData
    });

    if (user.count === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, message: 'User updated successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Invalid user data' });
  }
};

export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Prevent users from deleting themselves
    if (id === req.user!.id) {
      return res.status(400).json({ success: false, message: 'Cannot delete your own account' });
    }

    const user = await prisma.user.deleteMany({
      where: { 
        id,
        hospitalId: req.user!.hospitalId 
      }
    });

    if (user.count === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete user' });
  }
};
