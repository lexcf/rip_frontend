import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Breadcrumbs from './Breadcrumbs';
import { api } from './api';
import Cookies from 'js-cookie';

const ModeratorThreatsPage = () => {
  const [threats, setThreats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchThreats = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await api.threats.threatsList();
        const threatIds = response.data.filter((item) => item.pk !== undefined);

        const fullThreats = await Promise.all(
          threatIds.map((threat) => api.threats.detailDetail(threat.pk))
        );

        setThreats(fullThreats.map((res) => res.data));
      } catch (error) {
        console.error('Ошибка при загрузке угроз:', error);
        setError('Ошибка при загрузке угроз');
      } finally {
        setLoading(false);
      }
    };

    fetchThreats();
  }, []);

  const handleDeleteThreat = async (pk) => {
    try {
      await api.threats.detailDelete(pk, {
        headers: { 'X-CSRFToken': Cookies.get('csrftoken') },
      });
      setThreats(threats.filter((threat) => threat.pk !== pk));
    } catch (error) {
      console.error('Ошибка при удалении угрозы:', error);
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
        <h2 className="mb-4">Список угроз</h2>

        {loading ? (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: '300px' }}
          >
            <div className="spinner-border text-light" role="status">
              <span className="visually-hidden">Загрузка...</span>
            </div>
          </div>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : (
          <div className="row">
            {threats.map((threat) => (
              <div className="col-12 mb-3" key={threat.pk}>
              <div className="card bg-dark text-light" style={{ maxHeight: '300px', display: 'flex', flexDirection: 'row' }}>
                {/* Текстовая часть карточки */}
                <div className="card-body" style={{ flex: 1, paddingRight: '160px', wordWrap: 'break-word' }}>
                  <h5 className="card-title">{threat.threat_name}</h5>
                  <p className="card-text">
                    <strong>Компания:</strong> {threat.company_name}
                    <br />
                    <strong>Описание:</strong> {threat.description}
                    <br />
                    <strong>Короткое описание:</strong> {threat.short_description}
                    <br />
                    <strong>URL картинки: </strong> {threat.img_url}
                    <br />
                    <strong>Цена:</strong> {threat.price} ₽
                    <br />
                    <strong>Обнаружений в год: </strong> {threat.detections}
                    <br />
                  </p>
                  <Link
                    to={`/moderator/threats/edit/${threat.pk}`}
                    className="btn btn-warning me-2"
                  >
                    Редактировать
                  </Link>
                  <button
                    onClick={() => handleDeleteThreat(threat.pk)}
                    className="btn btn-danger"
                  >
                    Удалить
                  </button>
                </div>
            
                {/* Изображение угрозы */}
                <div style={{ width: '270px', height: '270px', marginRight: '20px', marginTop: 'auto', marginBottom: 'auto' }}>
                  <img
                    src={threat.img_url}
                    alt={threat.threat_name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                    }}
                  />
                </div>
              </div>
            </div>
            
            ))}
          </div>
        )}

        <div className="mt-4">
          <Link to="/moderator/threats/new" className="btn btn-primary">
            Добавить новую угрозу
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ModeratorThreatsPage;
