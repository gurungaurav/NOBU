import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Error404 from "../../components/error/error404";

export default function UserProfilePrivateWrapper({ children }) {
  const { user_id } = useParams();
  const { id } = useSelector((state) => state.user);

  
  //! Note: The url or the values will be always on string

  if (parseInt(user_id) === id) {
    return <>{children}</>;
  } else {
    return <Error404 Error={"No profile found"} />;
  }
}
