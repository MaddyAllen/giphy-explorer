import React, { useState } from 'react';
import { gifs } from '../services/api';

interface Gif {
  id: string;
  title: string;
  images: {
    fixed_height: {
      url: string;
    };
  };
}

const GifSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Gif[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');

    try {
      const response = await gifs.search(query);
      setResults(response.data.data);
    } catch (err) {
      setError('Error searching GIFs');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <form onSubmit={handleSearch} className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search GIFs..."
            className="flex-1 p-2 border rounded"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.map((gif) => (
          <div key={gif.id} className="border rounded p-2">
            <img
              src={gif.images.fixed_height.url}
              alt={gif.title}
              className="w-full h-auto"
            />
            <p className="mt-2 text-sm">{gif.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GifSearch; 