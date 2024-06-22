import { lazy } from "react";
const Error401 = lazy(() => import("../../pages/error/error401"));
const Error404 = lazy(() => import("../../components/error/error404"));
Error401;

export const errorRoutes = [
  {
    id: "error404",
    path: "*",
    element: Error404,
    hasLayout: true,
    requiredAuth: false,
  },
  {
    id: "error401",
    path: "/error401",
    element: Error401,
    hasLayout: true,
    requiredAuth: false,
  },
];
