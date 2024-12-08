import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import Breadcrumbs from './Breadcrumbs';
import { api } from './api';
import Cookies from 'js-cookie';

const ModeratorThreatsPage = () => {
  const [threats, setThreats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingThreat, setEditingThreat] = useState(null);
  const [newThreat, setNewThreat] = useState({
    threat_name: '',
    company_name: '',
    short_description: '',
    description: '',
    status: 'active',
    img_url: '',
    price: 0,
    detections: 0,
  });

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

  const handleAddThreat = async () => {
    try {
      const response = await api.threats.detailCreate(newThreat, {headers: {'X-CSRFToken':Cookies.get('csrftoken')}});
      setThreats([...threats, response.data]);
      setNewThreat({
        threat_name: '',
        company_name: '',
        short_description: '',
        description: '',
        status: '',
        img_url: '',
        price: 0,
        detections: 0,
      });
    } catch (error) {
      console.error('Ошибка при добавлении угрозы:', error);
    }
  };

  const handleEditThreat = (threat) => {
    setEditingThreat(threat);
  };

  const handleSaveEdit = async () => {
    try {
      const response = await api.threats.detailUpdate(editingThreat.pk, editingThreat, {headers: {'X-CSRFToken':Cookies.get('csrftoken')}});
      setThreats(
        threats.map((threat) =>
          threat.pk === editingThreat.pk ? response.data : threat
        )
      );
      setEditingThreat(null);
    } catch (error) {
      console.error('Ошибка при редактировании угрозы:', error);
    }
  };

  const handleDeleteThreat = async (pk) => {
    try {
      await api.threats.detailDelete(pk, {headers: {'X-CSRFToken':Cookies.get('csrftoken')}});
      setThreats(threats.filter((threat) => threat.pk !== pk));
    } catch (error) {
      console.error('Ошибка при удалении угрозы:', error);
    }
  };

  return (
    <div className="container-fluid bg-dark text-light min-vh-100">
      <header className="d-flex justify-content-between align-items-center px-5 py-3 site-header" style={{ backgroundColor: '#333', height: '70%', maxHeight: '60px', width: '1990px', marginLeft: '-30px' }}>
        <Link to="/" className="text-light fs-4 header-text">Мониторинг угроз</Link>
        <Navbar />
      </header>

      <Breadcrumbs />

      <div className="container my-4">
        <h2 className="mb-4">Список услуг</h2>

        {loading ? (
          <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
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
                
                    {editingThreat && editingThreat.pk === threat.pk ? (
                      <>
                      <div className="card bg-dark text-light" style={{ minHeight: '150px' }}>
                      <div className="card-body">
                        <input
                          type="text"
                          value={editingThreat.threat_name}
                          placeholder='Название угрозы'
                          onChange={(e) =>
                            setEditingThreat({
                              ...editingThreat,
                              threat_name: e.target.value,
                            })
                          }
                          className="form-control mb-2"
                        />
                        <input
                          type="text"
                          value={editingThreat.company_name}
                          placeholder='Имя компании'
                          onChange={(e) =>
                            setEditingThreat({
                              ...editingThreat,
                              company_name: e.target.value,
                            })
                          }
                          className="form-control mb-2"
                        />
                        <textarea
                          value={editingThreat.description}
                          placeholder='Описание'
                          onChange={(e) =>
                            setEditingThreat({
                              ...editingThreat,
                              description: e.target.value,
                            })
                          }
                          className="form-control mb-2"
                        />
                        <input
                          type="text"
                          value={editingThreat.short_description}
                          placeholder='Короткое описание'
                          onChange={(e) =>
                            setEditingThreat({
                              ...editingThreat,
                              short_description: e.target.value,
                            })
                          }
                          className="form-control mb-2"
                        />
                        <input
                          type="text"
                          value={editingThreat.img_url}
                          placeholder='URL картинки'
                          onChange={(e) =>
                            setEditingThreat({
                              ...editingThreat,
                              img_url: e.target.value,
                            })
                          }
                          className="form-control mb-2"
                        />

                        <input
                          type="text"
                          value={editingThreat.price}
                          placeholder='Стоимость'
                          onChange={(e) =>
                            setEditingThreat({
                              ...editingThreat,
                              price: e.target.value,
                            })
                          }
                          className="form-control mb-2"
                        />

                        <input
                          type="text"
                          value={editingThreat.detections}
                          placeholder='Обнаружений в год'
                          onChange={(e) =>
                            setEditingThreat({
                              ...editingThreat,
                              detections: e.target.value,
                            })
                          }
                          className="form-control mb-2"
                        />

                        <button
                          onClick={handleSaveEdit}
                          className="btn btn-success me-2"
                        >
                          Сохранить
                        </button>
                        <button
                          onClick={() => setEditingThreat(null)}
                          className="btn btn-secondary"
                        >
                          Отмена
                        </button>
                        </div>
                        </div>
                      </>
                    ) : (
                      <>
                      <div className="card bg-dark text-light" style={{ maxHeight: '300px' }}>
                      <div className="card-body">
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
                        <button
                          onClick={() => handleEditThreat(threat)}
                          className="btn btn-warning me-2"
                        >
                          Редактировать
                        </button>
                        <button
                          onClick={() => handleDeleteThreat(threat.pk)}
                          className="btn btn-danger"
                        >
                          Удалить
                        </button>
                        </div>
                        </div>

                      </>
                    )}
                  </div>
            ))}
          </div>
        )}

        <div className="mt-4">
          <h3>Добавить новую услугу</h3>
          <div className="card bg-dark text-light p-3">
            <input
              type="text"
              placeholder="Название угрозы"
              value={newThreat.threat_name}
              onChange={(e) =>
                setNewThreat({ ...newThreat, threat_name: e.target.value })
              }
              className="form-control mb-2"
            />

            <input
              type="text"
              placeholder="Компания"
              value={newThreat.company_name}
              onChange={(e) =>
                setNewThreat({ ...newThreat, company_name: e.target.value })
              }
              className="form-control mb-2"
            />

            <textarea
              placeholder="Описание"
              value={newThreat.description}
              onChange={(e) =>
                setNewThreat({
                  ...newThreat,
                  description: e.target.value,
                })
              }
              className="form-control mb-2"
            />

            <input
              type="text"
              placeholder="Краткое описание"
              value={newThreat.short_description}
              onChange={(e) =>
                setNewThreat({ ...newThreat, short_description: e.target.value })
              }
              className="form-control mb-2"
            />

            <input
              type="text"
              placeholder="URL картинки"
              value={newThreat.img_url}
              onChange={(e) =>
                setNewThreat({ ...newThreat, img_url: e.target.value })
              }
              className="form-control mb-2"
            />

            <input
              type="text"
              placeholder="Стоимость"
              value={newThreat.price}
              onChange={(e) =>
                setNewThreat({ ...newThreat, price: e.target.value })
              }
              className="form-control mb-2"
            />

            <input
              type="text"
              placeholder="Обнаружений в год"
              onChange={(e) =>
                setNewThreat({ ...newThreat, detections: e.target.value })
              }
              className="form-control mb-2"
            />
            <button onClick={handleAddThreat} className="btn btn-primary">
              Добавить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModeratorThreatsPage;
