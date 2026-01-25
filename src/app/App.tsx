import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useAppContext } from '@/app/context/AppContext';
import { Registration } from '@/app/pages/Registration';
import { Login } from '@/app/pages/Login';
import { ServiceSelection } from '@/app/pages/ServiceSelection';
import { PaymentDetails } from '@/app/pages/PaymentDetails';
import { PaymentConfirmation } from '@/app/pages/PaymentConfirmation';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn } = useAppContext();
  return isLoggedIn ? <>{children}</> : <Navigate to="/login" />;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/register" />} />
      <Route path="/register" element={<Registration />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/services"
        element={
          <ProtectedRoute>
            <ServiceSelection />
          </ProtectedRoute>
        }
      />
      <Route
        path="/payment"
        element={
          <ProtectedRoute>
            <PaymentDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/confirmation"
        element={
          <ProtectedRoute>
            <PaymentConfirmation />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AppProvider>
  );
}
