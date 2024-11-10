import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './Navbar';
import Breadcrumbs from './Breadcrumbs';


const defaultImageUrl = '/static/network.jpg';
// Мок-данные для угроз
const mockThreats = [
  {
    pk: 1,
    threat_name: 'Угроза 1',
    description: 'Подробное описание угрозы 1.',
    detections: 5,
    price: 1500,
     img_url: defaultImageUrl
  },
  {
    pk: 2,
    threat_name: 'Угроза 2',
    description: 'Подробное описание угрозы 2.',
    detections: 3,
    price: 2000,
    img_url: defaultImageUrl
  },
  {
    pk: 3,
    threat_name: 'Угроза 3',
    description: 'Подробное описание угрозы 3.',
    detections: 10,
    price: 1200,
     img_url: defaultImageUrl
  },
];


const ThreatDescription = () => {
  const { threatId } = useParams();
  const [threat, setThreat] = useState(null);
  const [loading, setLoading] = useState(true); // Для отображения состояния загрузки
  const [error, setError] = useState(null); // Для обработки ошибок

  useEffect(() => {
    const fetchThreat = async () => {
      try {
        const response = await fetch(`http://localhost:8000/threats/detail/${threatId}/`);
        
        if (!response.ok) {
          throw new Error('Ошибка при загрузке данных');
        }

        const threatData = await response.json();
        setThreat(threatData);
      } catch (err) {
        const mockThreat = mockThreats.find(item => item.pk === parseInt(threatId, 10));
        
        if (mockThreat) {
          setThreat(mockThreat);
        } else {
          setError('Угроза не найдена');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchThreat();
  }, [threatId]);

  // Обработка состояния загрузки и ошибок
  if (loading) {
    return <div className="text-center my-5">Загрузка данных угрозы...</div>;
  }

  if (error) {
    return <div className="text-danger text-center my-5">Ошибка: {error}</div>;
  }

  // Если данные угрозы загружены
  return (
    <div className="container-fluid bg-dark text-light min-vh-100">
      {/* Шапка */}
      <header className="d-flex justify-content-between align-items-center px-5 py-3" style={{ backgroundColor: '#333', height: '70%', maxHeight: '60px', width: '1990px', marginLeft:'-30px' }}>
        <a href="/" className="text-light fs-4">Мониторинг угроз</a>
        <Navbar />
      </header>
      
      {/* Навигация */}
      <Breadcrumbs />

      <main className="container my-4">
        <div className="card bg-dark text-light border-light" style={{ height:'auto'}}>
          <div className="row g-0">
            <div className="col-md-6">
              <div className="card-body">
                <h3 className="card-title">{threat.threat_name}</h3>
                <p className="card-text">{threat.description}</p>

                <div className="mt-4">
                  <h5 className="card-title">Статистика</h5>
                  <p className="card-text">
                    Количество обнаружений: <strong>{threat.detections}</strong>
                  </p>
                  <p className="card-text">
                    Средняя цена мониторинга: <strong>{threat.price} ₽</strong>
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <img 
                src={threat.img_url || defaultImageUrl} 
                alt={threat.threat_name} 
                className="img-fluid rounded-start"  style={{ height:'210px',marginTop:'10px',marginLeft:'40%' }}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ThreatDescription;
