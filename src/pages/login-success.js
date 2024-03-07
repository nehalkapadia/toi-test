import CustomSpinner from '@/components/CustomSpinner';
import { loginSuccess } from '@/store/authSlice';
import { LOGGED_IN_SUCCESSFULLY_MESSAGE } from '@/utils/constant.util';
import { message } from 'antd';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

const LoginSuccess = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { query } = router;
  const { token, role } = query;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('userToken', token);
        localStorage.setItem('userRole', role);
        dispatch(loginSuccess({ token, role }));
        if (role == 1) {
          router.push('/organization-management');
          message.success({
            content: LOGGED_IN_SUCCESSFULLY_MESSAGE,
            duration: 3,
            key: 'loginSuccessAdmin'
          });
          return;
        } else if (role == 2) {
          router.push('/order-management');
          message.success({
            content: LOGGED_IN_SUCCESSFULLY_MESSAGE,
            duration: 3,
            key: 'loginSuccessMember'
          });
          return;
        }
      }
      return;
    }
  }, [token, role]);
  return (
    <div className='spin-indicator-at-center'>
      <CustomSpinner />
    </div>
  );
};

export default LoginSuccess;
