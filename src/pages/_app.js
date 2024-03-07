import React, { Fragment, useEffect, useState } from 'react';
import { wrapper } from '@/store/store';
import UniversalLayout from '@/components/Layout';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { ADMIN_ROUTES, MEMBER_ROUTES } from '@/utils/auth';
import CustomSpinner from '@/components/CustomSpinner';
import {
  ADMIN_ROLE_NUMBER_VALUE,
  ORDER_MANAGEMENT_ACCESS_ROLES_ARRAY,
  TITLE_MAPPING,
  TYPE_TEXT_FOR_ORDER_TYPE,
} from '@/utils/constant.util';
import { message, Badge } from 'antd';
import { isValidOrderType } from '@/utils/commonFunctions';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const { pathname } = router;
  const userRole = useSelector((state) => state.auth.userRole);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const orderTypeList =
    useSelector((state) => state.allOrdersData.orderTypeList) || [];
  const [loading, setLoading] = useState(false);
  const [pageTitle, setPageTitle] = useState('TOI | Dashboard'); // Set a default title

  const getPageTitle = (pathname) => {
    const titleMapping = TITLE_MAPPING;
    return titleMapping[pathname] || 'TOI | Login';
  };

  useEffect(() => {
    if (!isAuthenticated && pathname !== '/login-success') {
      if (pathname === '/privacy-policy') {
        setPageTitle(getPageTitle(pathname));
        return;
      }
      router.push('/login');
    } else if (isAuthenticated && userRole == ADMIN_ROLE_NUMBER_VALUE) {
      if (MEMBER_ROUTES.includes(pathname)) {
        router.push('/organization-management');
      }
    } else if (
      isAuthenticated &&
      ORDER_MANAGEMENT_ACCESS_ROLES_ARRAY?.includes(Number(userRole))
    ) {
      if (ADMIN_ROUTES.includes(pathname)) {
        router.push('/order-management');
      } else if (pathname === '/order-management/create') {
        const queryparams = new URLSearchParams(window?.location?.search);
        const orderType = queryparams.get(TYPE_TEXT_FOR_ORDER_TYPE);
        const isValidPath = isValidOrderType(orderType, orderTypeList);
        if (!orderType || !isValidPath) {
          router.push('/order-management');
        }
      }
    }
    message.destroy(1);
    setPageTitle(getPageTitle(pathname));
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
      {process.env.NODE_ENV === 'development' && (
        <div className='curved-label'>
          <Badge.Ribbon
            color='magenta'
            text='Development'
            className='curved-badge'
          ></Badge.Ribbon>
        </div>
      )}
      <UniversalLayout pageTitle={pageTitle}>
        {loading ? <CustomSpinner /> : <Component {...pageProps} />}
      </UniversalLayout>
    </Fragment>
  );
}

export default wrapper.withRedux(MyApp);
