import { Router } from 'express';
import * as sleepController from '../controllers/sleep.controller';
import { validate } from '../middleware/validate';
import { authMiddleware } from '../middleware/auth';
import { createSleepLogSchema, updateSleepLogSchema } from '../schemas/sleep.schema';

const router = Router();

// Todas las rutas de sleep requieren estar autenticado
router.use(authMiddleware);

router.post('/', validate(createSleepLogSchema), sleepController.createSleepLog);
router.get('/', sleepController.getSleepLogs);
router.get('/:id', sleepController.getSleepLogById);
router.put('/:id', validate(updateSleepLogSchema), sleepController.updateSleepLog);
router.delete('/:id', sleepController.deleteSleepLog);

export default router;
