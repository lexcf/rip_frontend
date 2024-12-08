import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import { api } from './api';

const ModeratorRequestsPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState('');
  const [creator, setCreator] = useState('');

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await api.requests.requestsList() // Укажите ваш URL для получения заявок
        setRequests(response.data);
        setFilteredRequests(response.data); // Изначально отображаем все заявки
      } catch (error) {
        console.error('Ошибка при загрузке заявок:', error);
        setError('Ошибка при загрузке заявок');
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  useEffect(() => {
    const filtered = requests.filter((request) => {
      const matchStartDate = startDate ? new Date(request.created_at) >= new Date(startDate) : true;
      const matchEndDate = endDate ? new Date(request.created_at) <= new Date(endDate) : true;
      const matchStatus = status ? request.status === status : true;
      const matchCreator = creator ? request.username.toLowerCase().includes(creator.toLowerCase()) : true;
      return matchStartDate && matchEndDate && matchStatus && matchCreator;
    });

    setFilteredRequests(filtered);
  }, [startDate, endDate, status, creator, requests]);

  const handleStatusChange = async (requestId, newStatus) => {
    try {
      // Отправка запроса на смену статуса (здесь должен быть ваш API)
      await axios.patch(`API_URL_HERE/${requestId}`, { status: newStatus });
      // Обновляем данные после смены статуса
      const response = await axios.get('API_URL_HERE');
      setRequests(response.data);
    } catch (error) {
      console.error('Ошибка при смене статуса заявки:', error);
      setError('Ошибка при смене статуса заявки');
    }
  };

  return (
    <div className="container-fluid bg-dark text-light min-vh-100">
      <header className="d-flex justify-content-between align-items-center px-5 py-3 site-header" style={{ backgroundColor: '#333', height: '70%', maxHeight: '60px', width: '1990px', marginLeft: '-30px' }}>
        <Link to="/" className="text-light fs-4 header-text">
          Мониторинг заявок
        </Link>
      </header>

      <div className="container my-4">
        <h2>Фильтрация заявок</h2>
        <form className="row g-3 align-items-center">
          <div className="col">
            <input
              type="date"
              className="form-control"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="col">
            <input
              type="date"
              className="form-control"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <div className="col">
            <select
              className="form-select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">Все статусы</option>
              <option value="formed">В ожидании</option>
              <option value="ended">Завершена</option>
            </select>
          </div>
          <div className="col">
            <input
              type="text"
              className="form-control"
              placeholder="Поиск по создателю"
              value={creator}
              onChange={(e) => setCreator(e.target.value)}
            />
          </div>
        </form>
      </div>

      <div className="container">
        {loading ? (
          <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
            <div className="spinner-border text-light" role="status">
              <span className="visually-hidden">Загрузка...</span>
            </div>
          </div>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered table-dark">
              <thead>
                <tr>
                  <th>Заявка</th>
                  <th>Создатель</th>
                  <th>Дата</th>
                  <th>Статус</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((request) => (
                  <tr key={request.pk}>
                    <td>{request.pk}</td>
                    <td>{request.username}</td>
                    <td>{new Date(request.created_at).toLocaleDateString()}</td>
                    <td>{request.status}</td>
                    <td>
                      <button
                        className="btn btn-warning"
                        onClick={() => handleStatusChange(request.pk, 'ended')}
                      >
                        Завершить
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModeratorRequestsPage;
