import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './App.css';
import Navbar from './Navbar';
import Breadcrumbs from './Breadcrumbs';
import Cookies from 'js-cookie';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentRequestId, setCurrentCount } from './redux/threatsSlice';

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
    status: 'draft',
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
    status: 'approved',
  },
];

const defaultImageUrl = '/static/network.jpg';

const RequestPage = () => {
  const { reqId } = useParams();
  const [currentThreats, setCurrentThreats] = useState([]);
  const [loading, setLoading] = useState(true); // Для состояния загрузки
  const [errorMessage, setErrorMessage] = useState(''); // Для обработки ошибок
  const [status, setStatus] = useState(''); // Для хранения статуса заявки
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequestData = async () => {
      if (!reqId) {
        setLoading(false);
        return;
      }

      setLoading(true); // Включаем анимацию загрузки
      try {
        const response = await axios.get(`/api/requests/${reqId}/`);
        setCurrentThreats(response.data.threats);
        setStatus(response.data.status);
      } catch (err) {
        console.error('Ошибка при загрузке:', err);
        const mockRequest = mockRequests.find(request => request.reqId === reqId);
        if (mockRequest) {
          setCurrentThreats(mockRequest.threats);
          setStatus(mockRequest.status);
        } else {
          setErrorMessage('Заявка не найдена');
        }
      } finally {
        setLoading(false); // Отключаем анимацию загрузки
      }
    };

    fetchRequestData();
  }, [reqId]);

  const handleDelete = async () => {
    if (!reqId) return;

    setLoading(true); // Включаем анимацию загрузки
    try {
      const csrfToken = Cookies.get('csrftoken');
      await axios.delete(`/api/requests/moderate/${reqId}/`, {
        headers: {
          'X-CSRFToken': csrfToken,
        },
      });
      setCurrentThreats([]);
      dispatch(setCurrentRequestId(null));
      dispatch(setCurrentCount(0));
      navigate('/threats');
    } catch (error) {
      console.error('Ошибка при удалении:', error);
    } finally {
      setLoading(false); // Отключаем анимацию загрузки
    }
  };

  const handleConfirmRequest = async () => {
    if (!reqId) return;

    setLoading(true); // Включаем анимацию загрузки
    try {
      const csrfToken = Cookies.get('csrftoken');
      await axios.put(`/api/requests/form/${reqId}/`, null, {
        headers: {
          'X-CSRFToken': csrfToken,
        },
      });
      setCurrentThreats([]);
      dispatch(setCurrentRequestId(null));
      dispatch(setCurrentCount(0));
      navigate('/threats');
    } catch (error) {
      console.error('Ошибка при подтверждении заявки:', error);
    } finally {
      setLoading(false); // Отключаем анимацию загрузки
    }
  };

  // Обработка состояния загрузки и ошибок
  if (loading) {
    return (
      <div className="loading-screen">
        <header className="site-header">
          <a href="/" className="site-name">Мониторинг угроз</a>
          <Navbar />
        </header>
        <Breadcrumbs />
        <div>Загрузка данных заявки...</div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="error-screen">
        <header className="site-header">
          <a href="/" className="site-name">Мониторинг угроз</a>
          <Navbar />
        </header>
        <Breadcrumbs />
        <div>{errorMessage}</div>
      </div>
    );
  }

  if (!reqId) {
    return null;
  }

  return (
    <div className="request-page container-fluid bg-dark text-light min-vh-100">
      <header className="d-flex justify-content-between align-items-center px-5 py-3 site-header" style={{ backgroundColor: '#333', height: '70%', maxHeight: '60px', width: '1990px', marginLeft: '-30px' }}>
        <Link to="/" className="text-light fs-4 header-text">Мониторинг угроз</Link>
        <Navbar />
      </header>

      <Breadcrumbs />
      <div className="request-buttons" style={{ gap: '2%' }}>
        {status === 'draft' && (
          <button onClick={handleConfirmRequest} className="btn btn-success">
            Подтвердить заявку
          </button>
        )}
        {status === 'draft' && (
          <button onClick={handleDelete} className="btn btn-danger">
            Удалить
          </button>
        )}
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
