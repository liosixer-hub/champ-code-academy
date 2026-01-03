// components/LessonSection.tsx
import React from 'react';
import type { Lesson } from '../entity';
import { LessonCard } from './LessonCard';

interface LessonSectionProps {
  title: string;
  lessons: Lesson[];
  onTake?: (lessonId: string) => void;
}

export const LessonSection: React.FC<LessonSectionProps> = ({
  title,
  lessons,
  onTake,
}) => {
  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
          {title}
        </h2>
        {lessons.length > 0 && (
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
            {lessons.length}
          </span>
        )}
      </div>

      {lessons.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No lessons in this section.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {lessons.map((lesson) => (
            <LessonCard key={lesson.id} lesson={lesson} onTake={onTake} />
          ))}
        </div>
      )}
    </section>
  );
};