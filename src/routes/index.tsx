import { createBrowserRouter } from "react-router";
import { lazy } from "react";
import RouteErrorPage from "../pages/RouteErrorPage";

const App = lazy(() => import("../App"));
const Home = lazy(() => import("../pages/HomePage"));
const Portfolios = lazy(() => import("../pages/PortfoliosPage"));
const PortfolioDetail = lazy(() => import("../pages/PortfolioDetailPage"));
const NotFound = lazy(() => import("../pages/NotFoundPage"));

const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    errorElement: <RouteErrorPage />,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "portfolios",
        Component: Portfolios,
      },
      {
        path: "portfolios/:id",
        Component: PortfolioDetail,
      },
      {
        path: "*",
        Component: NotFound,
      },
    ],
  },
]);

export default router;
