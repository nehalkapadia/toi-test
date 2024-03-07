import React, { useEffect, useState } from 'react';
import '../../styles/users/displayUser.css';
import { Button, Col, Drawer, Row, Skeleton } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { getUserById } from '@/store/userTableDataSlice';
import { getRoleById } from '@/utils/commonFunctions';
import {
  ORDERING_PROVIDER_ROLE_NUMBER_VALUE,
  PERCENTAGE_TEXT_FOR_100,
  PERCENTAGE_TEXT_FOR_80,
} from '@/utils/constant.util';

const DisplayUser = ({
  columnId,
  onClose,
  organizationName,
  displayViewDrawer,
}) => {
  const dispatch = useDispatch();
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const isLoading = useSelector((state) => state.userTable.viewIsLoading);
  const getUserDetails =
    useSelector((state) => state.userTable.getUserDetails) || {};
  const { firstName, lastName, email, roleId, isActive, orderingProvider } =
    getUserDetails;

  useEffect(() => {
    if (columnId) {
      dispatch(getUserById(columnId));
    }
  }, [columnId]);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 500);
    };
    if (typeof window !== 'undefined') {
      handleResize();
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, []);

  return (
    <Drawer
      title='View User'
      placement='right'
      closable={true}
      onClose={onClose}
      width={isSmallScreen ? PERCENTAGE_TEXT_FOR_100 : PERCENTAGE_TEXT_FOR_80}
      open={displayViewDrawer}
      destroyOnClose={true}
      footer={
        <Row className='close-btn-container-at-user-view'>
          <Col>
            <Button
              size='large'
              className='global-close-btn-style'
              onClick={onClose}
            >
              Close
            </Button>
          </Col>
        </Row>
      }
    >
      {isLoading ? (
        <Skeleton active paragraph={{ row: 18 }} />
      ) : (
        <>
          <Row span={24} gutter={24}>
            <Col
              xs={{ span: 24 }}
              sm={{ span: 12 }}
              md={{ span: 8 }}
              lg={{ span: 6 }}
              className='every-single-row-in-user-display-details'
            >
              <label className='column-name-lable-at-user-mgt'>
                Organization
              </label>
              <h3 className='column-name-heading-text-at-user-mgt'>
                {organizationName}
              </h3>
            </Col>

            <Col
              xs={{ span: 24 }}
              sm={{ span: 12 }}
              md={{ span: 8 }}
              lg={{ span: 6 }}
              className='every-single-row-in-user-display-details'
            >
              <label className='column-name-lable-at-user-mgt'>Role</label>
              <h3 className='column-name-heading-text-at-user-mgt'>
                {getRoleById(roleId)}
              </h3>
            </Col>

            <Col
              xs={{ span: 24 }}
              sm={{ span: 12 }}
              md={{ span: 8 }}
              lg={{ span: 6 }}
              className='every-single-row-in-user-display-details'
            >
              <label className='column-name-lable-at-user-mgt'>
                First Name
              </label>
              <h3 className='column-name-heading-text-at-user-mgt'>
                {firstName}
              </h3>
            </Col>

            <Col
              xs={{ span: 24 }}
              sm={{ span: 12 }}
              md={{ span: 8 }}
              lg={{ span: 6 }}
              className='every-single-row-in-user-display-details'
            >
              <label className='column-name-lable-at-user-mgt'>Last Name</label>
              <h3 className='column-name-heading-text-at-user-mgt'>
                {lastName}
              </h3>
            </Col>

            <Col
              xs={{ span: 24 }}
              sm={{ span: 12 }}
              md={{ span: 8 }}
              lg={{ span: 6 }}
              className='every-single-row-in-user-display-details'
            >
              <label className='column-name-lable-at-user-mgt'>Email ID</label>
              <h3 className='email-class-at-display-user-details'>{email}</h3>
            </Col>

            <Col
              xs={{ span: 24 }}
              sm={{ span: 12 }}
              md={{ span: 8 }}
              lg={{ span: 6 }}
              className='every-single-row-in-user-display-details'
            >
              <label className='column-name-lable-at-user-mgt'>Status</label>
              <h3 className={` user-current-${isActive}`}>
                {isActive ? 'Active' : 'InActive'}
              </h3>
            </Col>
          </Row>

          {roleId == ORDERING_PROVIDER_ROLE_NUMBER_VALUE && (
            <Row>
              <Col
                xs={{ span: 24 }}
                sm={{ span: 12 }}
                md={{ span: 8 }}
                lg={{ span: 6 }}
                className='every-single-row-in-user-display-details'
              >
                <label className='column-name-lable-at-user-mgt'>
                  NPI Number
                </label>
                <h3 className='email-class-at-display-user-details'>
                  {orderingProvider}
                </h3>
              </Col>
            </Row>
          )}
        </>
      )}
    </Drawer>
  );
};

export default DisplayUser;
