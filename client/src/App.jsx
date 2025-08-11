import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoutes';
import { AuthProvider } from './context/AuthContext';
import './index.css';
import AddChild from './pages/AddChild';
import AddMother from './pages/AddMother';
import ViewChildren from './pages/ViewChildren';
import ViewMothers from './pages/ViewMothers.jsx';
import Profile from './pages/Profile.jsx';
import Layout from './components/Layout.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import PrintCardWrapper from './components/printdata.jsx';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route element={<Layout />}>
              <Route
                path="/add-child"
                element={
                  <ProtectedRoute>
                    <AddChild />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/add-mother"
                element={
                  <ProtectedRoute>
                    <AddMother />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/view-children"
                element={
                  <ProtectedRoute>
                    <ViewChildren />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/view-mothers"
                element={
                  <ProtectedRoute>
                    <ViewMothers />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route path="/print" element={<PrintCardWrapper />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
