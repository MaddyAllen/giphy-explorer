import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';
import { gifs, ratings, comments } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

interface Gif {
  id: string;
  title: string;
  images: {
    original: {
      url: string;
    };
  };
}

interface Rating {
  _id: string;
  rating: number;
  userId: {
    username: string;
  };
}

interface Comment {
  _id: string;
  content: string;
  userId: {
    username: string;
  };
  createdAt: string;
}

export default function GifDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [gif, setGif] = useState<Gif | null>(null);
  const [gifRatings, setGifRatings] = useState<Rating[]>([]);
  const [gifComments, setGifComments] = useState<Comment[]>([]);
  const [userRating, setUserRating] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [gifResponse, ratingsResponse, commentsResponse] = await Promise.all([
          gifs.getById(id!),
          ratings.getByGifId(id!),
          comments.getByGifId(id!)
        ]);

        setGif(gifResponse.data.data);
        setGifRatings(ratingsResponse.data || []);
        setGifComments(commentsResponse.data || []);

        // Find user's rating if it exists
        if (ratingsResponse.data && Array.isArray(ratingsResponse.data)) {
          const userRating = ratingsResponse.data.find(
            (r: Rating) => r.userId.username === user?.username
          );
          if (userRating) {
            setUserRating(userRating.rating);
          }
        }
      } catch (error) {
        console.error('Error loading GIF details:', error);
        setError(error instanceof Error ? error.message : 'Error loading GIF details');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, user?.username]);

  const handleRating = async (rating: number) => {
    try {
      if (userRating === rating) {
        // If clicking the same rating, remove it
        await ratings.delete(id!);
        setUserRating(0);
      } else {
        // Update or create new rating
        await ratings.create({ gifId: id!, rating });
        setUserRating(rating);
      }
      // Refresh ratings
      const response = await ratings.getByGifId(id!);
      setGifRatings(response.data || []);
    } catch (error) {
      console.error('Error submitting rating:', error);
      setError('Error submitting rating');
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await comments.create({ gifId: id!, content: newComment });
      setNewComment('');
      // Refresh comments
      const response = await comments.getByGifId(id!);
      setGifComments(response.data);
    } catch (error) {
      console.error('Error submitting comment:', error);
      setError('Error submitting comment');
    }
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!gif) return <div>GIF not found</div>;

  const averageRating = gifRatings.reduce((acc, curr) => acc + curr.rating, 0) / gifRatings.length || 0;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <img
          src={gif.images.original.url}
          alt={gif.title}
          className="w-full h-96 object-contain"
        />
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">{gif.title}</h1>

          {/* Rating Section */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-2">Rating</h2>
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleRating(star)}
                    className="text-yellow-400 hover:text-yellow-500"
                  >
                    {star <= userRating ? (
                      <StarIcon className="h-8 w-8" />
                    ) : (
                      <StarOutlineIcon className="h-8 w-8" />
                    )}
                  </button>
                ))}
              </div>
              <span className="text-gray-600">
                ({averageRating.toFixed(1)} from {gifRatings.length} ratings)
              </span>
            </div>
          </div>

          {/* Comments Section */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Comments</h2>
            <form onSubmit={handleComment} className="mb-6">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="input h-24"
                required
              />
              <button type="submit" className="btn btn-primary mt-2">
                Post Comment
              </button>
            </form>

            <div className="space-y-4">
              {gifComments.map((comment) => (
                <div key={comment._id} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-medium">{comment.userId.username}</span>
                      <p className="mt-1 text-gray-700">{comment.content}</p>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(comment.createdAt).toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 