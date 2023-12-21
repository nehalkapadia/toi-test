import React, { Fragment, useEffect, useState } from "react";
import { wrapper } from "@/store/store";
import UniversalLayout from "@/components/Layout";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { ADMIN_ROUTES, MEMBER_ROUTES } from "@/utils/auth";

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const { pathname } = router;
  const userRole = useSelector((state) => state.auth.userRole);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    if (pathname === "/") {
      if (isAuthenticated) {
        if (userRole == 1) {
          router.push("/organization-management");
        } else if (userRole == 2) {
          router.push("/order-management");
        }
      } else if (!isAuthenticated) {
        router.push("/login");
      }
    }
    if (!isAuthenticated && pathname !== "/login-success") {
      router.push("/login");
    } else if (isAuthenticated && userRole == 1) {
      if (MEMBER_ROUTES.includes(pathname)) {
        router.push("/organization-management");
      }
    } else if (isAuthenticated && userRole == 2) {
      if (ADMIN_ROUTES.includes(pathname)) {
        router.push("/order-management");
      }
    }
  }, [isAuthenticated, pathname]);

  return (
    <Fragment>
      <UniversalLayout>
        <Component {...pageProps} />
      </UniversalLayout>
    </Fragment>
  );
}

export default wrapper.withRedux(MyApp);

// import { adminAccess, coAdminAccess, userAccess } from "@/utils/auth";

// const toiToken = JSON.parse(localStorage.getItem("toiToken"));
// if (!toiToken) {
//   router.push("/login");
// } else if (toiToken === "admin" && !adminAccess.includes(pathname)) {
//   router.push("/organization-management");
// } else if (toiToken === "user" && !userAccess.includes(pathname)) {
//   router.push("/order-management");
// } else if (toiToken === "coAdmin" && !coAdminAccess.includes(pathname)) {
//   router.push("/order-management");
// }
