import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoutes';

import { AuthProvider } from './context/AuthContext';
import { ChildProvider } from './context/ChildContext';
import { MotherProvider } from './context/MotherContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { VaccineScheduleProvider } from './context/VaccineScheduleContext.jsx';

import './index.css';

import AddChild from './pages/AddChild';
import Analytics from './pages/Analytics.jsx';
import AddMother from './pages/AddMother';
import ViewChildren from './pages/ViewChildren';
import ViewMothers from './pages/ViewMothers.jsx';
import Profile from './pages/Profile.jsx';
import Graph from './pages/Graph.jsx';
import Layout from './components/Layout.jsx';
import PrintCardWrapper from './components/printdata.jsx';
import Navbar from './components/NavBar.jsx';

import { Outlet } from 'react-router-dom';

import "./i18n";

import UserProfile from './pages/userProfile.jsx';
import EditChild from './pages/EditChild.jsx';
import VerifyOTP from './components/VerifyOTP.jsx';
import RoleBasedRedirect from './components/RoleBasedRedirect.jsx';
import SuperAdminDashboard from './components/Dashboards/SuperAdminDashboard.jsx';
import SuperAdminLayout from './components/SuperAdminLayout.jsx';
import UsersManagementPage from './components/UsersManagement.jsx';
import AnalyticsPage from './components/SuperAdminAnalytics.jsx';
import AdminDashboard from './components/Dashboards/AdminDashboard.jsx';
import Schedule from './components/Schedule.jsx'
import NotFound from './pages/NotFound.jsx';


const MainLayout = () => (
  <div>
    <Navbar />
    <Outlet />
  </div>
);

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <VaccineScheduleProvider>
          <ChildProvider>
            <MotherProvider>
              <BrowserRouter>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/verify-otp" element={<VerifyOTP />} />

                  {/* Main layout routes (any logged-in user) */}
                  <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
                    <Route path="/" element={<Home />} />
                    <Route path="/dashboard" element={<RoleBasedRedirect />} />
                  </Route>

                  {/* Super Admin routes */}
                  <Route element={<ProtectedRoute allowedRoles={['SUPER_ADMIN']}><SuperAdminLayout /></ProtectedRoute>}>
                    <Route path="/super-admin/dashboard" element={<SuperAdminDashboard />} />
                    <Route path="/super-admin/users" element={<UsersManagementPage />} />
                    <Route path="/super-admin/analytics" element={<AnalyticsPage />} />
                    <Route path="/super-admin/schedule" element={<Schedule />} />
                  </Route>

                  {/* Admin dashboard (read-only) */}
                  <Route element={<ProtectedRoute allowedRoles={['ADMIN']}><Layout /></ProtectedRoute>}>
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    <Route path="/admin/schedule" element={<Schedule />} />
                  </Route>

                  {/* Add/Edit routes (Super Admin + Ward Officer) */}
                  <Route element={<ProtectedRoute allowedRoles={['SUPER_ADMIN', 'WARD_OFFICER']}><Layout /></ProtectedRoute>}>
                    <Route path="/add-child" element={<AddChild />} />
                    <Route path="/edit-child" element={<EditChild />} />
                    <Route path="/add-mother" element={<AddMother />} />
                    <Route path="/analytics" element={<Analytics />} />
                  </Route>

                  {/* View routes (All roles) */}
                  <Route element={<ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN', 'WARD_OFFICER']}><Layout /></ProtectedRoute>}>
                    <Route path="/view-children" element={<ViewChildren />} />
                    <Route path="/view-mothers" element={<ViewMothers />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/graph" element={<Graph />} />
                    <Route path="/print" element={<PrintCardWrapper />} />
                    <Route path="/user/:userId" element={<UserProfile />} />
                  </Route>

                  {/* Ward Officer dashboard */}
                  <Route element={<ProtectedRoute allowedRoles={['WARD_OFFICER']}><Layout /></ProtectedRoute>}>
                    <Route path="/ward-officer/dashboard" element={<Dashboard />} />
                  </Route>

                  {/* Catch-all 404 for logged-in users */}
                  <Route element={<ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN', 'WARD_OFFICER']}><Layout /></ProtectedRoute>}>
                    <Route path="*" element={<NotFound />} />
                  </Route>

                  {/* Optional: Catch-all 404 for public routes (not logged-in) */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </MotherProvider>
          </ChildProvider>
        </VaccineScheduleProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;