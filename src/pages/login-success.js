import { loginSuccess } from "@/store/authSlice";
import { Spin } from "antd";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

const LoginSuccess = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { query } = router;
  const {token, role} = query;

  useEffect(() => {
    if(typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem("userToken", token);
        localStorage.setItem("userRole", role);
        dispatch(loginSuccess({ token, role }));
          if (role == 1) {
            router.push('/organization-management');
            return;
          } else if (role == 2) {
            router.push('/order-management');
            return;
          }
      }
      // message.success('Login Successfully');
      return;
    }
  }, [token, role]);
  return <div className="spin-indicator-at-center">
    <Spin  />
  </div>;
};

export default LoginSuccess;