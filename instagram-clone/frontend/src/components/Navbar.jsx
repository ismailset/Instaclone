import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  HomeIcon, 
  PlusCircleIcon, 
  UserCircleIcon,
  MagnifyingGlassIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <h1 className="text-2xl font-bold instagram-gradient bg-clip-text text-transparent">
              Instagram
            </h1>
          </Link>

          {/* Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search"
                className="w-full pl-10 pr-4 py-2 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-instagram-primary focus:bg-white"
              />
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-instagram-primary transition-colors"
            >
              <HomeIcon className="h-6 w-6" />
            </Link>
            
            <Link 
              to="/create" 
              className="text-gray-700 hover:text-instagram-primary transition-colors"
            >
              <PlusCircleIcon className="h-6 w-6" />
            </Link>
            
            <Link 
              to={`/profile/${user?.username}`}
              className="text-gray-700 hover:text-instagram-primary transition-colors"
            >
              {user?.profile_picture ? (
                <img 
                  src={user.profile_picture} 
                  alt={user.username}
                  className="h-6 w-6 rounded-full profile-image"
                />
              ) : (
                <UserCircleIcon className="h-6 w-6" />
              )}
            </Link>
            
            <button
              onClick={handleLogout}
              className="text-gray-700 hover:text-instagram-primary transition-colors"
            >
              <ArrowRightOnRectangleIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;