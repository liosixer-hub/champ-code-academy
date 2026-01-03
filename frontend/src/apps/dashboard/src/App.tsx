import React, { useEffect, useState } from 'react';
import type { Lesson } from 'shared/entity';
import { LessonSection } from 'shared/components';
import { useUserStore } from 'shared/store';

export const DashboardApp: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 日期过滤状态
  const [filterType, setFilterType] = useState<'month' | 'custom'>('month');
  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  // 用户登出
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

  // 过滤课程的函数
  const getFilteredLessons = () => {
    if (filterType === 'month') {
      const [year, month] = selectedMonth.split('-');
      return lessons.filter((lesson) => {
        const lessonDate = new Date(lesson.date);
        return (
          lessonDate.getFullYear() === parseInt(year) &&
          lessonDate.getMonth() === parseInt(month) - 1
        );
      });
    } else {
      if (!startDate || !endDate) return lessons;
      const start = new Date(startDate).getTime();
      const end = new Date(endDate).getTime();
      return lessons.filter((lesson) => {
        const lessonTime = new Date(lesson.date).getTime();
        return lessonTime >= start && lessonTime <= end;
      });
    }
  };

  const filteredLessons = getFilteredLessons();

  // 按月份分组课程
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
          onClick={toggleTheme}
          className="px-3 py-2 rounded-md text-sm font-medium bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? '���' : '☀️'}
        </button>
        <button
          onClick={handleLogout}
          className="px-3 py-2 rounded-md text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition-colors"
          aria-label="Logout"
        >
          登出
        </button>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Tutor</p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2">Tutor Dashboard</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">{new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long' })}</p>
        </div>

        <div className="mb-8 p-6 bg-gray-100 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">过滤课程</h3>
          
          <div className="flex gap-4 mb-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="filterType"
                value="month"
                checked={filterType === 'month'}
                onChange={(e) => setFilterType(e.target.value as 'month' | 'custom')}
                className="mr-2"
              />
              <span className="text-gray-700 dark:text-gray-300">按月份</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="filterType"
                value="custom"
                checked={filterType === 'custom'}
                onChange={(e) => setFilterType(e.target.value as 'month' | 'custom')}
                className="mr-2"
              />
              <span className="text-gray-700 dark:text-gray-300">自定义日期范围</span>
            </label>
          </div>

          {filterType === 'month' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">选择月份</label>
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
          )}

          {filterType === 'custom' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">开始日期</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">结束日期</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          )}

          <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">共 {filteredLessons.length} 节课程</p>
        </div>

        {filteredLessons.length > 0 ? (
          Object.entries(groupLessonsByMonth(filteredLessons))
            .sort()
            .map(([monthKey, monthLessons]) => {
              const [year, month] = monthKey.split('-');
              const monthName = new Date(`${year}-${month}-01`).toLocaleDateString('zh-CN', {
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
                          <LessonSection title="已完成课程" lessons={historic} />
                        )}
                        {upcoming.length > 0 && (
                          <LessonSection title="待进行课程" lessons={upcoming} />
                        )}
                        {available.length > 0 && (
                          <LessonSection
                            title="可用课程"
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
                          <LessonSection title="今天课程" lessons={today} />
                        )}
                      </>
                    );
                  })()}
                </div>
              );
            })
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600 dark:text-gray-400">所选时间范围内没有课程</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardApp;
