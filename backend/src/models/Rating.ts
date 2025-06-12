import mongoose from 'mongoose';

export interface IRating extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  gifId: string;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}

const ratingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  gifId: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  }
}, {
  timestamps: true
});

// Compound index to ensure one rating per user per GIF
ratingSchema.index({ userId: 1, gifId: 1 }, { unique: true });

export default mongoose.model<IRating>('Rating', ratingSchema); 