import React from 'react';
import { Clock, Target, Zap } from 'lucide-react';
import { useTyping } from '../context/TypingContext';

export default function StatsPanel() {
  const { state, calculateWPM, calculateAccuracy, getElapsedTime } = useTyping();

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const stats = [
    {
      label: 'WPM',
      value: state.session.isActive ? calculateWPM() : 0,
      icon: Zap,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    },
    {
      label: 'Accuracy',
      value: `${calculateAccuracy()}%`,
      icon: Target,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
    },
    {
      label: 'Time',
      value: formatTime(getElapsedTime()),
      icon: Clock,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {stats.map(({ label, value, icon: Icon, color, bgColor }) => (
        <div
          key={label}
          className={`card p-6 flex items-center space-x-4 ${bgColor} border-none`}
        >
          <div className={`p-3 rounded-full ${bgColor}`}>
            <Icon className={`w-6 h-6 ${color}`} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {label}
            </p>
            <p className={`text-2xl font-bold ${color}`}>
              {value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}