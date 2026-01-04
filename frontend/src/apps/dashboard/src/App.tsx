import React, { useEffect, useState } from 'react';
import { LessonSection, DatePicker } from 'shared/components';
import { useUserStore } from 'shared/store';
import { Lesson } from 'shared/entity';

export const DashboardApp: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Date filtering state
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  // User logout
  const logout = useUserStore((state) => state.logout);
  const handleLogout = () => {
    logout();
    localStorage.removeItem('theme');
    window.location.reload();
  };

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8000/lessons');
        if (!response.ok) {
          throw new Error('Failed to fetch lessons');
        }
        const data = await response.json();
        setLessons(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch lessons');
        setLessons([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLessons();
    
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initialTheme = prefersDark ? 'dark' : 'light';
      setTheme(initialTheme);
      applyTheme(initialTheme);
    }
  }, []);

  const applyTheme = (newTheme: 'light' | 'dark') => {
    const htmlElement = document.documentElement;
    if (newTheme === 'dark') {
      htmlElement.classList.add('dark');
    } else {
      htmlElement.classList.remove('dark');
    }
    localStorage.setItem('theme', newTheme);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  // Function to filter lessons
  const getFilteredLessons = () => {
    if (!startDate || !endDate) return lessons;
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    return lessons.filter((lesson) => {
      const lessonTime = new Date(lesson.date).getTime();
      return lessonTime >= start && lessonTime <= end;
    });
  };

  const filteredLessons = getFilteredLessons();

  // Group lessons by month
  const groupLessonsByMonth = (lessonsToGroup: Lesson[]) => {
    const groups: { [key: string]: Lesson[] } = {};
    lessonsToGroup.forEach((lesson) => {
      const date = new Date(lesson.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!groups[monthKey]) {
        groups[monthKey] = [];
      }
      groups[monthKey].push(lesson);
    });
    return groups;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-slate-950 transition-colors">
        <p className="text-xl text-gray-600 dark:text-gray-400">Loading lessons...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-slate-950 transition-colors">
        <p className="text-xl text-red-600 dark:text-red-400">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-gray-900 dark:text-white transition-colors py-6 md:py-10 px-4 md:px-6 relative">
      <div className="absolute top-4 right-4 flex gap-2">
        
        <button
          onClick={handleLogout}
          className="px-3 py-2 rounded-md text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition-colors"
          aria-label="Logout"
        >
          Logout
        </button>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Tutor</p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2">Tutor Dashboard</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</p>
        </div>

        <div className="mb-8 p-6 bg-gray-100 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Filter Lessons by Date Range</h3>
          
          <DatePicker
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
          />

          <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">Total {filteredLessons.length} lessons</p>
        </div>

        {filteredLessons.length > 0 ? (
          Object.entries(groupLessonsByMonth(filteredLessons))
            .sort()
            .map(([monthKey, monthLessons]) => {
              const [year, month] = monthKey.split('-');
              const monthName = new Date(`${year}-${month}-01`).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
              });

              return (
                <div key={monthKey} className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{monthName}</h2>

                  {(() => {
                    const historic = monthLessons.filter((l) => l.type === 'Historic');
                    const upcoming = monthLessons.filter((l) => l.type === 'Upcoming');
                    const available = monthLessons.filter((l) => l.type === 'Available');
                    const today = monthLessons.filter((l) => l.type === 'Today');

                    return (
                      <>
                        {historic.length > 0 && (
                          <LessonSection title="Completed Lessons" lessons={historic} />
                        )}
                        {upcoming.length > 0 && (
                          <LessonSection title="Upcoming Lessons" lessons={upcoming} />
                        )}
                        {available.length > 0 && (
                          <LessonSection
                            title="Available Lessons"
                            lessons={available}
                            onTake={async (lessonId) => {
                              try {
                                const response = await fetch(`http://localhost:8000/lessons/${lessonId}/take`, {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                });
                                if (!response.ok) throw new Error('Failed to take lesson');
                                const lessonsResponse = await fetch('http://localhost:8000/lessons');
                                const updatedLessons = await lessonsResponse.json();
                                setLessons(updatedLessons);
                              } catch (err) {
                                setError(err instanceof Error ? err.message : 'Failed to take lesson');
                              }
                            }}
                          />
                        )}
                        {today.length > 0 && (
                          <LessonSection title="Today's Lessons" lessons={today} />
                        )}
                      </>
                    );
                  })()}
                </div>
              );
            })
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600 dark:text-gray-400">No lessons found in the selected time range</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardApp;
