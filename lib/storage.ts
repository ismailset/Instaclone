export interface TypingStats {
  wpm: number;
  accuracy: number;
  duration: number;
  date: string;
  lessonId: string;
  lessonTitle: string;
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  createdAt: string;
}

export interface UserSettings {
  theme: 'light' | 'dark';
  soundEnabled: boolean;
  showKeyboard: boolean;
  fontSize: number;
}

const STORAGE_KEYS = {
  STATS: 'typing-tutor-stats',
  LESSONS: 'typing-tutor-lessons',
  SETTINGS: 'typing-tutor-settings',
} as const;

// Default lessons
const DEFAULT_LESSONS: Lesson[] = [
  {
    id: '1',
    title: 'Basic Home Row',
    content: 'asdf jkl; asdf jkl; sad sad lad lad fad fad dad dad',
    difficulty: 'beginner',
    category: 'basics',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Quick Brown Fox',
    content: 'The quick brown fox jumps over the lazy dog. This sentence contains every letter of the alphabet.',
    difficulty: 'intermediate',
    category: 'phrases',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Programming Practice',
    content: 'function calculateSum(a, b) { return a + b; } const result = calculateSum(10, 20); console.log(result);',
    difficulty: 'advanced',
    category: 'programming',
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'Common Words',
    content: 'the and for are but not you all can had her was one our out day get has him his how its may new now old see two who boy did man run way too any been before find where should would',
    difficulty: 'beginner',
    category: 'words',
    createdAt: new Date().toISOString(),
  },
];

// Stats functions
export const saveTypingStats = (stats: TypingStats): void => {
  try {
    const existingStats = getTypingStats();
    const updatedStats = [...existingStats, stats];
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(updatedStats));
  } catch (error) {
    console.error('Error saving typing stats:', error);
  }
};

export const getTypingStats = (): TypingStats[] => {
  try {
    const stats = localStorage.getItem(STORAGE_KEYS.STATS);
    return stats ? JSON.parse(stats) : [];
  } catch (error) {
    console.error('Error getting typing stats:', error);
    return [];
  }
};

export const clearTypingStats = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.STATS);
  } catch (error) {
    console.error('Error clearing typing stats:', error);
  }
};

// Lessons functions
export const saveLessons = (lessons: Lesson[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.LESSONS, JSON.stringify(lessons));
  } catch (error) {
    console.error('Error saving lessons:', error);
  }
};

export const getLessons = (): Lesson[] => {
  try {
    const lessons = localStorage.getItem(STORAGE_KEYS.LESSONS);
    return lessons ? JSON.parse(lessons) : DEFAULT_LESSONS;
  } catch (error) {
    console.error('Error getting lessons:', error);
    return DEFAULT_LESSONS;
  }
};

export const addLesson = (lesson: Omit<Lesson, 'id' | 'createdAt'>): void => {
  try {
    const lessons = getLessons();
    const newLesson: Lesson = {
      ...lesson,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    const updatedLessons = [...lessons, newLesson];
    saveLessons(updatedLessons);
  } catch (error) {
    console.error('Error adding lesson:', error);
  }
};

export const updateLesson = (id: string, updates: Partial<Lesson>): void => {
  try {
    const lessons = getLessons();
    const updatedLessons = lessons.map(lesson =>
      lesson.id === id ? { ...lesson, ...updates } : lesson
    );
    saveLessons(updatedLessons);
  } catch (error) {
    console.error('Error updating lesson:', error);
  }
};

export const deleteLesson = (id: string): void => {
  try {
    const lessons = getLessons();
    const updatedLessons = lessons.filter(lesson => lesson.id !== id);
    saveLessons(updatedLessons);
  } catch (error) {
    console.error('Error deleting lesson:', error);
  }
};

// Settings functions
export const saveSettings = (settings: UserSettings): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving settings:', error);
  }
};

export const getSettings = (): UserSettings => {
  try {
    const settings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return settings ? JSON.parse(settings) : {
      theme: 'light',
      soundEnabled: true,
      showKeyboard: true,
      fontSize: 18,
    };
  } catch (error) {
    console.error('Error getting settings:', error);
    return {
      theme: 'light',
      soundEnabled: true,
      showKeyboard: true,
      fontSize: 18,
    };
  }
};