import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import OfflineSyncManager from "./components/OfflineSyncManager";
import Home from "./pages/Home";
import AdminLogin from "./pages/AdminLogin";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Sales from "./pages/Sales";
import Purchases from "./pages/Purchases";
import Suppliers from "./pages/Suppliers";
import Reports from "./pages/Reports";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";

import ProtectedAdminRoute from "./components/ProtectedAdminRoute";

import { TranslationProvider } from "./context/TranslationContext";
import { NotificationProvider } from "./context/NotificationContext";

function App() {
  return (
    <TranslationProvider>
      <BrowserRouter>
          <OfflineSyncManager />
            <Routes>

          <Route path="/" element={<Home />} />

          <Route path="/admin/login" element={<AdminLogin />} />

          <Route element={<ProtectedAdminRoute />}>
            <Route
              element={
                <NotificationProvider>
                  <MainLayout />
                </NotificationProvider>
              }
            >

              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/products" element={<Products />} />
              <Route path="/sales" element={<Sales />} />
              <Route path="/purchases" element={<Purchases />} />
              <Route path="/suppliers" element={<Suppliers />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/profile" element={<Profile />} />

            </Route>
          </Route>

        </Routes>
      </BrowserRouter>
    </TranslationProvider>
  );
}

export default App;