import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import BookingForm from './pages/BookingForm';
import MyHistory from './pages/MyHistory';
import ManageBookings from './pages/ManageBookings';
import CreateService from './pages/CreateService';
import EditService from './pages/EditService';
import { useAuth } from './context/AuthContext';

function App() {
  const { user, loading } = useAuth();

  if (loading) return null; // Or a loading spinner

  return (
    <div className="min-h-screen bg-base-100 flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
          <Route path="/book/:id" element={user ? <BookingForm /> : <Navigate to="/login" />} />
          <Route path="/my-history" element={user ? <MyHistory /> : <Navigate to="/login" />} />
          <Route path="/manage-bookings" element={user ? <ManageBookings /> : <Navigate to="/login" />} />
          <Route
            path="/create-service"
            // Changed: Removed user.role === 'admin' check, anyone logged in can access
            element={user ? <CreateService /> : <Navigate to="/login" />}
          />
          <Route path="/edit-service/:id" element={user ? <EditService /> : <Navigate to="/login" />} />
        </Routes>
      </main>
      <footer className="footer footer-center p-4 bg-base-300 text-base-content">
        <aside>
          <p>Copyright © 2024 - All right reserved by PawPal</p>
        </aside>
      </footer>
    </div>
  );
}

export default App;
