// components/LessonCard.tsx
import React from 'react';
import type { Lesson } from '../entity';
import Button from './Button';

interface LessonCardProps {
  lesson: Lesson;
  onTake?: (lessonId: string) => void;
}

export const LessonCard: React.FC<LessonCardProps> = ({ lesson, onTake }) => {
  const date = new Date(lesson.date);

  const formattedDate = date.toLocaleDateString(undefined, {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const formattedTime = date.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  const lessonType =
    lesson.students.length > 1
      ? 'Group Lesson'
      : lesson.students.length === 1
      ? '1:1 Lesson'
      : 'Open Slot';

  const studentsDisplay =
    lesson.students.length > 0
      ? lesson.students.join(', ')
      : 'No students booked yet';

  const canTake = onTake && lesson.type === 'Available';

  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg shadow hover:shadow-lg transition-shadow p-5 border border-gray-100 dark:border-slate-700">
      {/* Header with Subject and Badge */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {lesson.subject}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{lessonType}</p>
        </div>
      </div>

      {/* Date and Time */}
      <div className="space-y-2 mb-4 text-sm text-gray-700 dark:text-gray-300">
        <p>
          <span className="font-medium text-gray-600 dark:text-gray-400">📅</span> {formattedDate}
        </p>
        <p>
          <span className="font-medium text-gray-600 dark:text-gray-400">🕐</span> {formattedTime}
        </p>
      </div>

      {/* Students */}
      <div className="mb-4 p-3 bg-gray-50 dark:bg-slate-800 rounded">
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Student(s)</p>
        <p className="text-sm text-gray-800 dark:text-gray-200">{studentsDisplay}</p>
      </div>

      {/* Button */}
      {canTake && (
        <Button
          variant="primary"
          onClick={() => onTake(lesson.id)}
          className="w-full"
        >
          Take Class
        </Button>
      )}
    </div>
  );
};