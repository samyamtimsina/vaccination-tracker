import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoutes';
import { AuthProvider } from './context/AuthContext';
import { ChildProvider } from './context/ChildContext';
import { MotherProvider } from './context/motherContext.jsx';
import './index.css';
import AddChild from './pages/AddChild';
import AddMother from './pages/AddMother';
import ViewChildren from './pages/ViewChildren';
import ViewMothers from './pages/ViewMothers.jsx';
import Profile from './pages/Profile.jsx';
import Graph from './pages/Graph.jsx';
import Layout from './components/Layout.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
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


// A simple layout component that includes the navbar
const MainLayout = () => {
  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <ChildProvider>
          <MotherProvider>
            {' '}
            <BrowserRouter>
              <Routes>
                {/* Login route has no navbar */}
                <Route path="/login" element={<Login />} />
                <Route path="/verify-otp" element={<VerifyOTP />} />

                {/* These routes will use the MainLayout, which includes the Navbar */}
                <Route element={<MainLayout />}>
                  <Route path="/" element={<Home />} />

                </Route>

                <Route element={<ProtectedRoute><SuperAdminLayout /></ProtectedRoute>}>
                  <Route path="/super-admin/dashboard" element={<SuperAdminDashboard />} />
                  <Route path="/super-admin/users" element={<UsersManagementPage />} />
                  {/* <Route path="/super-admin/children" element={<ChildrenPage />} /> */}
                  {/* <Route path="/super-admin/mothers" element={<MothersPage />} /> */}
                  <Route path="/super-admin/analytics" element={<AnalyticsPage />} />
                </Route>

                {/* Nested protected routes within the main layout */}
                <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                  <Route path="/users/:userId" element={<UserProfile />} />
                  <Route path="/dashboard" element={<RoleBasedRedirect />} />
                  <Route path="/add-child" element={<AddChild />} />
                  <Route path="/edit-child" element={<EditChild />} />
                  <Route path="/add-mother" element={<AddMother />} />
                  <Route path="/view-children" element={<ViewChildren />} />
                  <Route path="/view-mothers" element={<ViewMothers />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/graph" element={<Graph />} />
                  <Route path="/print" element={<PrintCardWrapper />} />
                </Route>

              </Routes>
            </BrowserRouter>
          </MotherProvider>
        </ChildProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;