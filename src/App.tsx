import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Menu from './components/Menu';
import SearchFormPage from './pages/SearchForm';
import SearchHistoryPage from './pages/SearchHistory';
import FloatingWidgetList from './components/FloatingWidgetList';
import SneakerListPage from './pages/SneakerList';
import SynchronizePage from './pages/SynchronizePage';
import ProfilePage from './pages/ProfilePage';

function App() {
  return (
    <Router>
      <div style={{ display: 'flex', height: '100vh' }}>
        <Menu />
        <Routes>
          <Route path="/" element={<Navigate to="/search-form" />} />
          <Route path="/search-form" element={<SearchFormPage />} />
          <Route path="/search-history" element={<SearchHistoryPage />} />
          <Route path="/sync" element={<SynchronizePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/sneaker-list" element={<SneakerListPage />} />
        </Routes>
        <FloatingWidgetList />
      </div>
    </Router>
  );
}

export default App;