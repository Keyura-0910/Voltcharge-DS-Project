import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { EVDataProvider } from './context/EVDataContext';
import { WebSocketProvider } from './context/WebSocketContext';
import { MainLayout } from './components/layout/MainLayout';

// Auth Pages
import { DriverLogin } from './pages/auth/DriverLogin';
import { DriverSignup } from './pages/auth/DriverSignup';
import { OperatorLogin } from './pages/auth/OperatorLogin';
import { OperatorSignup } from './pages/auth/OperatorSignup';
import { AdminLogin } from './pages/auth/AdminLogin';

// Customer Pages
import { CustomerDashboard } from './pages/customer/Dashboard';
import { FindCharger } from './pages/customer/FindCharger';
import { StationDetails } from './pages/customer/StationDetails';
import { BookingExperience } from './pages/customer/BookingExperience';
import { QueueExperience } from './pages/customer/QueueExperience';
import { LiveCharging } from './pages/customer/LiveCharging';
import { MyBookings } from './pages/customer/MyBookings';
import { Payments } from './pages/customer/Payments';
import { RouteRecommendation } from './pages/customer/RouteRecommendation';
import { Vehicles } from './pages/customer/Vehicles';
import { Notifications } from './pages/customer/Notifications';
import { Profile } from './pages/customer/Profile';

// Operator Pages
import { OperatorOverview } from './pages/operator/OperatorOverview';
import { MaintenanceUI } from './pages/operator/MaintenanceUI';
import { StationsManage } from './pages/operator/StationsManage';
import { ChargersManage, SessionsManage, AlertsManage } from './pages/operator/ChargersManage';

// Admin Pages
import { AdminOverview } from './pages/admin/AdminOverview';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <EVDataProvider>
        <WebSocketProvider>
          <Router>
            <Routes>
              {/* Standalone Authentication Portals */}
              <Route path="/driver/login" element={<DriverLogin />} />
              <Route path="/driver/signup" element={<DriverSignup />} />
              <Route path="/operator/login" element={<OperatorLogin />} />
              <Route path="/operator/signup" element={<OperatorSignup />} />
              <Route path="/admin/login" element={<AdminLogin />} />

              {/* Legacy redirect helpers */}
              <Route path="/login" element={<Navigate to="/driver/login" replace />} />

              {/* Scoped Role Portals with Layout */}
              <Route
                path="/*"
                element={
                  <MainLayout>
                    <Routes>
                      {/* Driver App Routes */}
                      <Route path="/dashboard" element={<CustomerDashboard />} />
                      <Route path="/driver/dashboard" element={<CustomerDashboard />} />
                      <Route path="/find-charger" element={<FindCharger />} />
                      <Route path="/stations/:id" element={<StationDetails />} />
                      <Route path="/book" element={<BookingExperience />} />
                      <Route path="/queue" element={<QueueExperience />} />
                      <Route path="/charging" element={<LiveCharging />} />
                      <Route path="/bookings" element={<MyBookings />} />
                      <Route path="/payments" element={<Payments />} />
                      <Route path="/route" element={<RouteRecommendation />} />
                      <Route path="/vehicles" element={<Vehicles />} />
                      <Route path="/notifications" element={<Notifications />} />
                      <Route path="/profile" element={<Profile />} />

                      {/* Operator Portal Routes */}
                      <Route path="/operator/overview" element={<OperatorOverview />} />
                      <Route path="/operator/stations" element={<StationsManage />} />
                      <Route path="/operator/chargers" element={<ChargersManage />} />
                      <Route path="/operator/sessions" element={<SessionsManage />} />
                      <Route path="/operator/maintenance" element={<MaintenanceUI />} />
                      <Route path="/operator/alerts" element={<AlertsManage />} />

                      {/* Admin Portal Routes */}
                      <Route path="/admin/overview" element={<AdminOverview />} />

                      {/* Fallback */}
                      <Route path="*" element={<Navigate to="/driver/login" replace />} />
                    </Routes>
                  </MainLayout>
                }
              />
            </Routes>
          </Router>
        </WebSocketProvider>
      </EVDataProvider>
    </AuthProvider>
  );
};

export default App;
