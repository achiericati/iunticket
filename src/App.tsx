import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from './components/MainPage';
import TicketsPage from './components/TicketsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/tickets/:matchID" element={<TicketsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;