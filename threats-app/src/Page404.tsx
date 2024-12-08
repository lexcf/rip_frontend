// src/Page404.js
import React from 'react';
import { Link } from 'react-router-dom';

const Page404 = () => {
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
      </header>

      <div className="container my-4 text-center">
        <h1 className="display-4 text-warning">404 - Страница не найдена</h1>
        <p className="lead">Запрашиваемая страница не существует или была удалена.</p>
        <Link to="/" className="btn btn-primary">Вернуться на главную</Link>
      </div>
    </div>
  );
};

export default Page404;
