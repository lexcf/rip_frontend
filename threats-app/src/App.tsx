import React, { useEffect } from 'react';
import './App.css';  // Styles
import ThreatDescription from './DescriptionPage';
import HomePage from './HomePage';
import ThreatsPage from './ThreatsPage';
import RequestPage from './RequestPage';
import RegisterPage from './RegisterPage';
import RequestsPage from './RequestsTablePage';
import LoginPage from './LoginPage';
import ProfilePage from './ProfilePage'
import ModeratorThreatsPage from './ModeratorThreatsPage'
import Page403 from './Page403';
import Page404 from './Page404';
import ModeratorRequestsPage from './ModeratorRequestsPage';
import ThreatFormPage from './ThreatFormPage';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';

function App() {

  useEffect(() => {
    if (window.__TAURI__) {
      const { invoke } = window.__TAURI__.tauri;

      invoke('tauri', { cmd: 'create' })
        .then((response: any) => console.log(response))
        .catch((error: any) => console.log(error));

      return () => {
        invoke('tauri', { cmd: 'close' })
          .then((response: any) => console.log(response))
          .catch((error: any) => console.log(error));
      };
    }
  }, []);

  const router = createBrowserRouter([
    {
      path: '/',
      element: <HomePage />
    },
    {
      path: '/profile',
      element: <ProfilePage />
    },
    {
      path: '/threats',
      element: <ThreatsPage />
    },
    {
      path: '/requests/',
      element: <RequestsPage />
    },
    {
      path: '/requests/:reqId',
      element: <RequestPage />
    },
    {
      path: '/description/:threatId',
      element: <ThreatDescription />
    },
    {
      path: '/register',
      element: <RegisterPage />
    },
    {
      path: '/login',
      element: <LoginPage />
    },
    {
      path: '/moderator/threats',
      element: <ModeratorThreatsPage />
    },
    {
      path: '/moderator/requests',
      element: <ModeratorRequestsPage />
    },
    {
      path: '/moderator/threats/new',
      element: <ThreatFormPage />
    },
    {
      path: '/moderator/threats/edit/:id',
      element: <ThreatFormPage />
    },
    {
      path: '/403',
      element: <Page403 />
    },
    {
      path: '/404',
      element: <Page404 />
    },
  ], { basename: '/rip_frontend' });
  
  // Service Worker registration
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function() {
      navigator.serviceWorker
        .register("/rip_frontend/serviceWorker.js")
        .then(res => console.log("service worker registered"))
        .catch(err => console.log("service worker not registered", err))
    })
  }

  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
}

export default App;
