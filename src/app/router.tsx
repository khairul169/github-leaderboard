import { RouterProvider, createBrowserRouter } from "react-router-dom";
import MainLayout from "@client/components/layouts/main-layout";
import HomePage from "@client/pages/home/page";

const router = createBrowserRouter([
  {
    Component: MainLayout,
    children: [
      {
        path: ":type?/:id?",
        Component: HomePage,
      },
    ],
  },
]);

const Router = () => {
  return <RouterProvider router={router} />;
};

export default Router;
