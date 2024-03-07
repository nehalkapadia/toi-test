import { ADMIN_ROLE_NUMBER_VALUE } from "@/utils/constant.util";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Roles = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const userRole = useSelector((state) => state.auth.userRole);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    setIsAuth(isAuthenticated);
  }, [isAuthenticated, userRole]);
  return <>{isAuth && userRole == ADMIN_ROLE_NUMBER_VALUE && <div>roles</div>}</>;
};

export default Roles;
