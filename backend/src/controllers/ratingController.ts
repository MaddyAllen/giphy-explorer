import { Request, Response, NextFunction } from 'express';
import Rating from '../models/Rating';
import { AppError } from '../middleware/error';
import { IUser } from '../models/User';

interface AuthRequest extends Request {
  user?: IUser;
}

export const createRatingController = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { gifId, rating } = req.body;
    const userId = req.user!._id;

    if (!userId) {
      throw new AppError('User not authenticated', 401);
    }

    // Check if user has already rated this GIF
    const existingRating = await Rating.findOne({ gifId, userId });
    if (existingRating) {
      // Update existing rating
      existingRating.rating = rating;
      await existingRating.save();
      await existingRating.populate('userId', 'username');
      return res.json(existingRating);
    }

    // Create new rating
    const newRating = await Rating.create({
      gifId,
      userId,
      rating
    });

    await newRating.populate('userId', 'username');
    res.status(201).json(newRating);
  } catch (error) {
    next(error);
  }
};

export const getRatingsByGifIdController = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const ratings = await Rating.find({ gifId: req.params.gifId })
      .populate('userId', 'username');
    res.json(ratings);
  } catch (error) {
    next(error);
  }
};

export const updateRatingController = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { rating } = req.body;
    const { gifId } = req.params;
    const userId = req.user!._id;

    if (!userId) {
      throw new AppError('User not authenticated', 401);
    }

    const existingRating = await Rating.findOne({ gifId, userId });
    if (!existingRating) {
      throw new AppError('Rating not found', 404);
    }

    existingRating.rating = rating;
    await existingRating.save();
    await existingRating.populate('userId', 'username');
    res.json(existingRating);
  } catch (error) {
    next(error);
  }
};

export const deleteRatingController = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { gifId } = req.params;
    const userId = req.user!._id;

    if (!userId) {
      throw new AppError('User not authenticated', 401);
    }

    const rating = await Rating.findOne({ gifId, userId });
    if (!rating) {
      throw new AppError('Rating not found', 404);
    }

    await rating.deleteOne();
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}; 