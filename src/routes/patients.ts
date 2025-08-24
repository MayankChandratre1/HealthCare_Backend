// api/src/routes/patients.ts
import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import * as patientController from '../controllers/patientController';

const router = Router();

router.use(authenticate);

router.get('/', patientController.getPatients);
router.get('/:id', patientController.getPatient);
router.post('/', patientController.createPatient);
router.put('/:id', patientController.updatePatient);
router.delete('/:id', patientController.deletePatient);

export default router;
