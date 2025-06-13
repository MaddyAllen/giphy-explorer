import { Router } from 'express';
import { auth } from '../middleware/auth';
import { validate, schemas } from '../middleware/validation';
import {
  createRatingController,
  getRatingsByGifIdController,
  updateRatingController,
  deleteRatingController
} from '../controllers/ratingController';

const router = Router();

// Create or update rating
router.post('/', auth, validate(schemas.rating), createRatingController);

// Get ratings for a GIF
router.get('/:gifId', getRatingsByGifIdController);

// Update rating
router.put('/:gifId', auth, validate(schemas.rating), updateRatingController);

// Delete rating
router.delete('/:gifId', auth, deleteRatingController);

export default router; 