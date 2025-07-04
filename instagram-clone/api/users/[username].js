import jwt from 'jsonwebtoken';

// Demo users data
const users = [
  {
    id: 1,
    username: 'john_doe',
    email: 'john@demo.com',
    full_name: 'John Doe',
    bio: 'Photographer & Travel Enthusiast 📸✈️',
    profile_picture: null,
    posts_count: 2,
    followers_count: 45,
    following_count: 23,
    is_following: 0
  },
  {
    id: 2,
    username: 'jane_smith',
    email: 'jane@demo.com',
    full_name: 'Jane Smith',
    bio: 'Food lover & Chef 🍴👩‍🍳',
    profile_picture: null,
    posts_count: 1,
    followers_count: 67,
    following_count: 34,
    is_following: 0
  },
  {
    id: 3,
    username: 'mike_wilson',
    email: 'mike@demo.com',
    full_name: 'Mike Wilson',
    bio: 'Tech enthusiast & Developer 💻🚀',
    profile_picture: null,
    posts_count: 1,
    followers_count: 89,
    following_count: 56,
    is_following: 0
  }
];

// Mock posts for users
const userPosts = {
  john_doe: [
    {
      id: 1,
      user_id: 1,
      image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=600&fit=crop',
      caption: 'Beautiful sunset from my latest trip! 🌅 #travel #photography',
      created_at: new Date(Date.now() - 86400000).toISOString(),
      likes_count: 15,
      comments_count: 3
    },
    {
      id: 4,
      user_id: 1,
      image_url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&h=600&fit=crop',
      caption: 'Nature always finds a way to amaze me 🌲 #nature #hiking',
      created_at: new Date(Date.now() - 345600000).toISOString(),
      likes_count: 18,
      comments_count: 5
    }
  ],
  jane_smith: [
    {
      id: 2,
      user_id: 2,
      image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=600&h=600&fit=crop',
      caption: 'Made this delicious pasta today! Recipe in my bio 🍝 #food #cooking',
      created_at: new Date(Date.now() - 172800000).toISOString(),
      likes_count: 24,
      comments_count: 7
    }
  ],
  mike_wilson: [
    {
      id: 3,
      user_id: 3,
      image_url: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=600&fit=crop',
      caption: 'Working on a new project. Excited to share soon! 💻 #tech #coding',
      created_at: new Date(Date.now() - 259200000).toISOString(),
      likes_count: 31,
      comments_count: 12
    }
  ]
};

function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
  } catch (error) {
    return null;
  }
}

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Check authentication
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(403).json({ message: 'Invalid token' });
  }

  if (req.method === 'GET') {
    try {
      const { username } = req.query;
      
      // Find user
      const user = users.find(u => u.username === username);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Get user's posts
      const posts = userPosts[username] || [];

      res.json({ user, posts });
    } catch (error) {
      console.error('Get user profile error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}