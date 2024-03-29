import { Spin, message } from 'antd';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

const loginError = () => {
  const router = useRouter();
  const { query } = router;
  const { errorMessage } = query;
  let errorResponse = false;
  useEffect(() => {
    if (errorMessage && !errorResponse) {
      message.error(errorMessage);
      errorResponse = true;
      router.push('/login');
      return;
    }
  }, [errorMessage]);
  return (
    <div>
      <Spin size='large'></Spin>
    </div>
  );
};

export default loginError;
