import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App.tsx'
import { useLessonStore, useCommonStore } from 'shared/store'
import './index.css'

const AppWithStore: React.FC = () => {
  const { lessons, fetchLessons, takeLesson } = useLessonStore();
  const { loading, error } = useCommonStore();

  return (
    <App
      lessons={lessons}
      loading={loading}
      error={error}
      onFetchLessons={fetchLessons}
      onTakeLesson={takeLesson}
    />
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppWithStore />
  </React.StrictMode>,
)