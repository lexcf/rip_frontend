import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import MainPage from './ThreatsPage.tsx';
import RequestPage from './RequestPage.tsx';
import ThreatDescription from './DescriptionPage.tsx';
import HomePage from './HomePage.tsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';  // Импортируйте ваш store
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
]);

// Рендерим приложение с провайдером роутера и Redux
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}> {/* Оборачиваем RouterProvider в Provider */}
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
