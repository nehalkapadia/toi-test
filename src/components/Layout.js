import React, { useEffect, useState } from "react";
import AppSidebar from "./Sidebar";
import AppHeader from "./Header";
import { Layout } from "antd";
import { Content } from "antd/es/layout/layout";
import { useSelector } from "react-redux";

const UniversalLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    setIsAuth(isAuthenticated);
  }, [isAuthenticated]);

  return (
    <>
      {isAuth ? (
        <Layout>
          <AppSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
          <Layout>
            <AppHeader collapsed={collapsed} setCollapsed={setCollapsed} />
            <Content className="universal-layout-content-container">
              {children}
            </Content>
          </Layout>
        </Layout>
      ) : (
        <div>{children}</div>
      )}
    </>
  );
};

export default UniversalLayout;
