import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Jobs from './pages/Jobs';
import AddJob from './pages/AddJob';
import EditJob from './pages/EditJob';
import Candidates from './pages/Candidates';
import AddCandidate from './pages/AddCandidate';
import EditCandidate from './pages/EditCandidate';
import CandidateDetail from './pages/CandidateDetail';

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <div className="flex min-h-screen bg-gray-50">
          <Sidebar />
          <div className="flex-1 md:ml-0">
            <Header />
            <main className="p-4 md:p-6 pt-16 md:pt-6">
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/jobs" element={<Jobs />} />
                <Route path="/jobs/add" element={<AddJob />} />
                <Route path="/jobs/edit/:id" element={<EditJob />} />
                <Route path="/candidates" element={<Candidates />} />
                <Route path="/candidates/add" element={<AddCandidate />} />
                <Route path="/candidates/edit/:id" element={<EditCandidate />} />
                <Route path="/candidates/:id" element={<CandidateDetail />} />
              </Routes>
            </main>
          </div>
        </div>
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
