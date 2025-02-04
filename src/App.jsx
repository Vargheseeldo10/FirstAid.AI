import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import FirstAid from './pages/FirstAid';
import InjuryDetection from './pages/InjuryDetection';
import NearbyHospitals from './pages/NearbyHospitals';
import Chat from './pages/Chat';
import Login from './pages/Login';
import { AuthProvider } from './context/AuthContext';
import { FirebaseProvider } from './context/FirebaseContext';
import { InjuryClassificationProvider } from './components/InjuryClassificationContext'; // Add this import

function App() {
  return (
    <FirebaseProvider>
      <AuthProvider>
        <InjuryClassificationProvider> {/* Wrap routes with this provider */}
          <Router>
            <div className="min-h-screen bg-gray-50">
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/first-aid" element={<FirstAid />} />
                <Route path="/injury-detection" element={<InjuryDetection />} />
                <Route path="/nearby-hospitals" element={<NearbyHospitals />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/login" element={<Login />} />
              </Routes>
            </div>
          </Router>
        </InjuryClassificationProvider>
      </AuthProvider>
    </FirebaseProvider>
  );
}

export default App;