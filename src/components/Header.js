import React, { useEffect, useState } from 'react';
import { Avatar, Button, Col, Divider, Dropdown, Row } from 'antd';
import { Header } from 'antd/es/layout/layout';
import { AiOutlineMenuUnfold, AiOutlineMenuFold } from 'react-icons/ai';
import { IoNotificationsOutline } from 'react-icons/io5';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa6';
import '../styles/index.css';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { logout, getProfile } from '@/store/authSlice';
import { getRoleById } from '@/utils/commonFunctions';

const AppHeader = ({ collapsed, setCollapsed }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state) => state.auth.user);
  const [isOpen, setIsOpen] = useState(false);

  const handleLogutBtn = () => {
    dispatch(logout());
  };

  useEffect(() => {
    dispatch(getProfile());
  }, []);

  const items = [
    {
      label: 'Log out',
      key: '1',
      onClick: handleLogutBtn,
      className: 'logout-btn',
    },
  ];

  const handleDropdownChange = (value) => {
    setIsOpen(value);
  };

  return (
    <Header className='universal-layout-header'>
      <Row className='universal-layout-header-container' span={24} gutter={24}>
        <Col
          xs={{ span: 4 }}
          sm={{ span: 4 }}
          md={{ span: 8 }}
          lg={{ span: 12 }}
          className='layout-header-left-side-container'
        >
          <Button
            size='large'
            type='text'
            className='btn-for-collapsed-or-shrink'
            icon={
              collapsed ? (
                <AiOutlineMenuUnfold className='icon-at-header-bar' />
              ) : (
                <AiOutlineMenuFold className='icon-at-header-bar' />
              )
            }
            onClick={() => setCollapsed(!collapsed)}
          />
        </Col>

        <Col
          className='layout-header-right-side-container'
          xs={{ span: 20 }}
          sm={{ span: 20 }}
          md={{ span: 16 }}
          lg={{ span: 12 }}
        >
          <Row gutter={24}>
            <Col className='layout-header-notification-icon'>
              <IoNotificationsOutline />
            </Col>

            <Col>
              <Avatar
                size='large'
                className='user-profile-icon-at-header'
                src={undefined}
                alt='profile'
              >
                {user && user?.firstName
                  ? user?.firstName[0]?.toUpperCase() +
                    user?.lastName[0].toUpperCase()
                  : 'U'}
              </Avatar>
            </Col>

            <Col className='dropdown-for-profile-view-details'>
              <Dropdown
                menu={{ items }}
                trigger={['click']}
                placement='bottom'
                onOpenChange={handleDropdownChange}
              >
                <div className='profile-details-at-header-bar'>
                  <Col className='profile-details-container-header'>
                    <p className='customized-zero-margin-for-p-tag customized-user-name-at-header'>
                      {user && user?.firstName
                        ? `${user?.firstName} ${user?.lastName}`
                        : 'Unknown'}
                    </p>
                    <p className='customized-zero-margin-for-p-tag customized-user-role-at-header'>
                      {getRoleById(user?.roleId)}
                    </p>
                  </Col>
                  {isOpen ? (
                    <FaAngleUp className='fa-angle-down-for-profile' />
                  ) : (
                    <FaAngleDown className='fa-angle-down-for-profile' />
                  )}
                </div>
              </Dropdown>
            </Col>
          </Row>
        </Col>
      </Row>
    </Header>
  );
};

export default AppHeader;
