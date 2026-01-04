import React, { useEffect, useState, useRef } from 'react';
import { LessonSection, DatePicker, Toast, MessageBox } from 'shared/components';
import { useUserStore } from 'shared/store';
import { Lesson } from 'shared/entity';
import { Layout } from 'shared/layout';

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
  const [logoutConfirmVisible, setLogoutConfirmVisible] = useState(false);

  // Date filtering state
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  // User logout
  const logout = useUserStore((state) => state.logout);
  const handleLogout = () => {
    setLogoutConfirmVisible(true);
  };
  const confirmLogout = () => {
    setLogoutConfirmVisible(false);
    logout();
    window.location.reload();
  };
  const cancelLogout = () => {
    setLogoutConfirmVisible(false);
  };

  useEffect(() => {}, []);

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
    <Layout>
      <main className="py-6 md:py-10 px-4 md:px-6 relative">
      {/* Toast Notifications */}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
      {logoutConfirmVisible && (
        <MessageBox
          message="确定要退出吗？"
          type="warning"
          duration={0}
          persistent
          onConfirm={confirmLogout}
          onCancel={cancelLogout}
          confirmText="退出"
          cancelText="取消"
          onClose={cancelLogout}
        />
      )}
      <div className="absolute top-4 right-4 flex gap-2">
        
        <button
          onClick={handleLogout}
          className="px-3 py-2 rounded-md text-sm font-medium bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
          aria-label="Logout"
        >
          Logout
        </button>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          {(() => {
            const user = useUserStore.getState().user;
            const name = user?.name || 'Tutor';
            return (
              <p className="text-sm font-medium text-muted-foreground tracking-wide mb-2">
                Welcome back {name}
              </p>
            );
          })()}
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">Tutor Dashboard</h1>
          <p className="text-lg text-muted-foreground">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="mb-8 p-6 bg-secondary rounded-lg border border-input">
            <p className="text-secondary-foreground">Loading lessons...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="mb-8 p-6 bg-destructive rounded-lg border border-input">
            <p className="text-destructive-foreground">Error: {error}</p>
            <button
              onClick={() => {
                setError(null);
                fetchLessons();
              }}
              className="mt-2 px-4 py-2 bg-destructive text-destructive-foreground rounded hover:bg-destructive/90 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        <div className="mb-8 p-6 bg-card rounded-lg border border-border">
          <h3 className="text-lg font-semibold mb-4 text-foreground">Filter Lessons by Date Range</h3>
          
          <DatePicker
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
            className="mt-4 md:mt-5 gap-6 p-5 md:p-6 rounded-md border border-input"
          />

          <p className="text-sm text-muted-foreground mt-4">Total {filteredLessons.length} lessons</p>
        </div>

        {filteredLessons.length > 0 ? (
          Object.entries(groupLessonsByMonth(filteredLessons))
            .sort(([a], [b]) => b.localeCompare(a))
            .map(([monthKey, monthLessons]) => {
              const [year, month] = monthKey.split('-');
              const monthName = new Date(`${year}-${month}-01`).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
              });

              return (
                <div key={monthKey} className="mb-12">
                  <h2 className="text-2xl font-bold text-foreground mb-6">{monthName}</h2>

                  {(() => {
                    const monthLessonsSorted = [...monthLessons].sort(
                      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
                    );
                    const historic = monthLessonsSorted.filter((l) => l.type === 'Historic');
                    const upcoming = monthLessonsSorted.filter((l) => l.type === 'Upcoming');
                    const available = monthLessonsSorted.filter((l) => l.type === 'Available');
                    const today = monthLessonsSorted.filter((l) => l.type === 'Today');

                    return (
                      <>
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
                        {upcoming.length > 0 && (
                          <LessonSection title="Upcoming Lessons" lessons={upcoming} />
                        )}
                        {historic.length > 0 && (
                          <LessonSection title="Completed Lessons" lessons={historic} />
                        )}
                      </>
                    );
                  })()}
                </div>
              );
            })
        ) : !loading && !error ? (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">No lessons found in the selected time range</p>
          </div>
        ) : null}
      </div>
      </main>
    </Layout>
  );
};

export default DashboardApp;
