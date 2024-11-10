import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './Navbar';

export default function HomePage() {
  return (
    <div className="container-fluid bg-dark text-light min-vh-100 d-flex flex-column">
      {/* Шапка */}
      <header className="d-flex justify-content-between align-items-center px-5 py-3" style={{ backgroundColor: '#333', height: '70%', maxHeight: '60px', width: '1990px', marginLeft:'-30px' }}>
        <a href="/" className="text-light fs-4">Мониторинг угроз</a>
        <Navbar />
      </header>

      {/* Основной контент */}
      <main className="flex-grow-1 d-flex flex-column align-items-center justify-content-center text-center">
        <h2 className="display-4 fw-bold">Добро пожаловать!</h2>
        <p className="lead mt-3 mb-5">
          Данный ресурс предназначен для мониторинга событий безопасности в компании.
        </p>
        <a href="/threats" className="btn btn-success btn-lg">Список услуг</a>
      </main>
    </div>
  );
}
