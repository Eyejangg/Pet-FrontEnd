import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import BookingForm from "../pages/BookingForm";
import MyHistory from "../pages/MyHistory";
import ManageBookings from "../pages/ManageBookings";
import CreateService from "../pages/CreateService";
import EditService from "../pages/EditService";
import Layout from "../components/Layout"; // We will create this
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

// Wrapper to check authentication for protected routes
const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

// Wrapper to redirect if already logged in
const PublicRoute = ({ children }) => {
    const { user } = useAuth();
    if (user) {
        return <Navigate to="/" replace />;
    }
    return children;
}

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            { path: "", element: <Home /> },
            { path: "login", element: <PublicRoute><Login /></PublicRoute> },
            { path: "register", element: <PublicRoute><Register /></PublicRoute> },
            { path: "book/:id", element: <ProtectedRoute><BookingForm /></ProtectedRoute> },
            { path: "my-history", element: <ProtectedRoute><MyHistory /></ProtectedRoute> },
            { path: "manage-bookings", element: <ProtectedRoute><ManageBookings /></ProtectedRoute> },
            { path: "create-service", element: <ProtectedRoute><CreateService /></ProtectedRoute> },
            { path: "edit-service/:id", element: <ProtectedRoute><EditService /></ProtectedRoute> },
        ],
    },
]);

export default router;
