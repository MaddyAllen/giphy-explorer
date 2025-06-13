import express from 'express';
import { auth } from '../middleware/auth';
import {
  getCommentsByGifIdController,
  createCommentController,
  updateCommentController,
  deleteCommentController
} from '../controllers/commentController';

const router = express.Router();

// Get comments for a GIF
router.get('/gif/:gifId', getCommentsByGifIdController);

// Create a comment
router.post('/', auth, createCommentController);

// Update a comment
router.put('/:id', auth, updateCommentController);

// Delete a comment
router.delete('/:id', auth, deleteCommentController);

export default router; 