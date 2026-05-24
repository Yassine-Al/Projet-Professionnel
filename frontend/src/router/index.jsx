import { createBrowserRouter, Navigate } from "react-router-dom";
import Acceuil from "../pages/Acceuil";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Marketplace from "../pages/Marketplace";
import Predict from "../pages/Predict";
import CarDetails from "../pages/CarDetails";
import SellYourCar from "../pages/SellYourCar";
import Layout from "../layouts/Layout";

export const User_Dashboard = '/User/dashboard';

export const router = createBrowserRouter([
    {
        element: <Layout />,
        children: [
            { path: "/",               element: <Acceuil /> },
            { path: "/Login",          element: <Login /> },
            { path: "/Register",       element: <Register /> },
            { path: "/Marketplace",    element: <Marketplace /> },
            { path: "/Predict",        element: <Predict /> },
            { path: "/sell",           element: <SellYourCar /> },
            { path: "/cars/:id",       element: <CarDetails /> },
            { path: "/User/Dashboard", element: <p style={{ padding: 40, fontFamily: "Manrope,sans-serif" }}>Tableau de bord utilisateur — à venir.</p> },
            { path: "*",               element: <Navigate to="/" /> },
        ],
    },
]);