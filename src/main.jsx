import React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import Home from "./Home/Home.jsx";
import AuthProvider from "./providers/AuthProvider.jsx";
import ErrorPage from "./ErrorPage.jsx";
import Login from "./authPages/Login.jsx";
import Register from "./authPages/Register.jsx";
import PrivateRoute from "./routes/PrivateRoute.jsx";
import Task from "./Home/Task.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      {
        path: "/task",
        element: (
          <PrivateRoute>
            <Task />
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: "*",
    element: <ErrorPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
