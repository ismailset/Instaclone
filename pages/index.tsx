import React from 'react';
import Head from 'next/head';
import TypingArea from '../components/TypingArea';
import StatsPanel from '../components/StatsPanel';
import VirtualKeyboard from '../components/VirtualKeyboard';

export default function Home() {
  return (
    <>
      <Head>
        <title>TypingTutor - Practice Your Typing Skills</title>
        <meta name="description" content="Improve your typing speed and accuracy with our modern typing tutor app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Master Your Typing Skills
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Practice typing with real-time feedback, track your progress, and improve your 
            speed and accuracy with our modern typing tutor.
          </p>
        </div>

        <StatsPanel />
        <TypingArea />
        <VirtualKeyboard />
      </div>
    </>
  );
}