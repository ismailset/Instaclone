# TypingTutor - Modern Web-Based Typing Practice App

A modern, fully responsive typing tutor app built with Next.js, React, and Tailwind CSS. Practice your typing skills with real-time feedback, track your progress, and create custom lessons.

## ✨ Features

- **🎯 Typing Practice Area**: Real-time highlighting with green/red error indicators
- **⌨️ Virtual Keyboard**: On-screen keyboard that highlights pressed keys
- **📊 Live Statistics**: Real-time WPM, accuracy, and elapsed time tracking
- **📝 Lesson Editor**: Create, edit, and import custom typing lessons
- **📈 Progress Dashboard**: Charts showing improvement over time using Recharts
- **💾 Data Persistence**: Save progress to localStorage (ready for Supabase upgrade)
- **📱 Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **🌙 Dark/Light Mode**: Toggle between themes
- **🔥 Modern UI**: Clean design with rounded cards, typography, and soft shadows

## 🚀 Quick Start

### Prerequisites

- Node.js 16.x or later
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd typing-tutor-app
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
/typing-tutor-app
├── /components
│   ├── TypingArea.tsx          # Main typing practice component
│   ├── VirtualKeyboard.tsx     # On-screen keyboard
│   ├── StatsPanel.tsx          # Real-time statistics display
│   ├── LessonEditor.tsx        # Lesson management interface
│   ├── Navbar.tsx              # Navigation bar
│   └── ThemeToggle.tsx         # Dark/light mode toggle
├── /pages
│   ├── _app.tsx                # Next.js app wrapper
│   ├── index.tsx               # Home - main typing practice
│   ├── dashboard.tsx           # Progress tracking and charts
│   └── editor.tsx              # Lesson editor page
├── /styles
│   └── globals.css             # Tailwind CSS and custom styles
├── /lib
│   └── storage.ts              # LocalStorage utilities
├── /context
│   └── TypingContext.tsx       # Global state management
├── tailwind.config.js
├── next.config.js
├── package.json
└── README.md
```

## 🎮 How to Use

### Getting Started
1. Visit the homepage to start typing practice
2. Select a lesson from the dropdown or use the default lesson
3. Click "Start" to begin typing
4. Type the displayed text - correct characters appear in green, errors in red
5. View your real-time WPM, accuracy, and elapsed time

### Creating Custom Lessons
1. Go to the "Editor" page
2. Click "New Lesson" to create a custom lesson
3. Fill in the title, category, difficulty, and content
4. Optionally import text from a .txt or .md file
5. Save your lesson and practice with it

### Tracking Progress
1. Visit the "Dashboard" page to view your progress
2. See charts showing WPM and accuracy improvement over time
3. View personal records and session statistics
4. See which lessons you've practiced most

## 🛠️ Technologies Used

- **Frontend Framework**: Next.js 14
- **UI Library**: React 18
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Charts**: Recharts
- **Language**: TypeScript
- **Data Storage**: localStorage (ready for Supabase)

## 🌐 Deployment

This app is ready for deployment on Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy with default settings

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

## 🎨 Customization

### Adding New Themes
Edit the `tailwind.config.js` file to add new color schemes or modify the existing dark/light themes.

### Custom Keyboard Layouts
Modify the `KEYBOARD_LAYOUT` constant in `components/VirtualKeyboard.tsx` to support different keyboard layouts.

### Additional Chart Types
Add new chart components in the dashboard by importing additional chart types from Recharts.

## 📊 Features in Detail

### Typing Practice
- Real-time character highlighting
- Automatic WPM calculation
- Accuracy tracking
- Progress bars
- Lesson completion detection

### Virtual Keyboard
- Visual feedback for pressed keys
- Support for all standard keys
- Responsive design
- Can be toggled on/off

### Statistics Dashboard
- Line charts for WPM and accuracy trends
- Pie chart for lesson distribution
- Summary cards with key metrics
- Personal records tracking

### Lesson Management
- Create custom lessons
- Import from text files
- Edit existing lessons
- Delete lessons
- Categorize by difficulty

## 🔮 Future Enhancements

- [ ] Supabase integration for cloud storage
- [ ] User authentication and profiles
- [ ] Multiplayer typing races
- [ ] Additional keyboard layouts
- [ ] Sound effects and animations
- [ ] Typing games and challenges
- [ ] Export progress reports
- [ ] More detailed analytics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by typing tutor apps like RapidTyping
- Built with modern web technologies
- Designed for accessibility and usability

---

**Happy Typing! 🎯⌨️**