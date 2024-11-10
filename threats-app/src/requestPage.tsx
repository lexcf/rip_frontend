import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './App.css';
import Navbar from './Navbar';
import Breadcrumbs from './Breadcrumbs';

// Мок-данные для заявок
const mockRequests = [
  {
    reqId: '1',
    threats: [
      {
        threat_name: 'Угроза 1',
        company_name: 'Компания A',
        price: 1500,
        short_description: 'Краткое описание угрозы 1.',
      },
      {
        threat_name: 'Угроза 2',
        company_name: 'Компания B',
        price: 2000,
        short_description: 'Краткое описание угрозы 2.',
      },
    ],
  },
  {
    reqId: '2',
    threats: [
      {
        threat_name: 'Угроза 3',
        company_name: 'Компания C',
        price: 1200,
        short_description: 'Краткое описание угрозы 3.',
      },
    ],
  },
];

const defaultImageUrl = '/static/network.jpg';

const RequestPage = () => {
  const { reqId } = useParams();
  const [currentThreats, setCurrentThreats] = useState([]);
  const [loading, setLoading] = useState(true); // Для состояния загрузки
  const [errorMessage, setErrorMessage] = useState(''); // Для обработки ошибок

  useEffect(() => {
    const fetchRequestData = async () => {
      if (!reqId) {
        setLoading(false); // Если reqId не установлен, выходим из функции
        return;
      }

      try {
        const response = await fetch(`/api/requests/${reqId}/`);
        
        if (!response.ok) {
          throw new Error('Ошибка загрузки данных! Заявка не активна или необходимо авторизоваться!');
        }

        const requestData = await response.json();
        setCurrentThreats(requestData.threats); // Устанавливаем угрозы из ответа
      } catch (err) {
        // Если произошла ошибка, используем мок-данные только если нет соединения
        const mockRequest = mockRequests.find(request => request.reqId === reqId);
        
        if (mockRequest) {
          setCurrentThreats(mockRequest.threats);
        } else {
          setErrorMessage('Заявка не найдена');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRequestData();
  }, [reqId]);

  const handleDelete = async () => {
    if (!reqId) return; // Если reqId не установлен, ничего не делаем

    try {
      const response = await fetch('/del_request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'X-CSRFToken': getCsrfToken() // добавьте CSRF токен, если используете Django
        },
        body: JSON.stringify({ request_id: reqId })
      });
      if (response.ok) {
        alert('Запрос успешно удален');
        setCurrentThreats([]); // Очищаем угрозы после удаления
      } else {
        alert('Ошибка при удалении запроса');
      }
    } catch (error) {
      console.error('Ошибка:', error);
    }
  };

  const getCsrfToken = () => {
    return document.cookie.split('; ')
      .find(row => row.startsWith('csrftoken'))
      ?.split('=')[1];
  };

  // Обработка состояния загрузки и ошибок
  if (loading) {
    return (
      <div>
        <header className="site-header">
          <a href="/" className="site-name">Мониторинг угроз</a>
          <Navbar /> {/* Добавляем Navbar */}
        </header>
        <Breadcrumbs />
        <div>Загрузка данных заявки...</div>
      </div>
    );
  }

  // Если ошибка произошла, выводим сообщение
  if (errorMessage) {
    return (
      <div>
        <header className="site-header">
          <a href="/" className="site-name">Мониторинг угроз</a>
          <Navbar /> {/* Добавляем Navbar */}
        </header>
        <Breadcrumbs />
        <div>{errorMessage}</div>
      </div>
    );
  }

  // Если reqId не установлен, ничего не выводим
  if (!reqId) {
    return null;
  }

  return (
    <div>
      <header className="site-header">
        <a href="/" className="site-name">Мониторинг угроз</a>
        <Navbar /> {/* Добавляем Navbar */}
      </header>
      <Breadcrumbs />
      <div className="request-buttons">
        <button onClick={handleDelete} className="del-button">
          Удалить
        </button>
      </div>

      <main className="site-body">
        <div className="cards-list-request">
          {currentThreats.length > 0 ? (
            currentThreats.map((threat, index) => (
              <div key={index} className="card card-request">
                <div className="card__content">
                  <table className="request-table">
                    <thead>
                      <tr>
                        <th>Услуга</th>
                        <th>Компания</th>
                        <th>Стоимость мониторинга</th>
                        <th>Комментарий</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{threat.threat_name}</td>
                        <td>{threat.company_name || 'Не указана'}</td>
                        <td>{threat.price} ₽</td>
                        <td>{threat.short_description || 'Нет комментариев'}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <img src={threat.img_url ? threat.img_url : defaultImageUrl} alt={threat.threat_name} className="card__image card__image-request" />
              </div>
            ))
          ) : (
            <p>Корзина пуста</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default RequestPage;
