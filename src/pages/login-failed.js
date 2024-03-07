import CustomSpinner from '@/components/CustomSpinner';
import { USER_CANT_ACCESS_OR_EXIST } from '@/utils/constant.util';
import { message } from 'antd';
import { useRouter } from 'next/router';
import React, { Fragment, useEffect } from 'react';

const LoginError = () => {
  const router = useRouter();
  const { query } = router;
  const { errorMessage } = query;
  let errorResponse = false;
  useEffect(() => {
    if (errorMessage && !errorResponse) {
      message.error({
        content: errorMessage ? errorMessage : USER_CANT_ACCESS_OR_EXIST,
        duration: 3,
        key: 'loginErrorMessage',
      });
      errorResponse = true;
      router.push('/login');
      return;
    }
    message.error({
      content: errorMessage ? errorMessage : USER_CANT_ACCESS_OR_EXIST,
      duration: 3,
      key: 'loginErrorMessage',
    });
  }, [errorMessage]);
  return (
    <Fragment>
      <CustomSpinner />
    </Fragment>
  );
};

export default LoginError;
