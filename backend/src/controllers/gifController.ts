import { Request, Response, NextFunction } from 'express';
import { searchGifs, getGifById } from '../services/giphy';
import { AppError } from '../middleware/error';

export const searchGifsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { q, limit = 20, offset = 0 } = req.query;
    
    if (!q) {
      throw new AppError('Search query is required', 400);
    }

    const data = await searchGifs(q as string, Number(limit), Number(offset));
    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const getGifByIdController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const data = await getGifById(id);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const getTrendingGifsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { limit = 20, offset = 0 } = req.query;
    const data = await searchGifs('trending', Number(limit), Number(offset));
    res.json(data);
  } catch (error) {
    next(error);
  }
}; 