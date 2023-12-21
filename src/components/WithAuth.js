import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useEffect } from "react";

const WithAuth = (WrappedComponent, allowedRoles = []) => {
  const Wrapper = (props) => {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const userRole = useSelector((state) => state.auth.userRole);
    const router = useRouter();

  //   useEffect(() => {
  //   //   if (!isAuthenticated) {
  //   //     router.push("/login");
  //   //   }
  //   // }, [isAuthenticated]);

    return isAuthenticated &&
      (!allowedRoles.length || allowedRoles.includes(userRole)) ? (
      <WrappedComponent {...props} />
    ) : null;
  };

  return Wrapper;
};

export default WithAuth;
