import { Suspense } from "react";
import routes from "./routes";
import { BrowserRouter as Router, useRoutes } from "react-router-dom";

const AppRoutes = () => {
  return useRoutes(routes);
};

const AppRoute = () => {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <AppRoutes />
      </Suspense>
    </Router>
  );
};

export default AppRoute;
