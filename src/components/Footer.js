import React from "react";
import { Footer } from "antd/es/layout/layout";

const AppFooter = () => {
  return (
    <Footer style={{ textAlign: "center" }}>
      &copy; {new Date().getFullYear()} The Oncology Institute{" "}
    </Footer>
  );
};

export default AppFooter;
