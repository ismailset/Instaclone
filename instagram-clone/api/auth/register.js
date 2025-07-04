import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// In production, this would be a real database
let users = [
  {
    id: 1,
    username: 'john_doe',
    email: 'john@demo.com',
    password: '$2a$10$K7H8qQBl7LH.rZ9Y8mCqFO8J9r6HGzRt8Qf5xO3dZ6Wh1nP9Vj8.S',
    full_name: 'John Doe',
    bio: 'Photographer & Travel Enthusiast 📸✈️'
  },
  {
    id: 2,
    username: 'jane_smith',
    email: 'jane@demo.com',
    password: '$2a$10$K7H8qQBl7LH.rZ9Y8mCqFO8J9r6HGzRt8Qf5xO3dZ6Wh1nP9Vj8.S',
    full_name: 'Jane Smith',
    bio: 'Food lover & Chef 🍴👩‍🍳'
  },
  {
    id: 3,
    username: 'mike_wilson',
    email: 'mike@demo.com',
    password: '$2a$10$K7H8qQBl7LH.rZ9Y8mCqFO8J9r6HGzRt8Qf5xO3dZ6Wh1nP9Vj8.S',
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
    const { username, email, password, fullName } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Username, email, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Check if user already exists
    const existingUser = users.find(u => u.username === username || u.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    // Create new user
    const newUser = {
      id: users.length + 1,
      username,
      email,
      password: await bcrypt.hash(password, 10),
      full_name: fullName || '',
      bio: ''
    };

    users.push(newUser);

    // Generate token
    const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET || 'your-secret-key', {
      expiresIn: '7d'
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}