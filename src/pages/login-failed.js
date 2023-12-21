import { Spin, message } from "antd";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

const loginError = () => {
  const router = useRouter();
  const { query } = router;
  const {errorMessage} = query;

  useEffect(() => {
    if (errorMessage) {
      message.error(errorMessage);
      router.push('/login')
      return;
    }
  }, [errorMessage]);
  return <div>
    <Spin size="large"></Spin>
  </div>;
};

export default loginError;
