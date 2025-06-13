import axios from 'axios';
import { AppError } from '../middleware/error';

const GIPHY_API_KEY = process.env.GIPHY_API_KEY;
const GIPHY_API_URL = 'https://api.giphy.com/v1/gifs';

if (!GIPHY_API_KEY) {
  throw new Error('GIPHY_API_KEY is not defined in environment variables');
}

export const searchGifs = async (query: string, limit: number = 20, offset: number = 0) => {
  try {
    const response = await axios.get(`${GIPHY_API_URL}/search`, {
      params: {
        api_key: GIPHY_API_KEY,
        q: query,
        limit,
        offset,
        rating: 'g',
        lang: 'en'
      }
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new AppError(error.response?.data?.message || 'Error fetching GIFs from GIPHY', 500);
    }
    throw error;
  }
};

export const getGifById = async (id: string) => {
  try {
    const response = await axios.get(`${GIPHY_API_URL}/${id}`, {
      params: {
        api_key: GIPHY_API_KEY
      }
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new AppError(error.response?.data?.message || 'Error fetching GIF from GIPHY', 500);
    }
    throw error;
  }
}; 