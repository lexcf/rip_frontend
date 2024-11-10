import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import MainPage from './mainPage';
import RequestPage from './requestPage';
import ThreatDescription from './descriptionPage';
import HomePage from './homePage.tsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import './App.css';

// Создаем маршрутизатор с путями для всех страниц
const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />
  },
  {
    path: '/main',
    element: <MainPage />
  },
  {
    path: '/requests/:reqId',
    element: <RequestPage />
  },
  {
    path: '/description/:threatId',
    element: <ThreatDescription />
  }
]);

// Рендерим приложение с провайдером роутера
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
