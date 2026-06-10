import { Router } from 'express';
import { getProfile, updateProfile } from '../controllers/profile';

const router = Router();

router.get('/', getProfile);
router.post('/update', updateProfile);

export default router;
