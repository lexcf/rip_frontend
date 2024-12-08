import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'; // Импортируем необходимые хуки из Redux
import { logout } from './redux/authSlice'; // Импортируем экшн logout
import axios from 'axios'; // Импортируем axios
import Cookies from 'js-cookie'; // Импортируем js-cookie для работы с cookies
import './App.css'; // Импортируем стили для navbar

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, username } = useSelector((state) => state.auth); // Получаем данные о пользователе из Redux состояния

  const handleLogout = async (e) => {
    e.preventDefault();

    try {
      const csrfToken = Cookies.get('csrftoken'); // Получаем CSRF токен из cookies

      const response = await axios.post('/api/auth/logout/', {}, {
        headers: {
          'X-CSRFToken': csrfToken, // Подставляем CSRF токен в заголовок запроса
          'Content-Type': 'application/json',
        }
      });

      if (response.status === 204) {
        dispatch(logout());
        navigate('/login');
      }
    } catch (error) {
      console.error('Ошибка при выходе:', error);
      alert('Ошибка при выходе. Пожалуйста, попробуйте позже.');
    }
  };

  return (
    <nav className="navbar">

      {isAuthenticated ? (
        <>
          <Link to="/profile" className="navbar-link">{username}</Link>
        </>
      ) : (
          <span></span>
      )}

      <Link to="/threats" className="navbar-link">Угрозы</Link>

      {isAuthenticated ? (
        <>
          <Link to="/requests" className="navbar-link">Заявки</Link>
          <Link to="/threats" onClick={handleLogout} className="navbar-link">Выход</Link>
        </>
      ) : (
        <Link to="/login" className="navbar-link">Вход</Link>
      )}
    </nav>
  );
};

export default Navbar;
