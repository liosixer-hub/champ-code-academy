import React from 'react'
import ReactDOM from 'react-dom/client'
import { DashboardApp } from './App.tsx'
import { useLessonStore, useCommonStore } from 'shared/store'
import './index.css'

const AppWithStore: React.FC = () => {
  const { lessons, fetchLessons, takeLesson } = useLessonStore();
  const { loading, error } = useCommonStore();

  return (
    <DashboardApp />
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppWithStore />
  </React.StrictMode>,
)