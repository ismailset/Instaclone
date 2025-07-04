import jwt from 'jsonwebtoken';

// Mock likes storage (in production this would be a database)
let likes = new Map();

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
    const { id: postId } = req.query;
    const userId = decoded.userId;
    const likeKey = `${userId}-${postId}`;

    // Check if already liked
    const isLiked = likes.has(likeKey);

    if (isLiked) {
      // Unlike
      likes.delete(likeKey);
      res.json({ message: 'Post unliked', liked: false });
    } else {
      // Like
      likes.set(likeKey, { userId, postId, timestamp: Date.now() });
      res.json({ message: 'Post liked', liked: true });
    }
  } catch (error) {
    console.error('Like post error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}