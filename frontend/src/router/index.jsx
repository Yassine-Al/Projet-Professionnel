import { createBrowserRouter, Navigate } from "react-router-dom";
import Acceuil from "../pages/Acceuil";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Marketplace from "../pages/Marketplace";
import Predict from "../pages/Predict";
import CarDetails from "../pages/CarDetails";
import SellYourCar from "../pages/SellYourCar";
import Messages from "../pages/Messages";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import Layout from "../layouts/Layout";
import AdminLayout from "../layouts/AdminLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminAnnonces from "../pages/admin/AdminAnnonces";
import AdminUsers from "../pages/admin/AdminUsers";

export const User_Dashboard = '/User/dashboard';

function RequireAuth({ children, redirect = "/sell" }) {
    const token = localStorage.getItem("token");
    if (!token) return <Navigate to={`/Login?redirect=${redirect}`} replace />;
    return children;
}

export const router = createBrowserRouter([
    // ── Main site (with navbar + footer) ──────────────────────────
    {
        element: <Layout />,
        children: [
            { path: "/",               element: <Acceuil /> },
            { path: "/Login",            element: <Login /> },
            { path: "/Register",         element: <Register /> },
            { path: "/forgot-password",  element: <ForgotPassword /> },
            { path: "/reset-password",   element: <ResetPassword /> },
            { path: "/Marketplace",    element: <Marketplace /> },
            { path: "/Predict",        element: <Predict /> },
            { path: "/sell",           element: <RequireAuth redirect="/sell"><SellYourCar /></RequireAuth> },
            { path: "/cars/:id",       element: <CarDetails /> },
            { path: "/messages",       element: <Messages /> },
            { path: "/User/Dashboard", element: <p style={{ padding: 40, fontFamily: "Manrope,sans-serif" }}>Tableau de bord utilisateur — à venir.</p> },
        ],
    },

    // ── Admin panel (separate layout, no navbar/footer) ────────────
    {
        element: <AdminLayout />,
        children: [
            { path: "/admin",          element: <AdminDashboard /> },
            { path: "/admin/annonces", element: <AdminAnnonces /> },
            { path: "/admin/users",    element: <AdminUsers /> },
        ],
    },

    { path: "*", element: <Navigate to="/" /> },
]);
