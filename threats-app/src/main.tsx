import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import MainPage from './ThreatsPage.tsx';
import RequestPage from './RequestPage.tsx';
import ThreatDescription from './DescriptionPage.tsx';
import HomePage from './HomePage.tsx';
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
    path: '/threats',
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
], { basename: '/ThreatsMonitoringApp' });

// Рендерим приложение с провайдером роутера
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
