import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import BookingForm from "../pages/BookingForm";
import MyHistory from "../pages/MyHistory";
import ManageBookings from "../pages/ManageBookings";
import CreateService from "../pages/CreateService";
import EditService from "../pages/EditService";
import Layout from "../components/Layout"; 

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            { path: "", element: <Home /> },
            { path: "login", element: <Login /> },
            { path: "register", element: <Register /> },
            { path: "book/:id", element: <BookingForm /> },
            { path: "my-history", element: <MyHistory /> },
            { path: "manage-bookings", element: <ManageBookings /> },
            { path: "create-service", element: <CreateService /> },
            { path: "edit-service/:id", element: <EditService /> },
        ],
    },
]);

export default router;
