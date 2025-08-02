import { useRoutes, BrowserRouter as Router } from "react-router-dom";
import routesConfig from "./routesConfig";

function App() {
  function AppRoutes() {
    const element = useRoutes(routesConfig);
    return element;
  }
  return (
    <>
      <Router>
        <AppRoutes />
      </Router>
    </>
  );
}

export default App;
