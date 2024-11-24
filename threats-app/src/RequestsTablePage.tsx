import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import Breadcrumbs from './Breadcrumbs';

const RequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true); // Состояние для анимации загрузки
  const [error, setError] = useState(''); // Состояние для обработки ошибок
  const { isAuthenticated } = useSelector((state) => state.auth); // Проверка на авторизацию

  useEffect(() => {
    if (isAuthenticated) {
      const fetchRequests = async () => {
        setLoading(true);
        setError('');
        try {
          const response = await axios.get('/api/requests/');
          setRequests(response.data); // Сохраняем полученные заявки
        } catch (error) {
          console.error('Ошибка при выполнении запроса:', error);
          setError('Ошибка при загрузке заявок');
        } finally {
          setLoading(false);
        }
      };

      fetchRequests();
    }
  }, [isAuthenticated]);

  return (
    <div className="container-fluid bg-dark text-light min-vh-100">
      <header
        className="d-flex justify-content-between align-items-center px-5 py-3 site-header"
        style={{
          backgroundColor: '#333',
          height: '70%',
          maxHeight: '60px',
          width: '1990px',
          marginLeft: '-30px',
        }}
      >
        <Link to="/" className="text-light fs-4 header-text">
          Мониторинг угроз
        </Link>
        <Navbar />
      </header>

      <Breadcrumbs />

      <div className="container my-4">
        <h2 className="mb-4">Мои заявки</h2>

        {loading ? (
          <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
            <div className="spinner-border text-light" role="status">
              <span className="visually-hidden">Загрузка...</span>
            </div>
          </div>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : (
          <table className="table table-dark table-bordered">
            <thead>
              <tr>
                <th>Номер заявки</th>
                <th>Статус</th>
                <th>Дата создания</th>
                <th>Дата формирования</th>
                <th>Дата завершения</th>
                <th>Модератор</th>
                <th>Итоговая цена</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request.pk}>
                  <td>{request.pk}</td>
                  <td>{request.status}</td>
                  <td>{new Date(request.created_at).toLocaleString()}</td>
                  <td>{request.formed_at != null ? new Date(request.formed_at).toLocaleString() : ''}</td>
                  <td>{request.ended_at != null ? new Date(request.ended_at).toLocaleString() : ''}</td>
                  <td>{request.moderator}</td>
                  <td>{request.final_price} ₽</td>
                  <td>
                    <Link to={`/requests/${request.pk}`} className="btn btn-success">
                      Просмотр
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default RequestsPage;
