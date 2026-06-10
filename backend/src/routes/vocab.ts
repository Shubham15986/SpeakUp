import { Router } from 'express';
import { getVocabularyGaps } from '../controllers/vocab';

const router = Router();

router.get('/gaps', getVocabularyGaps);

export default router;
