import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  HeartIcon, 
  ChatBubbleOvalLeftIcon, 
  PaperAirplaneIcon,
  BookmarkIcon,
  EllipsisHorizontalIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import { formatDistanceToNow } from 'date-fns';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const PostCard = ({ post, onPostUpdate }) => {
  const [isLiked, setIsLiked] = useState(Boolean(post.is_liked));
  const [likesCount, setLikesCount] = useState(post.likes_count);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);

  const handleLike = async () => {
    try {
      const response = await axios.post(`/posts/${post.id}/like`);
      setIsLiked(response.data.liked);
      setLikesCount(prev => response.data.liked ? prev + 1 : prev - 1);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const loadComments = async () => {
    if (comments.length > 0) {
      setShowComments(!showComments);
      return;
    }

    setLoadingComments(true);
    try {
      const response = await axios.get(`/posts/${post.id}/comments`);
      setComments(response.data.comments);
      setShowComments(true);
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmittingComment(true);
    try {
      const response = await axios.post(`/posts/${post.id}/comments`, {
        content: newComment
      });
      setComments([...comments, response.data.comment]);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setSubmittingComment(false);
    }
  };

  return (
    <div className="card mb-6 max-w-lg mx-auto">
      {/* Post Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <Link to={`/profile/${post.username}`}>
            {post.profile_picture ? (
              <img 
                src={`${API_URL}${post.profile_picture}`}
                alt={post.username}
                className="w-8 h-8 rounded-full profile-image"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-gray-600 text-sm font-semibold">
                  {post.username[0].toUpperCase()}
                </span>
              </div>
            )}
          </Link>
          <div>
            <Link 
              to={`/profile/${post.username}`}
              className="font-semibold text-sm hover:underline"
            >
              {post.username}
            </Link>
            {post.full_name && (
              <p className="text-xs text-gray-500">{post.full_name}</p>
            )}
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          <EllipsisHorizontalIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Post Image */}
      <div className="relative">
        <img 
          src={`${API_URL}${post.image_url}`}
          alt={post.caption || 'Post'}
          className="w-full post-image"
        />
      </div>

      {/* Post Actions */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleLike}
              className={`transition-colors ${isLiked ? 'text-red-500' : 'text-gray-700 hover:text-gray-500'}`}
            >
              {isLiked ? (
                <HeartSolid className="h-6 w-6" />
              ) : (
                <HeartIcon className="h-6 w-6" />
              )}
            </button>
            <button 
              onClick={loadComments}
              className="text-gray-700 hover:text-gray-500 transition-colors"
            >
              <ChatBubbleOvalLeftIcon className="h-6 w-6" />
            </button>
            <button className="text-gray-700 hover:text-gray-500 transition-colors">
              <PaperAirplaneIcon className="h-6 w-6" />
            </button>
          </div>
          <button className="text-gray-700 hover:text-gray-500 transition-colors">
            <BookmarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Likes Count */}
        {likesCount > 0 && (
          <p className="font-semibold text-sm mb-2">
            {likesCount} {likesCount === 1 ? 'like' : 'likes'}
          </p>
        )}

        {/* Caption */}
        {post.caption && (
          <div className="text-sm mb-2">
            <Link 
              to={`/profile/${post.username}`}
              className="font-semibold hover:underline"
            >
              {post.username}
            </Link>{' '}
            <span>{post.caption}</span>
          </div>
        )}

        {/* Comments */}
        {post.comments_count > 0 && !showComments && (
          <button 
            onClick={loadComments}
            className="text-sm text-gray-500 hover:text-gray-700 mb-2"
          >
            View all {post.comments_count} comments
          </button>
        )}

        {loadingComments && (
          <div className="text-sm text-gray-500 mb-2">Loading comments...</div>
        )}

        {showComments && comments.length > 0 && (
          <div className="space-y-2 mb-2">
            {comments.slice(0, 3).map((comment) => (
              <div key={comment.id} className="text-sm">
                <Link 
                  to={`/profile/${comment.username}`}
                  className="font-semibold hover:underline"
                >
                  {comment.username}
                </Link>{' '}
                <span>{comment.content}</span>
              </div>
            ))}
            {comments.length > 3 && (
              <button className="text-sm text-gray-500 hover:text-gray-700">
                View more comments
              </button>
            )}
          </div>
        )}

        {/* Timestamp */}
        <p className="text-xs text-gray-500 uppercase tracking-wide mb-3">
          {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
        </p>

        {/* Add Comment */}
        <form onSubmit={handleAddComment} className="border-t pt-3">
          <div className="flex items-center space-x-3">
            <input
              type="text"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1 text-sm bg-transparent border-0 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!newComment.trim() || submittingComment}
              className="text-sm text-instagram-primary font-semibold disabled:opacity-50"
            >
              {submittingComment ? 'Posting...' : 'Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostCard;