import jwt from 'jsonwebtoken';

// Mock comments storage
let comments = [
  {
    id: 1,
    user_id: 2,
    post_id: 1,
    username: 'jane_smith',
    full_name: 'Jane Smith',
    profile_picture: null,
    content: 'Amazing shot! 📸',
    created_at: new Date(Date.now() - 3600000).toISOString() // 1 hour ago
  },
  {
    id: 2,
    user_id: 3,
    post_id: 1,
    username: 'mike_wilson',
    full_name: 'Mike Wilson',
    profile_picture: null,
    content: 'Where is this place?',
    created_at: new Date(Date.now() - 1800000).toISOString() // 30 minutes ago
  }
];

function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
  } catch (error) {
    return null;
  }
}

function getUsernameById(userId) {
  const userMap = {
    1: { username: 'john_doe', full_name: 'John Doe' },
    2: { username: 'jane_smith', full_name: 'Jane Smith' },
    3: { username: 'mike_wilson', full_name: 'Mike Wilson' }
  };
  return userMap[userId] || { username: 'demo_user', full_name: 'Demo User' };
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

  const { id: postId } = req.query;

  if (req.method === 'GET') {
    // Get comments for post
    try {
      const postComments = comments.filter(c => c.post_id == postId);
      res.json({ comments: postComments });
    } catch (error) {
      console.error('Get comments error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'POST') {
    // Add comment to post
    try {
      const { content } = req.body;

      if (!content || content.trim() === '') {
        return res.status(400).json({ message: 'Comment content is required' });
      }

      const userInfo = getUsernameById(decoded.userId);
      
      const newComment = {
        id: comments.length + 1,
        user_id: decoded.userId,
        post_id: parseInt(postId),
        username: userInfo.username,
        full_name: userInfo.full_name,
        profile_picture: null,
        content: content.trim(),
        created_at: new Date().toISOString()
      };

      comments.push(newComment);

      res.status(201).json({ 
        message: 'Comment added successfully', 
        comment: newComment 
      });
    } catch (error) {
      console.error('Add comment error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}