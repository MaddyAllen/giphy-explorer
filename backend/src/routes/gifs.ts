import express from 'express';
import { auth } from '../middleware/auth';
import {
  searchGifsController,
  getGifByIdController,
  getTrendingGifsController
} from '../controllers/gifController';

const router = express.Router();

// Search GIFs
router.get('/search', searchGifsController);

// Get GIF by ID
router.get('/:id', getGifByIdController);

// Get trending GIFs
router.get('/trending', getTrendingGifsController);

export default router; 