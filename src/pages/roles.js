import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Roles = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const userRole = useSelector((state) => state.auth.userRole);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    setIsAuth(isAuthenticated);
  }, [isAuthenticated, userRole]);
  return <>{isAuth && userRole == 1 && <div>roles</div>}</>;
};

export default Roles;
