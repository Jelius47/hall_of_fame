import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import Navigation from './components/ui/Navigation';
import Home from './pages/Home';
import Create from './pages/Create';
import Gallery from './pages/Gallery';
import theme from './styles/theme';
import useAuthStore from './stores/useAuthStore';

function App() {
  const { fetchUser, isAuthenticated } = useAuthStore();

  useEffect(() => {
    // Fetch user data on app load if token exists
    if (isAuthenticated) {
      fetchUser();
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <div className="app">
          <Navigation />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<Create />} />
            <Route path="/gallery" element={<Gallery />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
