import { createBrowserRouter, Navigate } from "react-router-dom";
import Acceuil from "../pages/Acceuil";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Marketplace from "../pages/Marketplace";
import Predict from "../pages/Predict";
import Layout from "../layouts/Layout";

export const router = createBrowserRouter([
    {
        element: <Layout />,
        children: [
            {
                path: "/",
                element: <Acceuil />,
            },
            {
                path: "/Login",
                element: <Login />,
            },
            {
                path: "/Register",
                element: <Register />,
            },
            {
                path: "/Marketplace",
                element: <Marketplace />,
            },
            {
                path: "/Predict",
                element: <Predict />,
            },
            {
                path: "*",
                element: <Navigate to="/" />,
            },
        ],
    },
]);