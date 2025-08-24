import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import * as userController from '../controllers/userController';
import { requireRole } from '../middleware/rbac';
import { Role } from '../generated/prisma';

const router = Router();

router.use(authenticate);
router.use(requireRole([Role.ADMIN]));

router.get('/', userController.getUsers);
router.get('/:id', userController.getUser);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

export default router;
