import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { UserCircleIcon, CogIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../contexts/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Profile = () => {
  const { username } = useParams();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [following, setFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  const isOwnProfile = currentUser?.username === username;

  useEffect(() => {
    if (username) {
      fetchProfile();
    }
  }, [username]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/users/${username}`);
      setProfile(response.data.user);
      setPosts(response.data.posts);
      setFollowing(Boolean(response.data.user.is_following));
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    if (followLoading) return;
    
    setFollowLoading(true);
    try {
      const response = await axios.post(`/users/${username}/follow`);
      setFollowing(response.data.following);
      
      // Update follower count
      setProfile(prev => ({
        ...prev,
        followers_count: following 
          ? prev.followers_count - 1 
          : prev.followers_count + 1
      }));
    } catch (error) {
      console.error('Error following user:', error);
    } finally {
      setFollowLoading(false);
    }
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
            onClick={fetchProfile}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-600 mb-4">
            User not found
          </h2>
          <p className="text-gray-500">
            The user you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Profile Header */}
        <div className="card p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
            {/* Profile Picture */}
            <div className="flex-shrink-0">
              {profile.profile_picture ? (
                <img
                  src={`${API_URL}${profile.profile_picture}`}
                  alt={profile.username}
                  className="w-32 h-32 rounded-full profile-image"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center">
                  <UserCircleIcon className="w-20 h-20 text-gray-500" />
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-4">
                <h1 className="text-2xl font-light mb-2 md:mb-0">{profile.username}</h1>
                
                {isOwnProfile ? (
                  <button className="btn-secondary inline-flex items-center space-x-2">
                    <CogIcon className="w-4 h-4" />
                    <span>Edit Profile</span>
                  </button>
                ) : (
                  <button
                    onClick={handleFollow}
                    disabled={followLoading}
                    className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                      following
                        ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        : 'bg-instagram-primary text-white hover:bg-opacity-90'
                    } disabled:opacity-50`}
                  >
                    {followLoading ? '...' : following ? 'Unfollow' : 'Follow'}
                  </button>
                )}
              </div>

              {/* Stats */}
              <div className="flex justify-center md:justify-start space-x-8 mb-4">
                <div className="text-center">
                  <span className="font-semibold text-lg">{posts.length}</span>
                  <p className="text-gray-600 text-sm">posts</p>
                </div>
                <div className="text-center">
                  <span className="font-semibold text-lg">{profile.followers_count}</span>
                  <p className="text-gray-600 text-sm">followers</p>
                </div>
                <div className="text-center">
                  <span className="font-semibold text-lg">{profile.following_count}</span>
                  <p className="text-gray-600 text-sm">following</p>
                </div>
              </div>

              {/* Bio */}
              <div>
                {profile.full_name && (
                  <p className="font-semibold mb-1">{profile.full_name}</p>
                )}
                {profile.bio && (
                  <p className="text-gray-700 whitespace-pre-line">{profile.bio}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Posts Grid */}
        <div>
          <div className="border-t border-gray-200 pt-8">
            <div className="text-center mb-8">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Posts
              </h2>
            </div>

            {posts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No posts yet</p>
                {isOwnProfile && (
                  <p className="text-gray-400 text-sm mt-2">
                    Share your first photo to get started
                  </p>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-1 md:gap-4">
                {posts.map((post) => (
                  <div
                    key={post.id}
                    className="relative aspect-square bg-gray-100 hover:opacity-80 transition-opacity cursor-pointer group"
                  >
                    <img
                      src={`${API_URL}${post.image_url}`}
                      alt={post.caption}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 text-white text-sm font-semibold flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <span>❤️</span>
                          <span>{post.likes_count}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span>💬</span>
                          <span>{post.comments_count}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;