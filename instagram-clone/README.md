# Instagram Clone

A modern, full-stack Instagram clone built with React, Node.js, Express, and SQLite. Features a beautiful, responsive UI that closely mimics Instagram's design and functionality.

## 🚀 Features

### Frontend
- 📱 **Responsive Design** - Beautiful, Instagram-like UI that works on all devices
- 🔐 **Authentication** - Secure user registration and login
- 📸 **Photo Sharing** - Upload and share photos with captions
- ❤️ **Interactions** - Like and comment on posts
- 👥 **Social Features** - Follow/unfollow users, view profiles
- 🏠 **Feed** - View posts from all users in chronological order
- 🔍 **Search** - Find users by username or full name
- 🎨 **Modern UI** - Clean, modern interface with smooth animations

### Backend
- 🛡️ **Secure API** - JWT authentication, rate limiting, input validation
- 📊 **Database** - SQLite database with proper relationships
- 📁 **File Upload** - Image upload with size and type validation
- 🔄 **RESTful API** - Well-structured API endpoints
- ⚡ **Performance** - Optimized queries and caching

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **Heroicons** - Beautiful icon library
- **date-fns** - Date utility library

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **SQLite** - Lightweight database
- **JWT** - JSON Web Tokens for authentication
- **Multer** - File upload middleware
- **bcryptjs** - Password hashing
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### 1. Clone the repository
\`\`\`bash
git clone <repository-url>
cd instagram-clone
\`\`\`

### 2. Install Backend Dependencies
\`\`\`bash
cd backend
npm install
\`\`\`

### 3. Install Frontend Dependencies
\`\`\`bash
cd ../frontend
npm install
\`\`\`

### 4. Environment Setup

#### Backend (.env)
Create a \`.env\` file in the backend directory:
\`\`\`env
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
\`\`\`

#### Frontend (.env)
Create a \`.env\` file in the frontend directory:
\`\`\`env
VITE_API_URL=http://localhost:5000/api
\`\`\`

### 5. Start the Application

#### Start Backend Server
\`\`\`bash
cd backend
npm run dev
\`\`\`
The backend will run on http://localhost:5000

#### Start Frontend Development Server
\`\`\`bash
cd frontend
npm run dev
\`\`\`
The frontend will run on http://localhost:5173

## 📁 Project Structure

\`\`\`
instagram-clone/
├── backend/
│   ├── database/
│   │   └── db.js              # Database setup and utilities
│   ├── middleware/
│   │   └── auth.js            # JWT authentication middleware
│   ├── routes/
│   │   ├── auth.js            # Authentication routes
│   │   ├── posts.js           # Post-related routes
│   │   └── users.js           # User-related routes
│   ├── uploads/               # Uploaded images storage
│   ├── .env                   # Environment variables
│   ├── package.json
│   └── server.js              # Main server file
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── PostCard.jsx
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── CreatePost.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── Register.jsx
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env                   # Environment variables
│   ├── package.json
│   ├── tailwind.config.js     # Tailwind configuration
│   └── vite.config.js         # Vite configuration
│
└── README.md
\`\`\`

## 🔌 API Endpoints

### Authentication
- \`POST /api/auth/register\` - Register new user
- \`POST /api/auth/login\` - Login user

### Posts
- \`GET /api/posts\` - Get all posts (feed)
- \`POST /api/posts\` - Create new post
- \`GET /api/posts/:id\` - Get single post
- \`POST /api/posts/:id/like\` - Like/unlike post
- \`POST /api/posts/:id/comments\` - Add comment
- \`GET /api/posts/:id/comments\` - Get post comments

### Users
- \`GET /api/users/:username\` - Get user profile
- \`POST /api/users/:username/follow\` - Follow/unfollow user
- \`GET /api/users/:username/followers\` - Get user followers
- \`GET /api/users/:username/following\` - Get user following
- \`GET /api/users\` - Search users
- \`PUT /api/users/profile\` - Update profile

## 🎯 Usage

1. **Register/Login** - Create an account or login with existing credentials
2. **Create Posts** - Click the + icon to upload and share photos
3. **Interact** - Like and comment on posts
4. **Follow Users** - Visit profiles and follow other users
5. **Explore** - Browse the feed to see posts from all users

## 🚦 Features in Development

- [ ] Stories functionality
- [ ] Direct messaging
- [ ] Real-time notifications
- [ ] Image filters
- [ ] Video posts
- [ ] Profile picture upload
- [ ] Dark mode
- [ ] Mobile app (React Native)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit your changes (\`git commit -m 'Add amazing feature'\`)
4. Push to the branch (\`git push origin feature/amazing-feature\`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Instagram for design inspiration
- The React and Node.js communities
- All contributors and testers

## 📞 Support

If you have any questions or run into issues, please open an issue on GitHub or contact the development team.

---

**Built with ❤️ using modern web technologies**