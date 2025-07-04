import { useState, useEffect } from 'react';
import axios from 'axios';
import PostCard from '../components/PostCard';
import LoadingSpinner from '../components/LoadingSpinner';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/posts');
      setPosts(response.data.posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const handlePostUpdate = (updatedPost) => {
    setPosts(posts.map(post => 
      post.id === updatedPost.id ? updatedPost : post
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={fetchPosts}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto py-8 px-4">
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-600 mb-4">
              No posts yet
            </h2>
            <p className="text-gray-500 mb-6">
              Start following people to see their posts in your feed.
            </p>
            <a 
              href="/create" 
              className="btn-primary inline-block"
            >
              Create your first post
            </a>
          </div>
        ) : (
          <div className="space-y-8">
            {posts.map((post) => (
              <PostCard 
                key={post.id} 
                post={post} 
                onPostUpdate={handlePostUpdate}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;