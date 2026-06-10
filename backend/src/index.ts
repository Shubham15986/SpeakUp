import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import analysisRoutes from './routes/analysis';
import scraperRoutes from './routes/scraper';
import vocabRoutes from './routes/vocab';
import insightsRoutes from './routes/insights';
import libraryRoutes from './routes/library';
import profileRoutes from './routes/profile';

import { requireAuth } from './middleware/auth';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Protect all API routes
app.use('/api/analysis', requireAuth, analysisRoutes);
app.use('/api/scraper', requireAuth, scraperRoutes);
app.use('/api/vocab', requireAuth, vocabRoutes);
app.use('/api/insights', requireAuth, insightsRoutes);
app.use('/api/library', requireAuth, libraryRoutes);
app.use('/api/profile', requireAuth, profileRoutes);

// Health Check Endpoint

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


