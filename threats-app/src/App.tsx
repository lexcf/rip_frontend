import React from 'react';
import './App.css';  // Стили
import MainPage from './mainPage';  // Импортируем компонент
import RequestPage from './requestPage';
import ThreatDescription from './descriptionPage';

function App() {
  const threat = {
    name: 'Пример угрозы',
    description: 'Описание данной угрозы...',
    count: 5,
    price: '15000 ₽',
    img_url: 'http://127.0.0.1:9000/static/network.jpg'
  };

  const data = {
    reqId: '12345', // замените на актуальный id
    currentThreats: [
      {
        threat_name: 'Опасность 1',
        company_name: 'Компания А',
        price: '1000',
        comment: 'Комментарий 1',
        img_url: 'http://127.0.0.1:9000/static/network.jpg',
      },
      {
        threat_name: 'Опасность 2',
        company_name: 'Компания <',
        price: '1000',
        comment: 'Комментарий 1',
        img_url: 'http://127.0.0.1:9000/static/network.jpg',
      },
      {
        threat_name: 'Опасность 3',
        company_name: 'Компания D',
        price: '1000',
        comment: 'Комментарий 1',
        img_url: 'http://127.0.0.1:9000/static/network.jpg',
      },
    ]
  };

  return (
      //<RequestPage reqId={data.reqId} currentThreats={data.currentThreats} />
      //<MainPage />

      <ThreatDescription threat={threat} />
  );
}

export default App;
