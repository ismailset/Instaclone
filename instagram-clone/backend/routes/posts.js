import express from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { runQuery, getAll, getOne } from '../database/db.js';
import { authenticateToken } from '../middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, join(__dirname, '..', 'uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}-${Date.now()}.${file.originalname.split('.').pop()}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Create new post
router.post('/', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    const { caption } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ message: 'Image is required' });
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    
    const result = await runQuery(
      'INSERT INTO posts (user_id, image_url, caption) VALUES (?, ?, ?)',
      [req.user.id, imageUrl, caption || '']
    );

    // Get the created post with user info
    const post = await getOne(`
      SELECT p.*, u.username, u.full_name, u.profile_picture,
             (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as likes_count,
             (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comments_count
      FROM posts p
      JOIN users u ON p.user_id = u.id
      WHERE p.id = ?
    `, [result.id]);

    res.status(201).json({ message: 'Post created successfully', post });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get all posts (feed)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const posts = await getAll(`
      SELECT p.*, u.username, u.full_name, u.profile_picture,
             (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as likes_count,
             (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comments_count,
             (SELECT COUNT(*) FROM likes WHERE post_id = p.id AND user_id = ?) as is_liked
      FROM posts p
      JOIN users u ON p.user_id = u.id
      ORDER BY p.created_at DESC
      LIMIT ? OFFSET ?
    `, [req.user.id, limit, offset]);

    res.json({ posts });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get single post
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const post = await getOne(`
      SELECT p.*, u.username, u.full_name, u.profile_picture,
             (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as likes_count,
             (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comments_count,
             (SELECT COUNT(*) FROM likes WHERE post_id = p.id AND user_id = ?) as is_liked
      FROM posts p
      JOIN users u ON p.user_id = u.id
      WHERE p.id = ?
    `, [req.user.id, req.params.id]);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json({ post });
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Like/Unlike post
router.post('/:id/like', authenticateToken, async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;

    // Check if post exists
    const post = await getOne('SELECT id FROM posts WHERE id = ?', [postId]);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if already liked
    const existingLike = await getOne('SELECT id FROM likes WHERE user_id = ? AND post_id = ?', [userId, postId]);

    if (existingLike) {
      // Unlike
      await runQuery('DELETE FROM likes WHERE user_id = ? AND post_id = ?', [userId, postId]);
      res.json({ message: 'Post unliked', liked: false });
    } else {
      // Like
      await runQuery('INSERT INTO likes (user_id, post_id) VALUES (?, ?)', [userId, postId]);
      res.json({ message: 'Post liked', liked: true });
    }
  } catch (error) {
    console.error('Like post error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Add comment to post
router.post('/:id/comments', authenticateToken, async (req, res) => {
  try {
    const { content } = req.body;
    const postId = req.params.id;

    if (!content || content.trim() === '') {
      return res.status(400).json({ message: 'Comment content is required' });
    }

    // Check if post exists
    const post = await getOne('SELECT id FROM posts WHERE id = ?', [postId]);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const result = await runQuery(
      'INSERT INTO comments (user_id, post_id, content) VALUES (?, ?, ?)',
      [req.user.id, postId, content.trim()]
    );

    // Get the created comment with user info
    const comment = await getOne(`
      SELECT c.*, u.username, u.full_name, u.profile_picture
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.id = ?
    `, [result.id]);

    res.status(201).json({ message: 'Comment added successfully', comment });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get comments for a post
router.get('/:id/comments', authenticateToken, async (req, res) => {
  try {
    const comments = await getAll(`
      SELECT c.*, u.username, u.full_name, u.profile_picture
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.post_id = ?
      ORDER BY c.created_at ASC
    `, [req.params.id]);

    res.json({ comments });
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;