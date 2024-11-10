import React, { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setThreats, setFilteredThreats, setInputValue, setPriceFrom, setPriceTo, setCurrentRequestId, setCurrentCount } from './redux/threatsSlice';
import Breadcrumbs from './Breadcrumbs';
import Navbar from './Navbar';

const defaultImageUrl = '/static/network.jpg';

const ThreatsPage = () => {
  const { inputValue, priceFrom, priceTo, threats, filteredThreats, currentRequestId, currentCount } = useSelector((state) => state.threats);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchThreats = async () => {
      try {
        const response = await fetch('/api/threats/');
        const threatsData = await response.json();
        const filteredData = threatsData.filter(item => item.pk !== undefined);
        const requestData = threatsData.find(item => item.request);
        dispatch(setThreats(filteredData));
        dispatch(setCurrentRequestId(requestData?.request?.pk || null));
        dispatch(setCurrentCount(requestData?.request?.threats_amount || 0));
      } catch (error) {
        console.error('Ошибка при загрузке данных угроз:', error);
        dispatch(setThreats([]));
      }
    };
    fetchThreats();
  }, [dispatch]);

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/threats/?name=${inputValue}&price_from=${priceFrom}&price_to=${priceTo}`);
      const result = await response.json();
      //const filteredResult = result.filter(item => item.pk !== undefined);
      dispatch(setFilteredThreats(filteredResult));
    } catch (error) {
      console.error('Ошибка при выполнении поиска:', error);
    }
  };

  const handleAddThreat = async (threatId) => {
    try {
      const response = await fetch('/add_threat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ threat_id: threatId }),
      });
      if (response.ok) alert('Угроза добавлена');
      else alert('Ошибка при добавлении угрозы');
    } catch (error) {
      console.error('Ошибка при добавлении угрозы:', error);
    }
  };

  return (
    <div className="container-fluid bg-dark text-light min-vh-100">
      <header className="d-flex justify-content-between align-items-center px-5 py-3" style={{ backgroundColor: '#333', height: '70%', maxHeight: '60px', width: '1990px', marginLeft:'-30px' }}>
        <a href="/" className="text-light fs-4">Мониторинг угроз</a>
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
            <button type="submit" className="btn btn-success">Поиск</button>
          </div>
          <div className="col-auto">
            <a
              href={`/requests/${currentRequestId}`}
              className="btn btn-outline-success"
              style={{ marginLeft: '10px' }}
            >
              Текущая заявка ({currentCount})
            </a>
          </div>
        </form>
      </div>

      <div className="container">
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
      </div>
    </div>
  );
};

export default ThreatsPage;
