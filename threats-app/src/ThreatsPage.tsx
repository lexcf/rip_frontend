import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  setThreats,
  setFilteredThreats,
  setInputValue,
  setPriceFrom,
  setPriceTo,
  setCurrentRequestId,
  setCurrentCount,
} from './redux/threatsSlice';
import { api } from './api';
import Breadcrumbs from './Breadcrumbs';
import Navbar from './Navbar';
import Cookies from 'js-cookie';

const defaultImageUrl = '/rip_frontend/static/network.jpg';

const ThreatsPage = () => {
  const [loading, setLoading] = useState(false); // Состояние для анимации загрузки
  const [error, setError] = useState(''); // Состояние для обработки ошибок
  const {
    inputValue,
    priceFrom,
    priceTo,
    threats,
    filteredThreats,
    currentRequestId,
    currentCount,
  } = useSelector((state) => state.threats);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchThreats = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await api.threats.threatsList();
        const threatsData = response.data.filter((item) => item.pk !== undefined);
        dispatch(setThreats(threatsData));

        // Проверяем, существует ли заявка
        const requestData = response.data.find((item) => item.request);
        if (requestData?.request?.pk) {
          dispatch(setCurrentRequestId(requestData.request.pk));
          dispatch(setCurrentCount(requestData.request.threats_amount));
        } else {
          dispatch(setCurrentCount(0));
        }
      } catch (error) {
        console.error('Ошибка при загрузке данных угроз:', error);
        setError('Ошибка при загрузке данных угроз');
        dispatch(setThreats([]));
      } finally {
        setLoading(false);
      }
    };

    fetchThreats();
  }, [dispatch]);

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await api.threats.threatsList({
        name: inputValue,
        price_from: priceFrom,
        price_to: priceTo,
      });
      const filteredResult = response.data.filter((item) => item.pk !== undefined);
      dispatch(setThreats(filteredResult));
    } catch (error) {
      console.error('Ошибка при выполнении поиска:', error);
      setError('Ошибка при выполнении поиска. Используется локальный поиск.');

      const filteredLocalThreats = threats.filter((threat) => {
        const matchesName = inputValue
          ? threat.threat_name.toLowerCase().includes(inputValue.toLowerCase())
          : true;
        const matchesPriceFrom = priceFrom ? threat.price >= priceFrom : true;
        const matchesPriceTo = priceTo ? threat.price <= priceTo : true;
        return matchesName && matchesPriceFrom && matchesPriceTo;
      });

      dispatch(setThreats(filteredLocalThreats)); // Локальный поиск
    } finally {
      setLoading(false);
    }
  };

  const handleAddThreat = async (threatId) => {
    setError('');
    try {
      const csrfToken = Cookies.get('csrftoken');
      await api.threats.postThreats(threatId,{},{
        headers: {
          'X-CSRFToken':csrfToken
        }
      })
      

      // После добавления угрозы обновляем список
      const response = await api.threats.threatsList();
      const threatsData = response.data.filter((item) => item.pk !== undefined);
      dispatch(setThreats(threatsData));

      // Проверяем наличие заявки
      const requestData = response.data.find((item) => item.request);
      if (requestData?.request?.pk) {
        dispatch(setCurrentRequestId(requestData.request.pk));
        dispatch(setCurrentCount(requestData.request.threats_amount));
      }
    } catch (error) {
      console.error('Ошибка при добавлении угрозы:', error);
      setError('Ошибка при добавлении угрозы');
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
        <form onSubmit={handleSearchSubmit} className="row g-3 align-items-center">
          <div className="col">
            <input
              type="text"
              className="form-control"
              placeholder="Имя угрозы"
              value={inputValue}
              onChange={(e) => dispatch(setInputValue(e.target.value))}
            />
          </div>
          <div className="col">
            <input
              type="number"
              className="form-control"
              placeholder="Цена от"
              value={priceFrom}
              onChange={(e) => dispatch(setPriceFrom(e.target.value))}
            />
          </div>
          <div className="col">
            <input
              type="number"
              className="form-control"
              placeholder="Цена до"
              value={priceTo}
              onChange={(e) => dispatch(setPriceTo(e.target.value))}
            />
          </div>
          <div className="col-auto">
            <button type="submit" className="btn btn-success">
              Поиск
            </button>
          </div>
          <div className="col-auto">
            <button
              type="button"
              className={`btn ${currentRequestId ? 'btn-outline-success' : 'btn-outline-secondary'}`}
              style={{ marginLeft: '10px' }}
              disabled={currentRequestId == null}
              onClick={() => currentRequestId && navigate(`/requests/${currentRequestId}`)}
            >
              Текущая заявка ({currentCount})
            </button>
          </div>
        </form>
      </div>

      <div className="container">
        {loading ? (
          <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
            <div className="spinner-border text-light" role="status">
              <span className="visually-hidden">Загрузка...</span>
            </div>
          </div>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : (
          <div className="row row-cols-1 row-cols-md-3 g-4">
            {filteredThreats.map((threat) => (
              <div key={threat.pk} className="col">
                <Link to={`/description/${threat.pk}`} className="text-decoration-none">
                  <div className="card h-100 bg-dark text-light border-light">
                    <img
                      src={threat.img_url || defaultImageUrl}
                      className="card-img-top"
                      alt={threat.threat_name}
                      style={{ marginLeft: '-4%' }}
                    />
                    <div className="card-body">
                      <h5 className="card-title">{threat.threat_name}</h5>
                      <p className="card-text">{threat.short_description}</p>
                    </div>
                    <div className="card-footer text-center">
                      <button
                        className="btn btn-outline-success"
                        onClick={(e) => {
                          e.preventDefault();
                          handleAddThreat(threat.pk);
                        }}
                      >
                        Добавить
                      </button>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ThreatsPage;
