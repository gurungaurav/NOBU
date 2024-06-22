import React, { Fragment, Suspense, useRef } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { allRoutes } from "../allRoutes/all.Routes";
import AdminPrivateWrapper from "../admin/adminPrivateWrapper";
import AdminLayout from "../../layouts/admin/adminLayout";
import VendorPrivateWrapper from "../vendor/vendorPrivateWrapper";
import VendorLayout from "../../layouts/vendor/vendorLayout";
import LazyLoader from "../../components/Loader/lazyLoader";
import ClientLayout from "../../layouts/client/clientLayout";
import MainHotelLayout from "../../layouts/hotel/mainHotelLayout";
import UserProfilePrivateWrapper from "../client/userProfilePrivateWrapper";
import { useSelector } from "react-redux";

const MainLayoutWrapper = ({ routes, children }) => {
  const MainWrapper = routes.hasLayout ? ClientLayout : Fragment;

  //!Wrapper to check if the user is current user or not
  const ProfileWrapper = routes.requiredProfileAuth
    ? UserProfilePrivateWrapper
    : Fragment;

  return (
    <MainWrapper>
      <ProfileWrapper>{children}</ProfileWrapper>
    </MainWrapper>
  );
};

const AdminLayoutWrapper = ({ routes, children }) => {
  // const AdminWrapper = routes.has
  const AuthWrapper = routes.requiredAdminAuth ? AdminPrivateWrapper : Fragment;

  return (
    <AuthWrapper>
      <AdminLayout>{children}</AdminLayout>
    </AuthWrapper>
  );
  // return <>{children}</>;
};

const VendorLayoutWrapper = ({ routes, children }) => {
  const AuthWrapper = routes.requiredVendorAuth
    ? VendorPrivateWrapper
    : Fragment;

  return (
    // <AuthWrapper>
    <VendorLayout>{children}</VendorLayout>
    // </AuthWrapper>
  );
};

const MainHotelLayoutWrapper = ({ routes, children }) => {
  return <MainHotelLayout>{children}</MainHotelLayout>;
};

//TODO: When the hotel is unverified then the i will make a wrapper to check the hotel if the hotel is verified or not
export default function Router() {
  const { role } = useSelector((state) => state.user);

  //!So how this works is only the vendor and the admin will see the chat for them but the layout of thems will be different but i want to use
  //! The same chat right but the path wont let me cuz the path searches for an admin id or hotel name on the layouts if they are not provided on
  //! a page then later when i try to navigate on other page within the layout or dashboard it will show undefined as the url's data dissappears
  //! So the componenet will be same but according to the roles the required values of the url will be added and sent just like below
  return (
    <BrowserRouter>
      <Suspense fallback={<LazyLoader />}>
        <Routes>
          {allRoutes.map((routes) => {
            let modifiedPath = routes.path; // Initialize with the original path

            // If the route has a chat layout and the role is admin, add ":admin_id" to the path
            if (routes.hasChatLayout && role === "admin") {
              modifiedPath += "/:admin_id";
            }
            // If the route has a chat layout and the role is not admin, add ":hotel_name" to the path
            else if (routes.hasChatLayout && role === "vendor") {
              modifiedPath += "/:hotel_name";
            }

            return (
              <Route
                key={routes.id}
                path={modifiedPath} // Use the modified path
                element={
                  routes.hasAdminLayout ? (
                    <AdminLayoutWrapper routes={routes}>
                      <routes.element />
                    </AdminLayoutWrapper>
                  ) : routes.hasVendorLayout ? (
                    <VendorLayoutWrapper routes={routes}>
                      <routes.element />
                    </VendorLayoutWrapper>
                  ) : routes.hasMainHotelLayout ? (
                    <MainHotelLayoutWrapper routes={routes}>
                      <routes.element />
                    </MainHotelLayoutWrapper>
                  ) : routes.hasChatLayout ? (
                    role === "admin" ? (
                      <AdminLayoutWrapper routes={routes}>
                        <routes.element />
                      </AdminLayoutWrapper>
                    ) : (
                      <VendorLayoutWrapper routes={routes}>
                        <routes.element />
                      </VendorLayoutWrapper>
                    )
                  ) : (
                    <MainLayoutWrapper routes={routes}>
                      <routes.element />
                    </MainLayoutWrapper>
                  )
                }
              />
            );
          })}
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
