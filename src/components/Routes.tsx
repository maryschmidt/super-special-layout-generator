import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from '../App.tsx'
import LayoutGenerator from './LayoutGenerator.tsx';

const router = createBrowserRouter([
    {
      path: "/",
      element: <App />,
    },
    {
      path: '/layout',
      element: <LayoutGenerator  />
    }
  ]);

const Routes = () => {
  return <RouterProvider router={router} />;
};

export default Routes;
