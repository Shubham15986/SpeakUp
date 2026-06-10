import { Router } from 'express';
import { getInsights } from '../controllers/insights';

const router = Router();

router.get('/', getInsights);

export default router;
