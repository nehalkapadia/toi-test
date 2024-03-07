import React, { useEffect, useState } from 'react';
import '../styles/login.css';
import { Col, Button } from 'antd';
import Image from 'next/image';
import TOI_Logo from '../icons/logo.svg';
import Google_Logo from '../icons/Google.svg';
import Microsoft_Logo from '../icons/Microsoft.svg';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { PHYSICIAN_PORTAL, WELCOME_TO_TOI } from '@/utils/constant.util';

require('dotenv').config();

const Login = () => {
  const router = useRouter();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const userRole = useSelector((state) => state.auth.userRole);
  const [isAuth, setIsAuth] = useState(true);

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/google`;
  };

  const handleMicrosoftLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/microsoft`;
  };

  useEffect(() => {
    if (isAuthenticated) {
      if (userRole == 1) {
        router.push('/organization-management');
      } else if (userRole == 2) {
        router.push('/order-management');
      }
    } else if (!isAuthenticated) {
      // router.push('/login');
    }

    setIsAuth(isAuthenticated);
  }, [isAuthenticated, userRole]);

  return (
    <>
      {!isAuth && (
        <div className='login-page-main-container'>
          <Col className='login-page-left-side-container'>
            <Image
              className='login-page-logo-left-side'
              src={TOI_Logo}
              alt='TOI-Logo'
              width={200}
              height={200}
            />
          </Col>

          <Col className='login-page-right-side-container'>
            <Col className='login-header-and-btn-container'>
              <Col className='login-header-box-container'>
                <h3 className='login-page-headings-line'>Welcome,</h3>
                <h3 className='login-page-headings-line'>{WELCOME_TO_TOI}</h3>
                <p className='login-page-simple-text-line'>
                  {PHYSICIAN_PORTAL}
                </p>
              </Col>

              <Col className='all-three-btn-container'>
                <Button
                  size='large'
                  className='each-single-btn-and-logo-container-row'
                  onClick={handleGoogleLogin}
                >
                  <Image
                    className='login-btn-logo-image-icon'
                    src={Google_Logo}
                    alt='Google'
                  />
                  <span className='login-btn-for-oauth'>Login With Google</span>
                </Button>

                <Button
                  size='large'
                  className='each-single-btn-and-logo-container-row'
                  onClick={handleMicrosoftLogin}
                >
                  <Image
                    className='login-btn-logo-image-icon'
                    src={Microsoft_Logo}
                    alt='Microsoft'
                  />
                  <span className='login-btn-for-oauth'>
                    Login With Microsoft
                  </span>
                </Button>
                <div className="login-link">
                  <a target='_blank' href="/privacy-policy">Privacy Policy </a>{' '} | {' '}<a target='_blank' href="https://theoncologyinstitute.com/contact-us">Contact Us</a>
                </div>
              </Col>
            </Col>
          </Col>
        </div>
      )}
    </>
  );
};

export default Login;
