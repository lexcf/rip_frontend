import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './Navbar';
import { Carousel } from 'react-bootstrap';
import './App.css'

export default function HomePage() {
  return (
    <div className="container-fluid bg-dark text-light min-vh-100 d-flex flex-column">
      {/* Шапка */}
      <header className="d-flex justify-content-between align-items-center px-5 py-3" style={{ backgroundColor: '#333', height: '70%', maxHeight: '60px', width: '1990px', marginLeft: '-30px' }}>
        <a href="/" className="text-light fs-4">Мониторинг угроз</a>
        <Navbar />
      </header>

      {/* Основной контент */}
      <main className="flex-grow-1 d-flex flex-column align-items-center justify-content-center text-center">
        <h2 className="display-4 fw-bold">Добро пожаловать!</h2>
        <p className="lead mt-3 mb-5">
        Данный ресурс предназначен для поиска ит-угроз и формирования заявок на мониторинг выбранных ИТ-угроз <br />и включает в себя веб-сервис, веб-приложение, десктопное приложения.
        </p>
        <a href="/threats" className="btn btn-success btn-lg mb-5">Список услуг</a>

        {/* Карусель с изображениями */}
        <Carousel className="w-75" indicators={false} controls={true}>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="http://127.0.0.1:9000/static/web.jpg"
              alt="Первое изображение"
            />
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="http://127.0.0.1:9000/static/ddos.jpg"
              alt="Второе изображение"
            />
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="http://127.0.0.1:9000/static/vulnerability.jpg"
              alt="Третье изображение"
            />
          </Carousel.Item>
        </Carousel>
      </main>
    </div>
  );
}
