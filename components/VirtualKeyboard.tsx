import React, { useEffect } from 'react';
import { useTyping } from '../context/TypingContext';

const KEYBOARD_LAYOUT = [
  ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
  ['Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
  ['CapsLock', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", 'Enter'],
  ['Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'Shift'],
  ['Ctrl', 'Alt', ' ', 'Alt', 'Ctrl'],
];

const KEY_SIZES = {
  Backspace: 'min-w-[5rem]',
  Tab: 'min-w-[4rem]',
  CapsLock: 'min-w-[5rem]',
  Enter: 'min-w-[5rem]',
  Shift: 'min-w-[4rem]',
  Ctrl: 'min-w-[3rem]',
  Alt: 'min-w-[3rem]',
  ' ': 'min-w-[12rem]', // Spacebar
};

export default function VirtualKeyboard() {
  const { state, addPressedKey, removePressedKey, clearPressedKeys } = useTyping();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key === ' ' ? ' ' : event.key.toLowerCase();
      addPressedKey(key);
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      const key = event.key === ' ' ? ' ' : event.key.toLowerCase();
      removePressedKey(key);
    };

    const handleBlur = () => {
      clearPressedKeys();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
    };
  }, [addPressedKey, removePressedKey, clearPressedKeys]);

  if (!state.settings.showKeyboard) {
    return null;
  }

  const isKeyPressed = (key: string): boolean => {
    if (key === ' ') return state.pressedKeys.has(' ');
    return state.pressedKeys.has(key.toLowerCase());
  };

  const getKeyDisplay = (key: string): string => {
    if (key === ' ') return 'Space';
    if (key.length === 1) return key.toUpperCase();
    return key;
  };

  const getKeyClass = (key: string): string => {
    const baseClass = 'key';
    const sizeClass = KEY_SIZES[key as keyof typeof KEY_SIZES] || 'min-w-[2.5rem]';
    const pressedClass = isKeyPressed(key) ? 'key-pressed' : '';
    
    return `${baseClass} ${sizeClass} ${pressedClass}`;
  };

  return (
    <div className="card p-6 mt-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Virtual Keyboard
      </h3>
      <div className="space-y-2">
        {KEYBOARD_LAYOUT.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-1">
            {row.map((key, keyIndex) => (
              <div
                key={`${rowIndex}-${keyIndex}`}
                className={getKeyClass(key)}
              >
                {getKeyDisplay(key)}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        <p>Keys will highlight as you type. Press keys to see the effect!</p>
      </div>
    </div>
  );
}