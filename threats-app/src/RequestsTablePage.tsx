import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import Breadcrumbs from './Breadcrumbs';

const RequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const { isAuthenticated } = useSelector((state) => state.auth); // Проверка на авторизацию

  useEffect(() => {
    if (isAuthenticated) {
      const fetchRequests = async () => {
        try {
          const response = await fetch('/api/requests/');
          if (response.ok) {
            const data = await response.json();
            setRequests(data); // Сохраняем полученные заявки
          } else {
            console.error('Ошибка при загрузке заявок');
          }
        } catch (error) {
          console.error('Ошибка при выполнении запроса:', error);
        }
      };

      fetchRequests();
    }
  }, [isAuthenticated]);

  return (
    <div className="container-fluid bg-dark text-light min-vh-100">
      <header className="d-flex justify-content-between align-items-center px-5 py-3 site-header" style={{ backgroundColor: '#333', maxHeight: '60px' }}>
        <Link to="/" className="text-light fs-4 header-text">Мониторинг угроз</Link>
        <Navbar />
      </header>

      <Breadcrumbs />

      <div className="container my-4">
        <h2 className="mb-4">Мои заявки</h2>
        
        {/* Таблица заявок */}
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
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request.pk}>
                <td>{request.pk}</td>
                <td>{request.status}</td>
                <td>{new Date(request.created_at).toLocaleString()}</td>
                <td>{new Date(request.formed_at).toLocaleString()}</td>
                <td>{new Date(request.ended_at).toLocaleString()}</td>
                <td>{request.moderator}</td>
                <td>{request.final_price} ₽</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RequestsPage;
