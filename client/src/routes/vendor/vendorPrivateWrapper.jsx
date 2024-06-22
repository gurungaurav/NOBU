import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function VendorPrivateWrapper({ children }) {
  const userRole = useSelector((state) => state.user.role);
  const id = useSelector((state) => state.user.id);
  if (userRole === "vendor") {
    return <>{children}</>;
  } else {
    return <Navigate to={"*"} />;
  }

  // useEffect(()=>{
  //     if(userRole === 'vendor' && ){

  //     }
  // },[])
}
