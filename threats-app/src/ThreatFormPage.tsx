import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from './api';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import Breadcrumbs from './Breadcrumbs';

const ThreatFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [threat, setThreat] = useState({
    threat_name: '',
    company_name: '',
    short_description: '',
    description: '',
    status: 'active',
    img_url: '',
    price: 0,
    detections: 0,
  });
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      const fetchThreat = async () => {
        setLoading(true);
        try {
          const response = await api.threats.detailDetail(id);
          setThreat(response.data);
        } catch (err) {
          console.error('Ошибка при загрузке угрозы:', err);
          setError('Не удалось загрузить данные угрозы.');
        } finally {
          setLoading(false);
        }
      };

      fetchThreat();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setThreat((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (id) {
        // Редактирование
        await api.threats.detailUpdate(id, threat, {
          headers: { 'X-CSRFToken': Cookies.get('csrftoken') },
        });
      } else {
        // Создание
        await api.threats.detailCreate(threat, {
          headers: { 'X-CSRFToken': Cookies.get('csrftoken') },
        });
      }
      navigate('/moderator/threats');
    } catch (err) {
      console.error('Ошибка при сохранении угрозы:', err);
      setError('Не удалось сохранить данные. Проверьте введенные данные.');
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
      <h2>{id ? 'Редактировать угрозу' : 'Создать новую угрозу'}</h2>
      {loading ? (
        <div>Загрузка...</div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-dark text-light p-4 rounded">
          {error && <div className="alert alert-danger">{error}</div>}
          <div className="mb-3">
            <label htmlFor="threat_name" className="form-label">Название угрозы</label>
            <input
              type="text"
              id="threat_name"
              name="threat_name"
              value={threat.threat_name}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="company_name" className="form-label">Компания</label>
            <input
              type="text"
              id="company_name"
              name="company_name"
              value={threat.company_name}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="short_description" className="form-label">Краткое описание</label>
            <input
              type="text"
              id="short_description"
              name="short_description"
              value={threat.short_description}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="form-label">Описание</label>
            <textarea
              id="description"
              name="description"
              value={threat.description}
              onChange={handleChange}
              className="form-control"
              rows="4"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="img_url" className="form-label">URL изображения</label>
            <input
              type="text"
              id="img_url"
              name="img_url"
              value={threat.img_url}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="price" className="form-label">Цена</label>
            <input
              type="number"
              id="price"
              name="price"
              value={threat.price}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="detections" className="form-label">Обнаружений в год</label>
            <input
              type="number"
              id="detections"
              name="detections"
              value={threat.detections}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <button type="submit" className="btn btn-primary">{id ? 'Сохранить изменения' : 'Создать угрозу'}</button>
        </form>
      )}
    </div>
  );
};

export default ThreatFormPage;
