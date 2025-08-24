// api/src/middleware/rbac.ts
import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';

export const requireRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Insufficient permissions' });
    }

    next();
  };
};

export const requireHospitalAccess = (req: AuthRequest, res: Response, next: NextFunction) => {
  // Middleware to ensure users can only access their hospital's data
    if (!req.user) {
        return res.status(401).json({ success: false, message: 'Authentication required' });
    }
    if (req.user.hospitalId !== req.params.hospitalId) {
      return res.status(403).json({ success: false, message: 'Insufficient permissions' });
    }
    if(req.body.hospitalId && req.body.hospitalId !== req.user.hospitalId) {
      return res.status(403).json({ success: false, message: 'Insufficient permissions' });
    }
    next();
};
