import React, { useEffect, useState } from "react";
import "../styles/organizations.css";
import { Col, Row, Button, Input, Drawer, Skeleton } from "antd";
import { FaPlus } from "react-icons/fa6";
import { AiOutlineSearch } from "react-icons/ai";
import { LuSlidersHorizontal } from "react-icons/lu";
import CustomTable from "@/components/customTable/CustomTable";
import { TABLE_FOR_ORGANIZATION_MANAGEMENT } from "@/utils/columns";
import DisplayOrganization from "@/components/organizations/DisplayOrganization";
import AddOrganization from "@/components/organizations/AddOrganization";
import OrganizationFilters from "@/components/organizations/OrganizationFilters";
import { useDispatch, useSelector } from "react-redux";
import { getOrganizationsFunc } from "@/store/organizationSlice";
import { TOTAL_ITEMS_PER_PAGE } from "@/utils/constant.util";

const OrganizationManagement = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.organizationTable.isLoading);
  const getOrganizations = useSelector(
    (state) => state.organizationTable.getOrganizations
  );
  const totalCount = useSelector((state) => state.organizationTable.totalCount);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const userRole = useSelector((state) => state.auth.userRole);
  const [isAuth, setIsAuth] = useState(false);
  const [searchedValue, setSearchedValue] = useState("");
  const [drawerHeadingText, setDrawerHeadingText] = useState("");
  const [displayViewDrawer, setDisplayViewDrawer] = useState(false);
  const [displayAddOrgDrawer, setDisplayAddOrgDrawer] = useState(false);
  const [displayFilterDrawer, setDisplayFilterDrawer] = useState(false);
  const [isEditClicked, setIsEditClicked] = useState(false);
  const [clickedColumnId, setClickedColumnId] = useState(null);
  const [page, setPage] = useState(1);

  const handleSearchValue = (e) => {
    setSearchedValue(e.target.value);
  };

  const handleFilterDrawer = () => {
    setDisplayFilterDrawer(true);
    setDisplayAddOrgDrawer(false);
    setDisplayViewDrawer(false);
  };

  const handleViewOrganizationTable = (record) => {
    setClickedColumnId(record?.id);
    setDisplayViewDrawer(true);
    setDrawerHeadingText("View");
  };

  const handleEditOrganizationTable = (record) => {
    setDisplayViewDrawer(true);
    setDrawerHeadingText("Edit");
    setIsEditClicked(true);
    setClickedColumnId(record?.id);
  };

  const handleCloseDrawer = () => {
    setDisplayViewDrawer(false);
    setClickedColumnId(null);
    setDrawerHeadingText("");
    setIsEditClicked(false);
    setDisplayAddOrgDrawer(false);
    setDisplayFilterDrawer(false);
    getOrganizationsFunc({ page: page, perPage: TOTAL_ITEMS_PER_PAGE });
  };

  useEffect(() => {
    if (searchedValue?.trim().length > 0) {
      dispatch(
        getOrganizationsFunc({
          searchText: searchedValue,
          page: page,
          perPage: TOTAL_ITEMS_PER_PAGE,
        })
      );
    } else {
      dispatch(
        getOrganizationsFunc({ page: page, perPage: TOTAL_ITEMS_PER_PAGE })
      );
    }
  }, [searchedValue, page]);

  useEffect(() => {
    setIsAuth(isAuthenticated);
  }, [isAuthenticated, userRole]);

  return (
    <>
      {isAuth && userRole == 1 && (
        <div className="organization-management-parent-container">
          <Row className="om-child-container-one">
            <h3 className="om-heading-text-customization">
              Organizations Management
            </h3>
            <Button
              size="large"
              className="om-add-organization-btn"
              icon={<FaPlus />}
              onClick={() => setDisplayAddOrgDrawer(true)}
            >
              Add Organizations
            </Button>
          </Row>

          <Row className="om-child-container-second">
            <Col>
              <Input
                prefix={<AiOutlineSearch className="org-mgt-search-bar-icon" />}
                className="om-search-bar-for-organizations"
                size="large"
                placeholder="Search Organizations..."
                onChange={handleSearchValue}
                value={searchedValue}
              />
            </Col>

            <Button
              className="org-mgt-filter-btn"
              size="large"
              icon={<LuSlidersHorizontal className="org-mgt-filter-icon" />}
              onClick={handleFilterDrawer}
            >
              Filters
            </Button>
          </Row>

          <Row>
            {isLoading ? (
              <Skeleton active paragraph={{ rows: 12 }} />
            ) : (
              <CustomTable
                rowKey={"id"}
                rows={getOrganizations}
                columns={TABLE_FOR_ORGANIZATION_MANAGEMENT}
                isViewable={true}
                isEditable={true}
                onView={handleViewOrganizationTable}
                onEdit={handleEditOrganizationTable}
                rowSelectionType={false}
                pagination={true}
                current={page}
                pageSize={5}
                total={totalCount}
                onPageChange={(page) => setPage(page)}
              />
            )}
          </Row>

          {/* All Drawer start from here */}

          {/* Add Organization Drawer */}
          <Drawer
            title="Add Organization"
            placement="right"
            open={displayAddOrgDrawer}
            onClose={handleCloseDrawer}
            closable={true}
            width={"80%"}
            destroyOnClose={true}
            footer={false}
          >
            <AddOrganization onClose={handleCloseDrawer} page={page} />
          </Drawer>

          {/* View And Edit Organization Drawer */}
          <Drawer
            title={`${drawerHeadingText} Organization`}
            placement="right"
            open={displayViewDrawer}
            onClose={handleCloseDrawer}
            closable={true}
            width={"80%"}
            destroyOnClose={true}
            footer={false}
          >
            <DisplayOrganization
              columnId={clickedColumnId}
              onClose={handleCloseDrawer}
              isEditClicked={isEditClicked}
              page={page}
            />
          </Drawer>

          {/* Filter Drawer */}
          <Drawer
            title="Filters"
            placement="right"
            open={displayFilterDrawer}
            onClose={handleCloseDrawer}
            closable={true}
            width={350}
            destroyOnClose={false}
            footer={false}
          >
            <OrganizationFilters
              onClose={handleCloseDrawer}
              page={page}
              searchText={searchedValue}
            />
          </Drawer>
        </div>
      )}
    </>
  );
};

export default OrganizationManagement;
