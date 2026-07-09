import { createBrowserRouter } from "react-router";
import Home from "../pages/home";
import App from "../App";

const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    children: [
      {
        index: true,
        Component: Home,
      },
    ],
  },
]);

export default router;
