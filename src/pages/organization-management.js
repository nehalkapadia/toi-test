import React, { useEffect, useState } from 'react';
import '../styles/organizations.css';
import { Col, Row, Button, Input, Drawer, Skeleton } from 'antd';
import { FaPlus } from 'react-icons/fa6';
import { AiOutlineSearch } from 'react-icons/ai';
import { LuSlidersHorizontal } from 'react-icons/lu';
import CustomTable from '@/components/customTable/CustomTable';
import { TABLE_FOR_ORGANIZATION_MANAGEMENT } from '@/utils/columns';
import DisplayOrganization from '@/components/organizations/DisplayOrganization';
import AddOrganization from '@/components/organizations/AddOrganization';
import OrganizationFilters from '@/components/organizations/OrganizationFilters';
import { useDispatch, useSelector } from 'react-redux';
import {
  getOrganizationsFunc,
  setGetorderDetailsById,
} from '@/store/organizationSlice';
import {
  ADMIN_ROLE_NUMBER_VALUE,
  TOTAL_ITEMS_PER_PAGE,
} from '@/utils/constant.util';
import { FiRefreshCcw } from 'react-icons/fi';

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
  const [searchedValue, setSearchedValue] = useState('');
  const [drawerHeadingText, setDrawerHeadingText] = useState('');
  const [displayViewDrawer, setDisplayViewDrawer] = useState(false);
  const [displayAddOrgDrawer, setDisplayAddOrgDrawer] = useState(false);
  const [displayFilterDrawer, setDisplayFilterDrawer] = useState(false);
  const [isEditClicked, setIsEditClicked] = useState(false);
  const [clickedColumnId, setClickedColumnId] = useState(null);
  const [filterParams, setFilterParams] = useState({});
  const [isClearable, setIsClearable] = useState(false);
  const [page, setPage] = useState(1);

  const getOrganizationsData = async (page, filterParams, searchedValue) => {
    const payload = {
      page: page,
      perPage: TOTAL_ITEMS_PER_PAGE,
      filters: filterParams,
    };
    if (searchedValue?.trim().length > 0) {
      payload.searchText = searchedValue;
    }
    await dispatch(getOrganizationsFunc(payload));
  };

  const handleSearchValue = (e) => {
    setPage(1);
    setSearchedValue(e.target.value);
  };

  const handleFilterDrawer = () => {
    setDisplayFilterDrawer(true);
    setDisplayAddOrgDrawer(false);
    setDisplayViewDrawer(false);
  };

  const handleAddAndEditOrganizationDrawer = () => {
    setDisplayAddOrgDrawer(true);
    setDrawerHeadingText('Add');
  };

  const handleViewOrganizationTable = (record) => {
    setClickedColumnId(record?.id);
    setDisplayViewDrawer(true);
  };

  const handleEditOrganizationTable = (record) => {
    setDisplayAddOrgDrawer(true);
    setDrawerHeadingText('Edit');
    setIsEditClicked(true);
    setClickedColumnId(record?.id);
  };

  const handleCloseDrawer = () => {
    setDisplayViewDrawer(false);
    setClickedColumnId(null);
    setDrawerHeadingText('');
    setIsEditClicked(false);
    setDisplayAddOrgDrawer(false);
    setDisplayFilterDrawer(false);
    dispatch(setGetorderDetailsById({}));
    if (getOrganizations?.length === 0 || !getOrganizations) {
      getOrganizationsData(1, {}, searchedValue);
      setFilterParams({});
      setIsClearable(false);
      setPage(1);
    }
  };

  const handleRefreshBtn = () => {
    getOrganizationsData(page, filterParams, searchedValue);
  };

  useEffect(() => {
    getOrganizationsData(page, filterParams, searchedValue);
  }, [searchedValue, page]);

  useEffect(() => {
    setIsAuth(isAuthenticated);
  }, [isAuthenticated, userRole]);

  return (
    <>
      {isAuth && userRole == ADMIN_ROLE_NUMBER_VALUE && (
        <div className='organization-management-parent-container'>
          <Row className='om-child-container-one'>
            <h3 className='om-heading-text-customization'>
              Organization Management
            </h3>
            <Button
              size='large'
              className='global-primary-btn-style'
              icon={<FaPlus />}
              onClick={handleAddAndEditOrganizationDrawer}
            >
              Add Organization
            </Button>
          </Row>

          <Row className='om-child-container-second'>
            <Col>
              <Input
                prefix={<AiOutlineSearch className='org-mgt-search-bar-icon' />}
                className='om-search-bar-for-organizations'
                size='large'
                placeholder='Search Organizations...'
                onChange={handleSearchValue}
                value={searchedValue}
              />
            </Col>

            <Row gutter={8}>
              <Col>
                <Button
                  className='global-secondary-btn-style'
                  size='large'
                  icon={<LuSlidersHorizontal className='org-mgt-filter-icon' />}
                  onClick={handleFilterDrawer}
                >
                  Filters
                </Button>
              </Col>
              <Col>
                <Button
                  size='large'
                  icon={<FiRefreshCcw />}
                  className='global-primary-btn-style'
                  onClick={handleRefreshBtn}
                >
                  Refresh
                </Button>
              </Col>
            </Row>
          </Row>

          <Row>
            {isLoading ? (
              <Skeleton active paragraph={{ rows: 12 }} />
            ) : (
              <CustomTable
                rowKey={'id'}
                rows={getOrganizations}
                columns={TABLE_FOR_ORGANIZATION_MANAGEMENT}
                isViewable={true}
                isEditable={true}
                onView={handleViewOrganizationTable}
                onEdit={handleEditOrganizationTable}
                rowSelectionType={false}
                pagination={true}
                current={page}
                pageSize={TOTAL_ITEMS_PER_PAGE}
                total={totalCount}
                onPageChange={(page) => setPage(page)}
                scroll={{x: 800 ,y: 300}}
              />
            )}
          </Row>

          {/* All Drawer start from here */}

          {/* Add And Edit Organization Drawer */}

          <AddOrganization
            onClose={handleCloseDrawer}
            page={page}
            columnId={clickedColumnId}
            isEditClicked={isEditClicked}
            drawerHeadingText={drawerHeadingText}
            displayAddOrgDrawer={displayAddOrgDrawer}
          />

          {/* View Organization Drawer */}

          <DisplayOrganization
            onClose={handleCloseDrawer}
            columnId={clickedColumnId}
            displayViewDrawer={displayViewDrawer}
          />

          {/* Filter Drawer */}
          <Drawer
            title='Filters'
            placement='right'
            open={displayFilterDrawer}
            onClose={handleCloseDrawer}
            closable={true}
            width={350}
            destroyOnClose={false}
            footer={false}
          >
            <OrganizationFilters
              onClose={handleCloseDrawer}
              setPage={setPage}
              searchText={searchedValue}
              filterParams={filterParams}
              setFilterParams={setFilterParams}
              isClearable={isClearable}
              setIsClearable={setIsClearable}
            />
          </Drawer>
        </div>
      )}
    </>
  );
};

export default OrganizationManagement;
