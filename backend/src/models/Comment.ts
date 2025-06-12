import mongoose from 'mongoose';

export interface IComment extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  gifId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  gifId: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 1000
  }
}, {
  timestamps: true
});

// Index for faster queries
commentSchema.index({ gifId: 1, createdAt: -1 });

export default mongoose.model<IComment>('Comment', commentSchema); 