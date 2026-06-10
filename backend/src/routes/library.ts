import { Router } from 'express';
import { getLibrary, addCustomWord, toggleMark } from '../controllers/library';

const router = Router();

router.get('/', getLibrary);
router.post('/custom', addCustomWord);
router.patch('/:id/mark', toggleMark);

export default router;
