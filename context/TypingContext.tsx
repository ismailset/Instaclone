import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Lesson, TypingStats, UserSettings, getLessons, getTypingStats, getSettings, saveSettings, saveTypingStats } from '../lib/storage';

export interface TypingSession {
  text: string;
  currentIndex: number;
  correctChars: number;
  incorrectChars: number;
  startTime: number | null;
  isActive: boolean;
  isCompleted: boolean;
  currentLesson: Lesson | null;
}

interface TypingState {
  lessons: Lesson[];
  stats: TypingStats[];
  settings: UserSettings;
  session: TypingSession;
  pressedKeys: Set<string>;
}

type TypingAction =
  | { type: 'SET_LESSONS'; payload: Lesson[] }
  | { type: 'SET_STATS'; payload: TypingStats[] }
  | { type: 'SET_SETTINGS'; payload: UserSettings }
  | { type: 'START_SESSION'; payload: Lesson }
  | { type: 'UPDATE_SESSION'; payload: Partial<TypingSession> }
  | { type: 'RESET_SESSION' }
  | { type: 'COMPLETE_SESSION' }
  | { type: 'ADD_PRESSED_KEY'; payload: string }
  | { type: 'REMOVE_PRESSED_KEY'; payload: string }
  | { type: 'CLEAR_PRESSED_KEYS' };

const initialState: TypingState = {
  lessons: [],
  stats: [],
  settings: {
    theme: 'light',
    soundEnabled: true,
    showKeyboard: true,
    fontSize: 18,
  },
  session: {
    text: '',
    currentIndex: 0,
    correctChars: 0,
    incorrectChars: 0,
    startTime: null,
    isActive: false,
    isCompleted: false,
    currentLesson: null,
  },
  pressedKeys: new Set(),
};

function typingReducer(state: TypingState, action: TypingAction): TypingState {
  switch (action.type) {
    case 'SET_LESSONS':
      return { ...state, lessons: action.payload };
    case 'SET_STATS':
      return { ...state, stats: action.payload };
    case 'SET_SETTINGS':
      return { ...state, settings: action.payload };
    case 'START_SESSION':
      return {
        ...state,
        session: {
          text: action.payload.content,
          currentIndex: 0,
          correctChars: 0,
          incorrectChars: 0,
          startTime: Date.now(),
          isActive: true,
          isCompleted: false,
          currentLesson: action.payload,
        },
      };
    case 'UPDATE_SESSION':
      return {
        ...state,
        session: { ...state.session, ...action.payload },
      };
    case 'RESET_SESSION':
      return {
        ...state,
        session: {
          ...state.session,
          currentIndex: 0,
          correctChars: 0,
          incorrectChars: 0,
          startTime: null,
          isActive: false,
          isCompleted: false,
        },
      };
    case 'COMPLETE_SESSION':
      return {
        ...state,
        session: { ...state.session, isActive: false, isCompleted: true },
      };
    case 'ADD_PRESSED_KEY':
      return {
        ...state,
        pressedKeys: new Set([...state.pressedKeys, action.payload]),
      };
    case 'REMOVE_PRESSED_KEY':
      const newPressedKeys = new Set(state.pressedKeys);
      newPressedKeys.delete(action.payload);
      return { ...state, pressedKeys: newPressedKeys };
    case 'CLEAR_PRESSED_KEYS':
      return { ...state, pressedKeys: new Set() };
    default:
      return state;
  }
}

interface TypingContextType {
  state: TypingState;
  startSession: (lesson: Lesson) => void;
  updateSession: (updates: Partial<TypingSession>) => void;
  resetSession: () => void;
  completeSession: () => void;
  updateSettings: (settings: UserSettings) => void;
  addPressedKey: (key: string) => void;
  removePressedKey: (key: string) => void;
  clearPressedKeys: () => void;
  calculateWPM: () => number;
  calculateAccuracy: () => number;
  getElapsedTime: () => number;
  refreshLessons: () => void;
  refreshStats: () => void;
}

const TypingContext = createContext<TypingContextType | undefined>(undefined);

export function TypingProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(typingReducer, initialState);

  // Load initial data
  useEffect(() => {
    const lessons = getLessons();
    const stats = getTypingStats();
    const settings = getSettings();
    
    dispatch({ type: 'SET_LESSONS', payload: lessons });
    dispatch({ type: 'SET_STATS', payload: stats });
    dispatch({ type: 'SET_SETTINGS', payload: settings });

    // Apply theme
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const startSession = (lesson: Lesson) => {
    dispatch({ type: 'START_SESSION', payload: lesson });
  };

  const updateSession = (updates: Partial<TypingSession>) => {
    dispatch({ type: 'UPDATE_SESSION', payload: updates });
  };

  const resetSession = () => {
    dispatch({ type: 'RESET_SESSION' });
  };

  const completeSession = () => {
    dispatch({ type: 'COMPLETE_SESSION' });
    
    // Save stats
    if (state.session.currentLesson && state.session.startTime) {
      const wpm = calculateWPM();
      const accuracy = calculateAccuracy();
      const duration = getElapsedTime();
      
      const newStats: TypingStats = {
        wpm,
        accuracy,
        duration,
        date: new Date().toISOString(),
        lessonId: state.session.currentLesson.id,
        lessonTitle: state.session.currentLesson.title,
      };
      
      saveTypingStats(newStats);
      refreshStats();
    }
  };

  const updateSettings = (settings: UserSettings) => {
    dispatch({ type: 'SET_SETTINGS', payload: settings });
    saveSettings(settings);
    
    // Apply theme
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const addPressedKey = (key: string) => {
    dispatch({ type: 'ADD_PRESSED_KEY', payload: key });
  };

  const removePressedKey = (key: string) => {
    dispatch({ type: 'REMOVE_PRESSED_KEY', payload: key });
  };

  const clearPressedKeys = () => {
    dispatch({ type: 'CLEAR_PRESSED_KEYS' });
  };

  const calculateWPM = (): number => {
    if (!state.session.startTime || !state.session.isActive) return 0;
    
    const timeElapsed = (Date.now() - state.session.startTime) / 1000 / 60; // minutes
    const wordsTyped = state.session.correctChars / 5; // average word length
    
    return timeElapsed > 0 ? Math.round(wordsTyped / timeElapsed) : 0;
  };

  const calculateAccuracy = (): number => {
    const totalChars = state.session.correctChars + state.session.incorrectChars;
    return totalChars > 0 ? Math.round((state.session.correctChars / totalChars) * 100) : 100;
  };

  const getElapsedTime = (): number => {
    if (!state.session.startTime) return 0;
    return Math.round((Date.now() - state.session.startTime) / 1000);
  };

  const refreshLessons = () => {
    const lessons = getLessons();
    dispatch({ type: 'SET_LESSONS', payload: lessons });
  };

  const refreshStats = () => {
    const stats = getTypingStats();
    dispatch({ type: 'SET_STATS', payload: stats });
  };

  const value: TypingContextType = {
    state,
    startSession,
    updateSession,
    resetSession,
    completeSession,
    updateSettings,
    addPressedKey,
    removePressedKey,
    clearPressedKeys,
    calculateWPM,
    calculateAccuracy,
    getElapsedTime,
    refreshLessons,
    refreshStats,
  };

  return (
    <TypingContext.Provider value={value}>
      {children}
    </TypingContext.Provider>
  );
}

export function useTyping() {
  const context = useContext(TypingContext);
  if (context === undefined) {
    throw new Error('useTyping must be used within a TypingProvider');
  }
  return context;
}