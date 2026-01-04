import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
// 移除 index.css 以避免与 shared 样式冲突
import './styles/index.css'

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
      <App />
    </React.StrictMode>,
  )
});