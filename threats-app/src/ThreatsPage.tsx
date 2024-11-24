import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { logout } from './redux/authSlice';
import Navbar from './Navbar';
import Breadcrumbs from './Breadcrumbs';
import axios from 'axios';
import Cookies from 'js-cookie';

const ProfilePage = () => {
  const { username, isAuthenticated } = useSelector((state) => state.auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // Состояние загрузки
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const csrfToken = Cookies.get('csrftoken'); // Получаем CSRF токен из cookies
      const data = {};

      // Добавляем только те параметры, которые не пустые
      if (email) data.email = email;
      if (password) data.password = password;

      // Проверяем, есть ли данные для отправки
      if (Object.keys(data).length === 0) {
        setError('Необходимо ввести хотя бы один параметр для обновления.');
        setLoading(false);
        return;
      }

      const response = await axios.put('/api/auth/profile/', data, {
        headers: {
          'X-CSRFToken': csrfToken,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        setSuccess('Профиль обновлен успешно. Пожалуйста, выполните вход заново.');
        setError('');
        dispatch(logout()); // Разлогиниваем пользователя
      }
    } catch (err) {
      console.error('Ошибка при обновлении профиля:', err);

      // Обработка ошибки
      if (err.response?.status === 400) {
        setError('Неверные данные. Проверьте введенные параметры.');
      } else if (err.response?.status === 401) {
        setError('Сессия истекла. Пожалуйста, войдите заново.');
        dispatch(logout());
      } else {
        setError('Ошибка при обновлении данных профиля. Попробуйте позже.');
      }
    } finally {
      setLoading(false);
    }
  };

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
        <h2 className="mb-4 text-center">Изменить профиль</h2>

        {/* Вывод сообщений об ошибках и успехе */}
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleProfileUpdate} className="row g-3">
          <div className="col-12">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Введите новый email (если хотите изменить)"
            />
          </div>

          <div className="col-12">
            <label htmlFor="password" className="form-label">
              Пароль
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Введите новый пароль (если хотите изменить)"
            />
          </div>

          <div className="col-12 text-center">
            <button type="submit" className="btn btn-success" disabled={loading}>
              {loading ? (
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              ) : (
                'Обновить профиль'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
