import React, { Fragment, useEffect, useState } from 'react';
import { wrapper } from '@/store/store';
import UniversalLayout from '@/components/Layout';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { ADMIN_ROUTES, MEMBER_ROUTES } from '@/utils/auth';
import { Spin } from 'antd';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const { pathname } = router;
  const userRole = useSelector((state) => state.auth.userRole);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (pathname === '/') {
      if (isAuthenticated) {
        if (userRole == 1) {
          router.push('/organization-management');
        } else if (userRole == 2) {
          router.push('/order-management');
        }
      } else if (!isAuthenticated) {
        router.push('/login');
      }
    }
    if (!isAuthenticated && pathname !== '/login-success') {
      router.push('/login');
    } else if (isAuthenticated && userRole == 1) {
      if (MEMBER_ROUTES.includes(pathname)) {
        router.push('/organization-management');
      }
    } else if (isAuthenticated && userRole == 2) {
      if (ADMIN_ROUTES.includes(pathname)) {
        router.push('/order-management');
      }
    }
  }, [isAuthenticated, pathname]);

  useEffect(() => {
    const handleStart = () => {
      setLoading(true); // Show your custom loader
    };

    const handleComplete = () => {
      setLoading(false); // Hide your custom loader
    };

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

  return (
    <Fragment>
      <UniversalLayout>
        {loading ? (
          <div>
            <Spin fullscreen />
          </div>
        ) : (
          <Component {...pageProps} />
        )}
      </UniversalLayout>
    </Fragment>
  );
}

export default wrapper.withRedux(MyApp);
