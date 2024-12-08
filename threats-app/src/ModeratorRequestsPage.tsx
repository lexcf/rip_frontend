import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { api } from './api';
import Cookies from 'js-cookie';
import Navbar from './Navbar';

const ModeratorRequestsPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [requests, setRequests] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState('');
  const [creator, setCreator] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      setError('');
      
      const params = {};
      if (startDate) params.date_from = startDate;
      if (endDate) params.date_to = endDate;
      if (status) params.status = status;

      try {
        const response = await axios.get('/api/requests/', { params });
        setRequests(response.data);
      } catch (error) {
        console.error('Ошибка при загрузке заявок:', error);
        setError('Ошибка при загрузке заявок');
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [startDate, endDate, status]);

  useEffect(() => {
    const filtered = requests.filter((request) => {
      const matchCreator = creator
        ? request.username.toLowerCase().includes(creator.toLowerCase())
        : true;
      return matchCreator;
    });
    setRequests(filtered);
  }, [creator]);

  const handleViewRequest = (requestId) => {
    navigate(`/requests/${requestId}`);
  };

  const handleStatusChange = async (requestId, newStatus) => {
    try {
      await api.requests.moderateUpdate(
        requestId,
        { accept: true },
        { headers: { 'X-CSRFToken': Cookies.get('csrftoken') } }
      );
      const response = await axios.get('/api/requests/');
      setRequests(response.data);
    } catch (error) {
      console.error('Ошибка при смене статуса заявки:', error);
      setError('Ошибка при смене статуса заявки');
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      await api.requests.moderateUpdate(
        requestId,
        { accept: false },
        { headers: { 'X-CSRFToken': Cookies.get('csrftoken') } }
      );
      const response = await axios.get('/api/requests/');
      setRequests(response.data);
    } catch (error) {
      console.error('Ошибка при отклонении заявки:', error);
      setError('Ошибка при отклонении заявки');
    }
  };

  return (
    <div className="container-fluid bg-dark text-light min-vh-100">
      <header className="d-flex justify-content-between align-items-center px-5 py-3 site-header" style={{ backgroundColor: '#333', height: '70%', maxHeight: '60px', width: '1990px', marginLeft: '-30px' }}>
        <Link to="/" className="text-light fs-4 header-text">Мониторинг угроз</Link>
        <Navbar />
      </header>


      <div className="container my-4">
        <h2>Фильтрация заявок</h2>
        <form className="row g-3 align-items-center">
          <div className="col">
            <label htmlFor="startDate" className="form-label">Дата начала</label>
            <input
              type="date"
              id="startDate"
              className="form-control"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="col">
            <label htmlFor="endDate" className="form-label">Дата окончания</label>
            <input
              type="date"
              id="endDate"
              className="form-control"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <div className="col">
            <label htmlFor="status" className="form-label">Статус</label>
            <select
              id="status"
              className="form-select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">Все статусы</option>
              <option value="formed">Сформирована</option>
              <option value="ended">Завершена</option>
              <option value="rejected">Отклонена</option>
            </select>
          </div>
          <div className="col">
            <label htmlFor="creator" className="form-label">Создатель</label>
            <input
              type="text"
              id="creator"
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
                  <th>Итоговая цена</th>
                  <th>Модератор</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request) => (
                  <tr key={request.pk}>
                    <td>{request.pk}</td>
                    <td>{request.username}</td>
                    <td>{new Date(request.created_at).toLocaleDateString()}</td>
                    <td>{request.status}</td>
                    <td>{request.final_price || 'N/A'}</td>
                    <td>{request.moderator || 'N/A'}</td>
                    <td style={{ width: '400px' }}>
                      <button
                        className="btn btn-info me-2"
                        onClick={() => handleViewRequest(request.pk)}
                      >
                        Просмотреть
                      </button>
                      {request.status === 'formed' && (
                        <>
                          <button
                            className="btn btn-warning me-2"
                            onClick={() => handleStatusChange(request.pk, 'ended')}
                          >
                            Завершить
                          </button>
                          <button
                            className="btn btn-danger"
                            onClick={() => handleRejectRequest(request.pk)}
                          >
                            Отклонить
                          </button>
                        </>
                      )}
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
