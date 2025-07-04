import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    fullName: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Client-side validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    const result = await register(
      formData.username,
      formData.email,
      formData.password,
      formData.fullName
    );
    
    if (!result.success) {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold instagram-gradient bg-clip-text text-transparent mb-2">
            Instagram
          </h1>
          <p className="text-gray-600 text-sm">
            Sign up to see photos and videos from your friends.
          </p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="input-field"
              />
            </div>

            <div>
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            <div>
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
                className="input-field"
              />
            </div>

            <div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="input-field"
              />
            </div>

            <div>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="input-field"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <LoadingSpinner size="sm" /> : 'Sign Up'}
            </button>
          </form>

          <p className="mt-4 text-xs text-gray-500 text-center">
            By signing up, you agree to our Terms, Data Policy and Cookies Policy.
          </p>
        </div>

        <div className="card p-6 text-center">
          <p className="text-sm text-gray-600">
            Have an account?{' '}
            <Link to="/login" className="text-instagram-primary font-semibold hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;