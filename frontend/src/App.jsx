import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box, Typography, Container } from '@mui/material';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Prediction from './pages/Prediction';
import History from './pages/History';
import About from './pages/About';

function App() {
  return (
    <Router>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
        <Navbar />

        <Box component="main" sx={{ flexGrow: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/predict" element={<Prediction />} />
            <Route path="/history" element={<History />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </Box>

        {/* Professional Footer */}
        <Box component="footer" sx={{ py: 3, px: 2, mt: 'auto', backgroundColor: '#0f172a', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <Container maxWidth="lg">
            <Typography variant="body2" sx={{ color: '#94a3b8', textAlign: 'center' }}>
              © {new Date().getFullYear()} LoanGuard — Loan Default Prediction System. Powered by FastAPI & Logistic Regression ML Pipeline.
            </Typography>
          </Container>
        </Box>
      </Box>
    </Router>
  );
}

export default App;
