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

async function enableMocking() {
  const { worker } = await import('../../../server/browser');
  return worker.start({
    onUnhandledRequest: 'bypass',
    serviceWorker: {
      url: `${import.meta.env.BASE_URL}mockServiceWorker.js`
    }
  });
}

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <AppWithStore />
    </React.StrictMode>,
  )
});