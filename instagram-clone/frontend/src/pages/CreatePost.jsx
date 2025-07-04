import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PhotoIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';

const CreatePost = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('Image size must be less than 5MB');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }

      setSelectedImage(file);
      setError('');
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedImage) {
      setError('Please select an image');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('image', selectedImage);
    formData.append('caption', caption);

    try {
      const response = await axios.post('/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      navigate('/', { state: { newPost: response.data.post } });
    } catch (error) {
      console.error('Error creating post:', error);
      setError(error.response?.data?.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-lg mx-auto px-4">
        <div className="card p-6">
          <h1 className="text-2xl font-bold text-center mb-6">Create New Post</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Image Upload */}
            <div>
              {!imagePreview ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-instagram-primary transition-colors">
                  <PhotoIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <div className="text-gray-600 mb-4">
                    <p className="font-semibold">Select an image to share</p>
                    <p className="text-sm">JPG, PNG, GIF up to 5MB</p>
                  </div>
                  <label htmlFor="image-upload" className="btn-primary cursor-pointer">
                    Select from computer
                  </label>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full post-image rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 transition-opacity"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>

            {/* Caption */}
            <div>
              <label htmlFor="caption" className="block text-sm font-medium text-gray-700 mb-2">
                Caption
              </label>
              <textarea
                id="caption"
                rows={3}
                placeholder="Write a caption..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="input-field resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !selectedImage}
                className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <LoadingSpinner size="sm" /> : 'Share'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;