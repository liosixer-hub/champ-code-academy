import React, { useEffect, useState, useRef } from 'react';
import { LessonSection, DatePicker, Toast } from 'shared/components';
import { useUserStore } from 'shared/store';
import { Lesson } from 'shared/entity';

interface ToastMessage {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

export const DashboardApp: React.FC = () => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const toastIdRef = useRef(0);
  const lastDataHashRef = useRef<string>('');

  // Date filtering state
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  // User logout
  const logout = useUserStore((state) => state.logout);
  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  useEffect(() => {
    // 强制设置为 light 主题
    const htmlElement = document.documentElement;
    htmlElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }, []);

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    const id = toastIdRef.current++;
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const fetchLessons = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const response = await fetch('http://localhost:8000/api/lessons');
      if (!response.ok) {
        throw new Error('Failed to fetch lessons');
      }
      const data = await response.json();
      // 计算数据哈希，检测数据变化
      const dataHash = JSON.stringify(data);
      if (dataHash !== lastDataHashRef.current && lastDataHashRef.current !== '') {
        // 数据有变化，刷新显示
        showToast('Lessons data updated', 'info');
      }
      lastDataHashRef.current = dataHash;
      setLessons(data);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch lessons';
      setError(errorMessage);
      // 即使有错误，也不清空已有数据
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    // 初始加载
    fetchLessons();
    
    // 设置轮询，每30秒检查一次数据变化
    const interval = setInterval(() => {
      fetchLessons(false); // 后台刷新，不显示loading
    }, 30000);

    return () => clearInterval(interval);
  }, []);

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

  return (
    <div className="min-h-screen bg-white text-gray-900 transition-colors py-6 md:py-10 px-4 md:px-6 relative">
      {/* Toast Notifications */}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
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
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Tutor</p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">Tutor Dashboard</h1>
          <p className="text-lg text-gray-600">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="mb-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-blue-600">Loading lessons...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="mb-8 p-6 bg-red-50 rounded-lg border border-red-200">
            <p className="text-red-600">Error: {error}</p>
            <button
              onClick={() => {
                setError(null);
                fetchLessons();
              }}
              className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        <div className="mb-8 p-6 bg-gray-100 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Filter Lessons by Date Range</h3>
          
          <DatePicker
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
          />

          <p className="text-sm text-gray-600 mt-4">Total {filteredLessons.length} lessons</p>
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
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">{monthName}</h2>

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
                                setLoading(true);
                                const response = await fetch(`http://localhost:8000/api/lessons/${lessonId}/take`, {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                });
                                if (!response.ok) {
                                  const errorData = await response.json().catch(() => ({ detail: 'Failed to take lesson' }));
                                  throw new Error(errorData.detail || 'Failed to take lesson');
                                }
                                // 刷新课程列表
                                await fetchLessons(false);
                                showToast('Lesson taken successfully!', 'success');
                              } catch (err) {
                                const errorMessage = err instanceof Error ? err.message : 'Failed to take lesson';
                                setError(errorMessage);
                                showToast(errorMessage, 'error');
                              } finally {
                                setLoading(false);
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
        ) : !loading && !error ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">No lessons found in the selected time range</p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default DashboardApp;
