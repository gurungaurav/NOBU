import { lazy } from "react";
const VerificationPage = lazy(() =>
  import("../../components/auth/verificationPage")
);
const VendorRegistrationForm = lazy(() =>
  import("../../pages/client/vendorRegistration")
);
const RegistrationForm = lazy(() =>
  import("../../components/auth/registrationForm")
);
const LoginForm = lazy(() => import("../../components/auth/loginForm"));


export const authRoutes = [
  {
    id: "register",
    path: "/register",
    element: RegistrationForm,
    hasLayout: false,
    requiredAuth: false,
  },
  {
    id: "login",
    path: "/login",
    element: LoginForm,
    hasLayout: false,
    requiredAuth: false,
  },
  {
    id: "vendorRegistration",
    path: "/vendorRegistration",
    element: VendorRegistrationForm,
    hasLayout: true,
    requiredAuth: false,
  },
  {
    id: "verification",
    path: "/nobu/user/verification/:user_id/:email",
    element: VerificationPage,
    hasLayout: false,
    requiredAuth: false,
  },
];
