import bcrypt from 'bcryptjs';
import { runQuery, initializeDatabase } from './database/db.js';

async function seedDemoData() {
  try {
    console.log('🌱 Seeding demo data...');
    
    // Initialize database
    await initializeDatabase();
    
    // Hash password for demo users
    const hashedPassword = await bcrypt.hash('demo123', 10);
    
    // Create demo users
    const users = [
      {
        username: 'john_doe',
        email: 'john@demo.com',
        password: hashedPassword,
        full_name: 'John Doe',
        bio: 'Photographer & Travel Enthusiast 📸✈️'
      },
      {
        username: 'jane_smith',
        email: 'jane@demo.com',
        password: hashedPassword,
        full_name: 'Jane Smith',
        bio: 'Food lover & Chef 🍴👩‍🍳'
      },
      {
        username: 'mike_wilson',
        email: 'mike@demo.com',
        password: hashedPassword,
        full_name: 'Mike Wilson',
        bio: 'Tech enthusiast & Developer 💻🚀'
      }
    ];
    
    const userIds = [];
    
    for (const user of users) {
      try {
        const result = await runQuery(
          'INSERT INTO users (username, email, password, full_name, bio) VALUES (?, ?, ?, ?, ?)',
          [user.username, user.email, user.password, user.full_name, user.bio]
        );
        userIds.push(result.id);
        console.log(`✅ Created user: ${user.username}`);
      } catch (error) {
        if (error.message.includes('UNIQUE constraint failed')) {
          console.log(`⚠️ User ${user.username} already exists, skipping...`);
        } else {
          console.error(`❌ Error creating user ${user.username}:`, error.message);
        }
      }
    }
    
    // Create some demo posts (using placeholder image URLs)
    const posts = [
      {
        user_id: userIds[0] || 1,
        image_url: '/uploads/demo-post-1.jpg',
        caption: 'Beautiful sunset from my latest trip! 🌅 #travel #photography'
      },
      {
        user_id: userIds[1] || 2,
        image_url: '/uploads/demo-post-2.jpg',
        caption: 'Made this delicious pasta today! Recipe in my bio 🍝 #food #cooking'
      },
      {
        user_id: userIds[2] || 3,
        image_url: '/uploads/demo-post-3.jpg',
        caption: 'Working on a new project. Excited to share soon! 💻 #tech #coding'
      }
    ];
    
    for (const post of posts) {
      try {
        const result = await runQuery(
          'INSERT INTO posts (user_id, image_url, caption) VALUES (?, ?, ?)',
          [post.user_id, post.image_url, post.caption]
        );
        console.log(`✅ Created post: ${post.caption.substring(0, 30)}...`);
      } catch (error) {
        console.error(`❌ Error creating post:`, error.message);
      }
    }
    
    // Create some follows
    if (userIds.length >= 3) {
      const follows = [
        { follower_id: userIds[0], following_id: userIds[1] },
        { follower_id: userIds[0], following_id: userIds[2] },
        { follower_id: userIds[1], following_id: userIds[0] }
      ];
      
      for (const follow of follows) {
        try {
          await runQuery(
            'INSERT INTO follows (follower_id, following_id) VALUES (?, ?)',
            [follow.follower_id, follow.following_id]
          );
          console.log(`✅ Created follow relationship`);
        } catch (error) {
          console.error(`❌ Error creating follow:`, error.message);
        }
      }
    }
    
    console.log('🎉 Demo data seeded successfully!');
    console.log('\n📋 Demo Users:');
    console.log('Username: john_doe, Password: demo123');
    console.log('Username: jane_smith, Password: demo123');
    console.log('Username: mike_wilson, Password: demo123');
    console.log('\n🚀 You can now start the application and login with any of these users!');
    
  } catch (error) {
    console.error('❌ Error seeding demo data:', error);
  }
  
  process.exit(0);
}

// Run the seeding
seedDemoData();