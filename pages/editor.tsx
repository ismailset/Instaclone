import React from 'react';
import Head from 'next/head';
import LessonEditor from '../components/LessonEditor';

export default function Editor() {
  return (
    <>
      <Head>
        <title>Lesson Editor - TypingTutor</title>
        <meta name="description" content="Create and manage your typing lessons" />
      </Head>

      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Lesson Editor
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Create custom typing lessons or import text from files
          </p>
        </div>

        <LessonEditor />
      </div>
    </>
  );
}