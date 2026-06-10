import { Router } from 'express';
import { extractQuestion } from '../controllers/scraper';

const router = Router();

router.post('/extract', extractQuestion);

export default router;
