import jwt from 'jsonwebtoken';

// Mock follows storage
let follows = new Set();

function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
  } catch (error) {
    return null;
  }
}

// Demo users lookup
const users = {
  john_doe: { id: 1, username: 'john_doe' },
  jane_smith: { id: 2, username: 'jane_smith' },
  mike_wilson: { id: 3, username: 'mike_wilson' }
};

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
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

  try {
    const { username } = req.query;
    
    // Find target user
    const targetUser = users[username];
    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (targetUser.id === decoded.userId) {
      return res.status(400).json({ message: 'You cannot follow yourself' });
    }

    const followKey = `${decoded.userId}-${targetUser.id}`;
    const isFollowing = follows.has(followKey);

    if (isFollowing) {
      // Unfollow
      follows.delete(followKey);
      res.json({ message: 'User unfollowed', following: false });
    } else {
      // Follow
      follows.add(followKey);
      res.json({ message: 'User followed', following: true });
    }
  } catch (error) {
    console.error('Follow user error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}