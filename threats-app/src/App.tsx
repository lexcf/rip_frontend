import React, { useEffect } from 'react';
import './App.css';  // Стили
import ThreatDescription from './DescriptionPage';
import HomePage from './HomePage';
import ThreatsPage from './ThreatsPage';
import RequestPage from './RequestPage';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';

const {invoke} = (window as any).__TAURI__.tauri

function App() {

  useEffect(() => {
    invoke('tauri',{cmd:'create'})
      .then((response: any) => console.log(response))
      .catch((error: any) => console.log(error))

    return () => {
      invoke('tauri',{cmd:'close'})
      .then((response: any) => console.log(response))
      .catch((error: any) => console.log(error))
    }
  },[])

  const router = createBrowserRouter([
    {
      path: '/',
      element: <HomePage />
    },
    {
      path: '/threats',
      element: <ThreatsPage />
    },
    {
      path: '/requests/:reqId',
      element: <RequestPage />
    },
    {
      path: '/description/:threatId',
      element: <ThreatDescription />
    }
  ], { basename: '/rip_frontend' });
  
  
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
