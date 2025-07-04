import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Demo users with pre-hashed passwords (demo123)
let users = [
  {
    id: 1,
    username: 'john_doe',
    email: 'john@demo.com',
    password: '$2a$10$K7H8qQBl7LH.rZ9Y8mCqFO8J9r6HGzRt8Qf5xO3dZ6Wh1nP9Vj8.S', // demo123
    full_name: 'John Doe',
    bio: 'Photographer & Travel Enthusiast 📸✈️'
  },
  {
    id: 2,
    username: 'jane_smith',
    email: 'jane@demo.com',
    password: '$2a$10$K7H8qQBl7LH.rZ9Y8mCqFO8J9r6HGzRt8Qf5xO3dZ6Wh1nP9Vj8.S', // demo123
    full_name: 'Jane Smith',
    bio: 'Food lover & Chef 🍴👩‍🍳'
  },
  {
    id: 3,
    username: 'mike_wilson',
    email: 'mike@demo.com',
    password: '$2a$10$K7H8qQBl7LH.rZ9Y8mCqFO8J9r6HGzRt8Qf5xO3dZ6Wh1nP9Vj8.S', // demo123
    full_name: 'Mike Wilson',
    bio: 'Tech enthusiast & Developer 💻🚀'
  }
];

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

  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    // Find user by username or email
    const user = users.find(u => u.username === username || u.email === username);

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // For demo purposes, accept "demo123" password for all users
    if (password !== 'demo123') {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'your-secret-key', {
      expiresIn: '7d'
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      message: 'Login successful',
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}