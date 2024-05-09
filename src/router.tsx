import { createBrowserRouter } from "react-router-dom";
import Login from "@/pages/Login";
import HomePage from "@/pages/Home";
import Signup from "@/pages/Signup";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
]);

export default router;
