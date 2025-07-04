import React, { useMemo } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Target, Clock, Trophy } from 'lucide-react';
import { useTyping } from '../context/TypingContext';

export default function Dashboard() {
  const { state } = useTyping();

  const chartData = useMemo(() => {
    return state.stats
      .slice(-20) // Last 20 sessions
      .map((stat, index) => ({
        session: index + 1,
        wpm: stat.wpm,
        accuracy: stat.accuracy,
        date: new Date(stat.date).toLocaleDateString(),
      }));
  }, [state.stats]);

  const lessonStats = useMemo(() => {
    const lessonCounts = state.stats.reduce((acc, stat) => {
      acc[stat.lessonTitle] = (acc[stat.lessonTitle] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(lessonCounts).map(([title, count]) => ({
      name: title,
      value: count,
    }));
  }, [state.stats]);

  const averageStats = useMemo(() => {
    if (state.stats.length === 0) {
      return { avgWPM: 0, avgAccuracy: 0, totalTime: 0, sessionsCount: 0 };
    }

    const totalWPM = state.stats.reduce((sum, stat) => sum + stat.wpm, 0);
    const totalAccuracy = state.stats.reduce((sum, stat) => sum + stat.accuracy, 0);
    const totalTime = state.stats.reduce((sum, stat) => sum + stat.duration, 0);

    return {
      avgWPM: Math.round(totalWPM / state.stats.length),
      avgAccuracy: Math.round(totalAccuracy / state.stats.length),
      totalTime: Math.round(totalTime / 60), // Convert to minutes
      sessionsCount: state.stats.length,
    };
  }, [state.stats]);

  const recentBest = useMemo(() => {
    if (state.stats.length === 0) return { bestWPM: 0, bestAccuracy: 0 };
    
    const bestWPM = Math.max(...state.stats.map(s => s.wpm));
    const bestAccuracy = Math.max(...state.stats.map(s => s.accuracy));
    
    return { bestWPM, bestAccuracy };
  }, [state.stats]);

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#F97316'];

  return (
    <>
      <Head>
        <title>Dashboard - TypingTutor</title>
        <meta name="description" content="Track your typing progress and view detailed statistics" />
      </Head>

      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Progress Dashboard
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Track your typing improvement over time
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Average WPM</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {averageStats.avgWPM}
                </p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                <Target className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Average Accuracy</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {averageStats.avgAccuracy}%
                </p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Time</p>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {averageStats.totalTime}m
                </p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
                <Trophy className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Sessions</p>
                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {averageStats.sessionsCount}
                </p>
              </div>
            </div>
          </div>
        </div>

        {state.stats.length === 0 ? (
          <div className="card p-12 text-center">
            <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No typing data yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Complete some typing sessions to see your progress here!
            </p>
            <Link
              href="/"
              className="btn-primary inline-flex items-center space-x-2"
            >
              <span>Start Practicing</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* WPM Progress Chart */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                WPM Progress (Last 20 sessions)
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="session" />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'var(--tooltip-bg)',
                      border: '1px solid var(--tooltip-border)',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="wpm" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    name="WPM"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Accuracy Progress Chart */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Accuracy Progress (Last 20 sessions)
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="session" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'var(--tooltip-bg)',
                      border: '1px solid var(--tooltip-border)',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="accuracy" 
                    stroke="#10B981" 
                    strokeWidth={2}
                    name="Accuracy %"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Recent Performance */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Personal Records
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Best WPM:</span>
                  <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                    {recentBest.bestWPM}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Best Accuracy:</span>
                  <span className="text-xl font-bold text-green-600 dark:text-green-400">
                    {recentBest.bestAccuracy}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Total Sessions:</span>
                  <span className="text-xl font-bold text-purple-600 dark:text-purple-400">
                    {state.stats.length}
                  </span>
                </div>
              </div>
            </div>

            {/* Lesson Distribution */}
            {lessonStats.length > 0 && (
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Lessons Practiced
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={lessonStats}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {lessonStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}