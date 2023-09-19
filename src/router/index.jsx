import { createBrowserRouter } from "react-router-dom";
import AdminLayout from "../admin-layout";
import Dashboard from "../pages/dashboard/dashboard";

const router = createBrowserRouter([
  { path: "/", element: <AdminLayout /> },
  { path: "/dashboard", element: <Dashboard /> },
]);

export default router;
