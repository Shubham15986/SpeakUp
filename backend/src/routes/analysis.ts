import { Router } from 'express';
import { generateReport } from '../controllers/analysis';

const router = Router();

router.post('/report', generateReport);

export default router;
