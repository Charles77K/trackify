import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./layouts/ProtectedRoute";
import {
  Dashboard,
  Inventory,
  Login,
  Sales,
  Users,
  Purchases,
  Categories,
} from "./pages";

const routesConfig = [
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: "inventory", element: <Inventory /> },
      { path: "sales", element: <Sales /> },
      { path: "purchases", element: <Purchases /> },
      { path: "users", element: <Users /> },
      { path: "categories", element: <Categories /> },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
];

export default routesConfig;
