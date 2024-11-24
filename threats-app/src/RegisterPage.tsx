import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from './redux/authSlice'; // Импортируем экшн для авторизации
import { Link, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Breadcrumbs from './Breadcrumbs';

const RegistrationPage = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        dispatch(login({ username: data.username })); // Авторизуем пользователя после регистрации
        navigate('/login'); // Перенаправляем на страницу входа
      } else {
        alert('Ошибка регистрации. Пожалуйста, проверьте введенные данные.');
      }
    } catch (error) {
      console.error('Ошибка при регистрации:', error);
      alert('Ошибка при регистрации. Пожалуйста, попробуйте позже.');
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
          <h2 className="text-center mb-4">Регистрация</h2>
          <form onSubmit={handleRegister}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Введите ваш email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">Имя пользователя</label>
              <input
                type="text"
                className="form-control"
                id="username"
                placeholder="Введите имя пользователя"
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
            <button type="submit" className="btn btn-success w-100">Зарегистрироваться</button>
          </form>
          <div className="text-center mt-3">
            <p className="mb-0">Уже есть аккаунт?</p>
            <Link to="/login" className="text-success">Войти</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;
