import { Router } from 'express';
import healthController from '../controllers/health.controller';

const router = Router();

router.get('/', healthController.healthCheck);

export default router;