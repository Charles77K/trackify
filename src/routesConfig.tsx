import MainLayout from "./layouts/MainLayout";
import { Dashboard, Login } from "./pages";

const routesConfig = [
  {
    path: "/",
    element: <MainLayout />,
    children: [{ index: true, element: <Dashboard /> }],
  },
  {
    path: "/login",
    element: <Login />,
  },
];

export default routesConfig;
