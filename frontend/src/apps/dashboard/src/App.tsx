// pages/TutorDashboard.tsx (or components/TutorDashboard.tsx)
import React, { useEffect } from 'react';
import type { Lesson } from 'shared/entity';
import { LessonSection } from 'shared/components';

interface TutorDashboardProps {
  lessons: Lesson[];
  loading: boolean;
  error: string | null;
  onFetchLessons: () => void;
  onTakeLesson: (lessonId: string) => void;
}

export const App: React.FC<TutorDashboardProps> = ({
  lessons,
  loading,
  error,
  onFetchLessons,
  onTakeLesson,
}) => {
  useEffect(() => {
    onFetchLessons();
  }, [onFetchLessons]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-gray-600">Loading lessons...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-red-600">Error: {error}</p>
      </div>
    );
  }

  // Helper to check if a lesson is today
  const todayStr = new Date().toISOString().slice(0, 10);
  const isToday = (lesson: { date: string }) => lesson.date.slice(0, 10) === todayStr;

  // Filter lessons into sections
  const historicLessons = lessons.filter((l) => l.type === 'Historic');

  const upcomingLessonsAll = lessons.filter((l) => l.type === 'Upcoming');
  const todayLessons = upcomingLessonsAll.filter(isToday);
  const futureUpcomingLessons = upcomingLessonsAll.filter((l) => !isToday(l));

  const availableLessons = lessons.filter((l) => l.type === 'Available');

  // If any 'Today' type lessons exist in the future, they would also be included
  const todayLessonsWithType = [
    ...todayLessons,
    ...lessons.filter((l) => l.type === 'Today' && isToday(l)),
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6 md:py-10 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Tutor</p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">Tutor Dashboard</h1>
          <p className="text-lg text-gray-600">{new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long' })}</p>
        </div>

        {/* Order matches the requirement bullet points */}
        <LessonSection
          title="Historic Lessons (completed)"
          lessons={historicLessons}
        />

        <LessonSection
          title="Upcoming Lessons"
          lessons={futureUpcomingLessons}
        />

        <LessonSection
          title="Available Lessons (open slots tutor can take)"
          lessons={availableLessons}
          onTake={onTakeLesson}
        />

        <LessonSection
          title="Today’s Lessons"
          lessons={todayLessonsWithType}
        />
      </div>
    </div>
  );
};