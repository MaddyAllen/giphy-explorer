import { Request, Response, NextFunction } from 'express';
import Comment from '../models/Comment';
import { AppError } from '../middleware/error';
import { IUser } from '../models/User';

interface AuthRequest extends Request {
  user?: IUser;
}

export const getCommentsByGifIdController = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const comments = await Comment.find({ gifId: req.params.gifId })
      .populate('userId', 'username')
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    next(error);
  }
};

export const createCommentController = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { gifId, content } = req.body;
    const userId = req.user!._id;

    if (!userId) {
      throw new AppError('User not authenticated', 401);
    }

    const comment = await Comment.create({
      gifId,
      userId,
      content,
    });

    await comment.populate('userId', 'username');
    res.status(201).json(comment);
  } catch (error) {
    next(error);
  }
};

export const updateCommentController = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { content } = req.body;
    const userId = req.user!._id;

    if (!userId) {
      throw new AppError('User not authenticated', 401);
    }

    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      throw new AppError('Comment not found', 404);
    }

    if (comment.userId.toString() !== userId.toString()) {
      throw new AppError('Not authorized to update this comment', 403);
    }

    comment.content = content;
    await comment.save();
    res.json(comment);
  } catch (error) {
    next(error);
  }
};

export const deleteCommentController = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!._id;

    if (!userId) {
      throw new AppError('User not authenticated', 401);
    }

    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      throw new AppError('Comment not found', 404);
    }

    if (comment.userId.toString() !== userId.toString()) {
      throw new AppError('Not authorized to delete this comment', 403);
    }

    await comment.deleteOne();
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}; 