import jwt from 'jsonwebtoken';

// Mock posts data
const mockPosts = [
  {
    id: 1,
    user_id: 1,
    username: 'john_doe',
    full_name: 'John Doe',
    profile_picture: null,
    image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=600&fit=crop',
    caption: 'Beautiful sunset from my latest trip! 🌅 #travel #photography',
    created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    likes_count: 15,
    comments_count: 3,
    is_liked: 0
  },
  {
    id: 2,
    user_id: 2,
    username: 'jane_smith',
    full_name: 'Jane Smith',
    profile_picture: null,
    image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=600&h=600&fit=crop',
    caption: 'Made this delicious pasta today! Recipe in my bio 🍝 #food #cooking',
    created_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    likes_count: 24,
    comments_count: 7,
    is_liked: 1
  },
  {
    id: 3,
    user_id: 3,
    username: 'mike_wilson',
    full_name: 'Mike Wilson',
    profile_picture: null,
    image_url: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=600&fit=crop',
    caption: 'Working on a new project. Excited to share soon! 💻 #tech #coding',
    created_at: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
    likes_count: 31,
    comments_count: 12,
    is_liked: 0
  },
  {
    id: 4,
    user_id: 1,
    username: 'john_doe',
    full_name: 'John Doe',
    profile_picture: null,
    image_url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&h=600&fit=crop',
    caption: 'Nature always finds a way to amaze me 🌲 #nature #hiking',
    created_at: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
    likes_count: 18,
    comments_count: 5,
    is_liked: 1
  }
];

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
    // Return posts for feed
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;

      const posts = mockPosts.slice(startIndex, endIndex);
      
      res.json({ posts });
    } catch (error) {
      console.error('Get posts error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'POST') {
    // Create new post (simplified for demo)
    try {
      const newPost = {
        id: mockPosts.length + 1,
        user_id: decoded.userId,
        username: 'demo_user',
        full_name: 'Demo User',
        profile_picture: null,
        image_url: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=600&h=600&fit=crop',
        caption: req.body.caption || 'New post from demo!',
        created_at: new Date().toISOString(),
        likes_count: 0,
        comments_count: 0,
        is_liked: 0
      };

      mockPosts.unshift(newPost);

      res.status(201).json({ 
        message: 'Post created successfully', 
        post: newPost 
      });
    } catch (error) {
      console.error('Create post error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}