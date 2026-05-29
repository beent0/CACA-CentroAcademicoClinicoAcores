import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';

// Import dos Custom Hooks
import { useTheme } from './hooks/useTheme';
import { useI18n } from './hooks/useI18n';
import { useAuth } from './hooks/useAuth';

// Lazy Loading para componentes administrativos e pesados
const AdminPanel = lazy(() => import('./components/AdminPanel'));

// Componente para proteger routes de administração
const ProtectedRoute = ({ children, isAdmin }) => {
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  const { theme, toggleTheme } = useTheme();
  const { lang, setLang } = useI18n();
  const { user, isAdmin, logout } = useAuth();

  return (
    <Router>
      <Header 
        theme={theme} 
        toggleTheme={toggleTheme} 
        lang={lang} 
        setLang={setLang} 
        user={user} 
        logout={logout} 
      />
      <main>
        <Suspense fallback={<div style={{ padding: '50px', textAlign: 'center' }}>A carregar...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/perfil" element={<Profile />} />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute isAdmin={isAdmin}>
                  <AdminPanel />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
