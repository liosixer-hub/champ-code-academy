import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
// 移除 index.css 以避免与 shared 样式冲突
import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)