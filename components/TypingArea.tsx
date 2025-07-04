import React, { useEffect, useRef, useState } from 'react';
import { Play, RotateCcw, CheckCircle } from 'lucide-react';
import { useTyping } from '../context/TypingContext';

export default function TypingArea() {
  const { state, startSession, updateSession, resetSession, completeSession } = useTyping();
  const inputRef = useRef<HTMLInputElement>(null);
  const [userInput, setUserInput] = useState('');

  useEffect(() => {
    if (inputRef.current && state.session.isActive) {
      inputRef.current.focus();
    }
  }, [state.session.isActive]);

  useEffect(() => {
    // Auto-focus when component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUserInput(value);

    if (!state.session.isActive || !state.session.currentLesson) return;

    const currentChar = state.session.text[value.length - 1];
    const typedChar = value[value.length - 1];

    if (typedChar !== undefined) {
      const isCorrect = typedChar === currentChar;
      
      updateSession({
        currentIndex: value.length,
        correctChars: isCorrect 
          ? state.session.correctChars + 1 
          : state.session.correctChars,
        incorrectChars: isCorrect 
          ? state.session.incorrectChars 
          : state.session.incorrectChars + 1,
      });

      // Check if lesson is completed
      if (value.length === state.session.text.length) {
        completeSession();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Prevent certain keys from affecting the input
    if (e.key === 'Tab' || e.key === 'Escape') {
      e.preventDefault();
    }
  };

  const handleStart = () => {
    if (state.lessons.length > 0 && !state.session.currentLesson) {
      startSession(state.lessons[0]);
    } else if (state.session.currentLesson) {
      resetSession();
      setUserInput('');
      setTimeout(() => {
        startSession(state.session.currentLesson!);
      }, 100);
    }
  };

  const handleReset = () => {
    resetSession();
    setUserInput('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const renderText = () => {
    if (!state.session.text) return null;

    return state.session.text.split('').map((char, index) => {
      let className = 'text-pending';
      
      if (index < userInput.length) {
        className = userInput[index] === char ? 'text-correct' : 'text-incorrect';
      } else if (index === userInput.length && state.session.isActive) {
        className = 'text-current';
      }

      return (
        <span key={index} className={className}>
          {char === ' ' ? '\u00A0' : char}
        </span>
      );
    });
  };

  const getProgressPercentage = (): number => {
    if (!state.session.text) return 0;
    return Math.round((userInput.length / state.session.text.length) * 100);
  };

  return (
    <div className="card p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {state.session.currentLesson?.title || 'Select a lesson to start'}
        </h2>
        
        <div className="flex space-x-2">
          <button
            onClick={handleStart}
            disabled={!state.lessons.length}
            className="btn-primary flex items-center space-x-2"
          >
            <Play className="w-4 h-4" />
            <span>{state.session.isActive ? 'Restart' : 'Start'}</span>
          </button>
          
          {state.session.isActive && (
            <button
              onClick={handleReset}
              className="btn-secondary flex items-center space-x-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {state.session.isCompleted && (
        <div className="mb-6 p-4 bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            <span className="text-green-800 dark:text-green-200 font-medium">
              Lesson completed! Great job!
            </span>
          </div>
        </div>
      )}

      {state.session.text && (
        <div className="mb-6">
          <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border-2 border-gray-200 dark:border-gray-700">
            <div 
              className="typing-text text-xl leading-relaxed select-none"
              style={{ fontSize: `${state.settings.fontSize}px` }}
            >
              {renderText()}
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
              <span>Progress</span>
              <span>{getProgressPercentage()}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${getProgressPercentage()}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Hidden input for capturing keystrokes */}
      <input
        ref={inputRef}
        type="text"
        value={userInput}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        className="sr-only"
        autoComplete="off"
        spellCheck={false}
        disabled={!state.session.isActive}
      />

      {/* Instructions */}
      <div className="text-center text-gray-600 dark:text-gray-400">
        {!state.session.isActive ? (
          <p>Click &quot;Start&quot; to begin typing practice. Make sure this area is focused to capture your keystrokes.</p>
        ) : (
          <p>Type the text above. The typing area will automatically capture your keystrokes.</p>
        )}
      </div>

      {/* Lesson selection */}
      {!state.session.isActive && state.lessons.length > 0 && (
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Select a lesson:
          </label>
          <select
            value={state.session.currentLesson?.id || ''}
            onChange={(e) => {
              const selectedLesson = state.lessons.find(l => l.id === e.target.value);
              if (selectedLesson) {
                resetSession();
                setUserInput('');
              }
            }}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Choose a lesson...</option>
            {state.lessons.map((lesson) => (
              <option key={lesson.id} value={lesson.id}>
                {lesson.title} ({lesson.difficulty})
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}