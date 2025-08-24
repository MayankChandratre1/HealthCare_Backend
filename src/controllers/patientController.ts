// api/src/controllers/patientController.ts
import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';
import { z } from 'zod';

const prisma = new PrismaClient();

const patientSchema = z.object({
  fullName: z.string().min(1),
  dateOfBirth: z.string().optional(),
  gender: z.string().optional(),
  mobile: z.string().optional()
});

export const getPatients = async (req: AuthRequest, res: Response) => {
  try {
    const patients = await prisma.patient.findMany({
      where: { hospitalId: req.user!.hospitalId },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ success: true, data: patients });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch patients' });
  }
};

export const getPatient = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const patient = await prisma.patient.findFirst({
      where: { 
        id,
        hospitalId: req.user!.hospitalId 
      }
    });

    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }

    res.json({ success: true, data: patient });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch patient' });
  }
};

export const createPatient = async (req: AuthRequest, res: Response) => {
  try {
    const data = patientSchema.parse(req.body);
    
    const patient = await prisma.patient.create({
      data: {
        ...data,
        hospitalId: req.user!.hospitalId,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null
      }
    });

    res.status(201).json({ success: true, data: patient });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Invalid patient data' });
  }
};

export const updatePatient = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const data = patientSchema.parse(req.body);

    const patient = await prisma.patient.updateMany({
      where: { 
        id,
        hospitalId: req.user!.hospitalId 
      },
      data: {
        ...data,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
        updatedAt: new Date()
      }
    });

    if (patient.count === 0) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }

    res.json({ success: true, message: 'Patient updated successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Invalid patient data' });
  }
};

export const deletePatient = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const patient = await prisma.patient.deleteMany({
      where: { 
        id,
        hospitalId: req.user!.hospitalId 
      }
    });

    if (patient.count === 0) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }

    res.json({ success: true, message: 'Patient deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete patient' });
  }
};
