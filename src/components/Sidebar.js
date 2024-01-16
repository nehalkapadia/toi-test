import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import { Menu } from 'antd';
import Logo from '../icons/logo.svg';
import { LuFileText } from 'react-icons/lu';
import { FaRegUser } from 'react-icons/fa6';
import { HiOutlineUsers } from 'react-icons/hi';
import Sider from 'antd/es/layout/Sider';
import '../styles/index.css';
import { useDispatch, useSelector } from 'react-redux';
import {
  resetCreateOrderDataBacktoInitialState,
  setDisplayPcpNumberSuccessTick,
  setDisplayReferringSuccessTick,
  setDisplayorderingSuccessTick,
} from '@/store/createOrderFormSlice';
import { resetSearchPatientData, setIsNewPatientCreated, setTab1FormData } from '@/store/orderSlice';

const AppSidebar = ({ collapsed, setCollapsed }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { asPath } = router;
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const userRole = useSelector((state) => state.auth.userRole);
  const [items, setItems] = useState(null);

  const handleSubmenu = () => {};

  const onOrderManagementClick = () => {
    dispatch(resetCreateOrderDataBacktoInitialState());
    dispatch(setTab1FormData({}));
    dispatch(resetSearchPatientData());
    dispatch(setIsNewPatientCreated(false));
    dispatch(setDisplayPcpNumberSuccessTick(false));
    dispatch(setDisplayReferringSuccessTick(false));
    dispatch(setDisplayorderingSuccessTick(false));
  };

  const adminItems = [
    {
      key: '/organization-management',
      icon: (
        <LuFileText
          style={
            collapsed
              ? { width: '22px', height: '22px' }
              : { width: '22px', height: '22px' }
          }
        />
      ),
      label: (
        <Link href="/organization-management">Organization Management</Link>
      ),
    },
    {
      key: '/user-management',
      icon: (
        <FaRegUser
          style={
            collapsed
              ? { width: '22px', height: '20px' }
              : { width: '22px', height: '20px' }
          }
        />
      ),
      label: <Link href="/user-management">User Management</Link>,
    },
    // {
    //   key: "/roles",
    //   icon: (
    //     <HiOutlineUsers
    //       style={
    //         collapsed
    //           ? { width: "24px", height: "26px" }
    //           : { width: "26px", height: "24px" }
    //       }
    //     />
    //   ),
    //   label: <Link href="/roles">Roles</Link>,
    // },
  ];

  const memberItems = [
    {
      key: '/order-management',
      icon: (
        <LuFileText
          style={
            collapsed
              ? { width: '22px', height: '22px' }
              : { width: '22px', height: '22px' }
          }
        />
      ),
      label: (
        <Link href="/order-management" onClick={onOrderManagementClick}>
          Order Management
        </Link>
      ),
    },
  ];

  useEffect(() => {
    if (isAuthenticated) {
      if (userRole == 1) {
        setItems(adminItems);
      } else if (userRole == 2) {
        setItems(memberItems);
      }
    }
  }, [userRole, isAuthenticated]);

  return (
    <Sider
      className={`universal-sidebar ${collapsed ? 'collapsed' : 'expanded'}`}
      collapsible={true}
      trigger={null}
      collapsed={collapsed}
      breakpoint="md"
      onBreakpoint={(broken) => setCollapsed(broken)}
    >
      <div className="oncology-univsersal-logo">
        <Image src={Logo} alt="Logo" style={collapsed && { width: '80px' }} />
      </div>
      <div className="handle-sidebar-menu-container">
        <Menu
          theme="light"
          mode="inline"
          openKeys={''}
          onOpenChange={handleSubmenu}
          defaultSelectedKeys={[
            asPath.includes('login-success')
              ? userRole == 1
                ? '/organization-management'
                : '/order-management'
              : asPath,
          ]}
          items={items}
        ></Menu>
      </div>
    </Sider>
  );
};

export default AppSidebar;
