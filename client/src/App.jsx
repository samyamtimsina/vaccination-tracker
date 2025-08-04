import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoutes';
import Navbar from './components/NavBar';
import { AuthProvider } from './context/AuthContext';
import './index.css'; // Assuming you have a global CSS file

import AddChild from './pages/AddChild';
import AddMother from './pages/AddMother';
import ViewChildren from './pages/ViewChildren';
import Profile from './pages/Profile.jsx';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/add-child" element={<AddChild />} />
          <Route path="/add-mother" element={<AddMother />} />
          <Route path="/view-children" element={<ViewChildren />} />
          <Route path="/profile" element={<Profile />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
