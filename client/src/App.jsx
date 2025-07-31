import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard'; // placeholder
import PrivateRoute from './auth/PrivateRoute';
import { AuthProvider } from './auth/AuthContext';
import { store } from './redux/store.js';
import { Provider } from 'react-redux';
import AddCitizen from './pages/AddCitizen.jsx';

function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/citizens"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/addRecord"
              element={
                <PrivateRoute>
                  <AddCitizen />
                </PrivateRoute>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </Provider>
  );
}

export default App;
