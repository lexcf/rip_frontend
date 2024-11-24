import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from './redux/authSlice'; // Импортируем экшн для авторизации
import Navbar from './Navbar';
import Breadcrumbs from './Breadcrumbs';
import Cookie from 'js-cookie';

const LoginPage = () => {
  const [username, setUsername] = useState(''); // Состояние для имени пользователя
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      Cookie.remove('csrftoken');
      Cookie.remove('sessionid');
      const response = await fetch('/api/auth/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }), // Отправляем username вместо email
      });

      if (response.ok) {
        // После успешного входа мы передаем username в Redux, а не из ответа сервера
        dispatch(login({ username })); // Авторизуем пользователя
        navigate('/threats'); // После успешного входа перенаправляем на страницу угроз
      } else {
        const errorData = await response.json();
        setError('Неверное имя пользователя или пароль')
      }
    } catch (error) {
      console.error('Ошибка при входе:', error);
      alert('Ошибка при входе. Пожалуйста, попробуйте позже.');
    }
  };

  return (
    <div className="min-vh-100 bg-dark text-light d-flex flex-column">
      <header className="d-flex justify-content-between align-items-center px-5 py-3 site-header" style={{ backgroundColor: '#333', height: '70%', maxHeight: '60px', width: '1990px', marginLeft:'-30px' }}>
        <Link to="/" className="text-light fs-4 header-text">Мониторинг угроз</Link>
        <Navbar />
      </header>

      <Breadcrumbs />

      {/* Content Section */}
      <div className="container-fluid d-flex justify-content-center align-items-center flex-grow-1">
        <div className="card bg-dark text-light border-light p-4" style={{ maxWidth: '400px', width: '100%' }}>
          <h2 className="text-center mb-4">Вход</h2>

          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">Имя пользователя</label>
              <input
                type="text"
                className="form-control"
                id="username"
                placeholder="Введите ваше имя пользователя"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Пароль</label>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Введите пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-success w-100">Войти</button>
          </form>
          <div className="text-center mt-3">
            <p className="mb-0">Нет аккаунта?</p>
            <Link to="/register" className="text-success">Зарегистрироваться</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
