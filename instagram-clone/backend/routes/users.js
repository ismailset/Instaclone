import express from 'express';
import { runQuery, getAll, getOne } from '../database/db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get user profile
router.get('/:username', authenticateToken, async (req, res) => {
  try {
    const user = await getOne(`
      SELECT id, username, email, full_name, bio, profile_picture, created_at,
             (SELECT COUNT(*) FROM posts WHERE user_id = users.id) as posts_count,
             (SELECT COUNT(*) FROM follows WHERE following_id = users.id) as followers_count,
             (SELECT COUNT(*) FROM follows WHERE follower_id = users.id) as following_count,
             (SELECT COUNT(*) FROM follows WHERE follower_id = ? AND following_id = users.id) as is_following
      FROM users 
      WHERE username = ?
    `, [req.user.id, req.params.username]);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get user's posts
    const posts = await getAll(`
      SELECT p.*, 
             (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as likes_count,
             (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comments_count
      FROM posts p 
      WHERE p.user_id = ? 
      ORDER BY p.created_at DESC
    `, [user.id]);

    res.json({ user, posts });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Follow/Unfollow user
router.post('/:username/follow', authenticateToken, async (req, res) => {
  try {
    const targetUser = await getOne('SELECT id FROM users WHERE username = ?', [req.params.username]);
    
    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (targetUser.id === req.user.id) {
      return res.status(400).json({ message: 'You cannot follow yourself' });
    }

    // Check if already following
    const existingFollow = await getOne(
      'SELECT id FROM follows WHERE follower_id = ? AND following_id = ?',
      [req.user.id, targetUser.id]
    );

    if (existingFollow) {
      // Unfollow
      await runQuery(
        'DELETE FROM follows WHERE follower_id = ? AND following_id = ?',
        [req.user.id, targetUser.id]
      );
      res.json({ message: 'User unfollowed', following: false });
    } else {
      // Follow
      await runQuery(
        'INSERT INTO follows (follower_id, following_id) VALUES (?, ?)',
        [req.user.id, targetUser.id]
      );
      res.json({ message: 'User followed', following: true });
    }
  } catch (error) {
    console.error('Follow user error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get user's followers
router.get('/:username/followers', authenticateToken, async (req, res) => {
  try {
    const user = await getOne('SELECT id FROM users WHERE username = ?', [req.params.username]);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const followers = await getAll(`
      SELECT u.id, u.username, u.full_name, u.profile_picture,
             (SELECT COUNT(*) FROM follows WHERE follower_id = ? AND following_id = u.id) as is_following
      FROM users u
      JOIN follows f ON u.id = f.follower_id
      WHERE f.following_id = ?
      ORDER BY f.created_at DESC
    `, [req.user.id, user.id]);

    res.json({ followers });
  } catch (error) {
    console.error('Get followers error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get user's following
router.get('/:username/following', authenticateToken, async (req, res) => {
  try {
    const user = await getOne('SELECT id FROM users WHERE username = ?', [req.params.username]);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const following = await getAll(`
      SELECT u.id, u.username, u.full_name, u.profile_picture,
             (SELECT COUNT(*) FROM follows WHERE follower_id = ? AND following_id = u.id) as is_following
      FROM users u
      JOIN follows f ON u.id = f.following_id
      WHERE f.follower_id = ?
      ORDER BY f.created_at DESC
    `, [req.user.id, user.id]);

    res.json({ following });
  } catch (error) {
    console.error('Get following error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Search users
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.trim() === '') {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const users = await getAll(`
      SELECT id, username, full_name, profile_picture,
             (SELECT COUNT(*) FROM follows WHERE follower_id = ? AND following_id = users.id) as is_following
      FROM users 
      WHERE username LIKE ? OR full_name LIKE ?
      LIMIT 20
    `, [req.user.id, `%${q}%`, `%${q}%`]);

    res.json({ users });
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { fullName, bio } = req.body;

    await runQuery(
      'UPDATE users SET full_name = ?, bio = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [fullName || '', bio || '', req.user.id]
    );

    // Get updated user
    const updatedUser = await getOne(
      'SELECT id, username, email, full_name, bio, profile_picture, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    res.json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;