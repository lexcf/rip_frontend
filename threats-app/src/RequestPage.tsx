import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './App.css';
import Navbar from './Navbar';
import Breadcrumbs from './Breadcrumbs';
import { Link } from 'react-router-dom';
import { useNavigate} from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import { api } from './api';
import { useSelector, useDispatch } from 'react-redux';
import { setThreats, setFilteredThreats, setInputValue, setPriceFrom, setPriceTo, setCurrentRequestId, setCurrentCount } from './redux/threatsSlice';

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
  const { inputValue, priceFrom, priceTo, threats, filteredThreats, currentRequestId, currentCount } = useSelector((state) => state.threats);
  const { reqId } = useParams();
  const [currentThreats, setCurrentThreats] = useState([]);
  const [loading, setLoading] = useState(true); // Для состояния загрузки
  const [errorMessage, setErrorMessage] = useState(''); // Для обработки ошибок
  const [status, setStatus] = useState(''); // Для хранения статуса заявки

  const [editingPrice, setEditingPrice] = useState(null); // ID угрозы для редактирования
  const [newPrice, setNewPrice] = useState(''); // Новая цена

  const dispatch = useDispatch();
  const navigate = useNavigate();


  const fetchRequestData = async () => {
    if (!reqId) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/requests/${reqId}/`);

      if (!response.ok) {
        throw new Error('Ошибка загрузки данных! Заявка не активна или необходимо авторизоваться!');
      }

      const requestData = await response.json();
      setCurrentThreats(requestData.threats);
      setStatus(requestData.status);
    } catch (err) {
      setErrorMessage('Ошибка при загрузке данных.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequestData();
  }, [reqId]);

  const handleEditPrice = (threatId, currentPrice) => {
    setEditingPrice(threatId); // Устанавливаем ID редактируемой угрозы
    setNewPrice(currentPrice); // Устанавливаем текущую цену
  };

  const handleSavePrice = async (threatId) => {
  if (!reqId || !threatId || newPrice === '') return; // Проверяем, что данные заполнены

  try {
    let csrfToken = Cookies.get('csrftoken');
    const response = await axios.put(`/api/request-threat/${reqId}/`, {
      threat_id: threatId,
      price: newPrice,
    },{
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
      }
    });

    if (response.status === 200) {
      // Обновляем состояние угроз
      setCurrentThreats((prevThreats) =>
        prevThreats.map((threat) =>
          threat.pk === threatId ? { ...threat, price: newPrice } : threat
        )
      );
      setEditingPrice(null); // Скрываем поле редактирования
      setNewPrice(''); // Очищаем новую цену
    } else {
      alert('Ошибка при обновлении стоимости');
    }
  } catch (error) {
    console.error('Ошибка:', error);
  }
};


  const handleDelete = async () => {
    if (!reqId) return; // Если reqId не установлен, ничего не делаем

    try {
      let csrfToken = Cookies.get('csrftoken');
      const response = await fetch(`/api/requests/moderate/${reqId}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        }
      });
      if (response.ok) {
        setCurrentThreats([]); // Очищаем угрозы после удаления
        dispatch(setCurrentRequestId(null));
        dispatch(setCurrentCount(0));
        navigate('/threats')
      } else {
        alert('Ошибка при удалении запроса');
      }
    } catch (error) {
      console.error('Ошибка:', error);
    }
  };

  const handleDeleteThreat = async (threat_id) => {
    if (!reqId || !threat_id) return;
  
    try {
      let csrfToken = Cookies.get('csrftoken');
      const response = await fetch(`/api/request-threat/${reqId}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify({ threat_id }), // Указываем id угрозы в теле запроса
      });
  
      if (response.ok) {
        // Успешно удалено
        setCurrentThreats(currentThreats.filter((threat) => threat.id !== threat_id)); // Обновляем список угроз
        await fetchRequestData();
      } else {
        alert('Ошибка при удалении угрозы');
      }
    } catch (error) {
      console.error('Ошибка:', error);
    }
  };
  


  const handleConfirmRequest = async () => {
    if (!reqId) return;

    try {
      let csrfToken = Cookies.get('csrftoken');
      const response = await api.requests.formUpdate(reqId, {
        headers: {
          'X-CSRFToken': csrfToken,
        }
      });
      /*const response = await fetch(/api/requests/form/${reqId}/, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        }
      });*/
      if (response.status === 200) {
        setCurrentThreats([]); // Очищаем угрозы после удаления
        dispatch(setCurrentRequestId(null));
        dispatch(setCurrentCount(0));
        navigate('/threats')
      } else {
        alert('Ошибка при удалении запроса');
      }
    } catch (error) {
      console.error('Ошибка:', error);
    }
  };

  // Обработка состояния загрузки и ошибок
  if (loading) {
    return (
      <div className="loading-screen request-page container-fluid bg-dark text-light min-vh-100">
        <header className="site-header">
          <a href="/" className="site-name">Мониторинг угроз</a>
          <Navbar />
        </header>
        <Breadcrumbs />
        <div>Загрузка данных заявки...</div>
      </div>
    );
  }

  // Если ошибка произошла, выводим сообщение
  if (errorMessage) {
    return (
      <div className="error-screen request-page container-fluid bg-dark text-light min-vh-100">
        <header className="site-header">
          <a href="/" className="site-name">Мониторинг угроз</a>
          <Navbar />
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
    <div className="request-page container-fluid bg-dark text-light min-vh-100">
      <header className="d-flex justify-content-between align-items-center px-5 py-3 site-header" style={{ backgroundColor: '#333', height: '70%', maxHeight: '60px', width: '1990px', marginLeft: '-30px' }}>
        <Link to="/" className="text-light fs-4 header-text">Мониторинг угроз</Link>
        <Navbar />
      </header>

      <Breadcrumbs />
      <div className="request-buttons" style={{gap: '2%'}}>
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

      <main className="site-body ">
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
                        <td>{threat.company_name|| 'Не указана'}</td>
                        <td
  onClick={() => status === 'draft' && handleEditPrice(threat.pk, threat.price)}
  style={{ cursor: status === 'draft' ? 'pointer' : 'default' }}
>
  {editingPrice === threat.pk ? (
    <input
      type="number"
      value={newPrice}
      onChange={(e) => setNewPrice(e.target.value)}
      onBlur={() => handleSavePrice(threat.pk)} // Сохранение при снятии фокуса
      onKeyDown={(e) => {
        if (e.key === 'Enter') handleSavePrice(threat.pk); // Сохранение при нажатии Enter
      }}
      min="0"
      style={{
        width: '80px',
        backgroundColor: '#2a2a2a',
        color: 'white',
        border: '1px solid #555',
      }}
    />
  ) : (
    <span>{threat.price} ₽</span>
  )}
</td>

                        <td>{threat.short_description || 'Нет комментариев'}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                {status === 'draft' && (
                <button className='btn btn-danger' style={{width: '10%',position:'relative',top:'27%',left:'60%'}} onClick={() => handleDeleteThreat(threat.pk)}>Удалить</button>
                )}
                <img src={threat.img_url ? threat.img_url : defaultImageUrl}  alt={threat.threat_name} className="card__image card__image-request" />
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