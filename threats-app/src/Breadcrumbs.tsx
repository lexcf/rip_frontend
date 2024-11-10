import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import './App.css'; // Импортируем стили для breadcrumbs

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x && x !== 'null'); // Убираем пустые элементы и 'null'

  const breadcrumbsMapping = {
    '': 'Главная',
    'threats': 'Угрозы',
    'requests': 'Заявки',
    'description': 'Описание'
  };

  return (
    <nav className="breadcrumbs">
      <span style={{ color: '#00A88E' }}>Главная</span>
      {pathnames.map((pathname, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;

        // Проверяем, является ли pathname числом или равен 'null'
        const isNumber = !isNaN(pathname) || pathname === 'null';

        // Если это число или 'null', пропускаем
        if (isNumber) return null;

        const isLast = index === pathnames.length - 1;

        return (
          <span key={routeTo}>
            {'>'} {/* Разделитель */}
            {(
              <span style={{ color: '#00A88E' }}> {/* Некликаемый элемент с тем же цветом */}
                {breadcrumbsMapping[pathname] || pathname}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;
