import { Router } from 'express';
import multer from 'multer';
import { generateReport, transcribeAudio } from '../controllers/analysis';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB limit

router.post('/report', upload.single('audio'), generateReport);
router.post('/transcribe', upload.single('audio'), transcribeAudio);

export default router;
