import React, { useEffect, useState } from 'react';
import '../styles/users.css';
import AddUser from '@/components/users/AddUser';
import DisplayUser from '@/components/users/DisplayUser';
import UserFilters from '@/components/users/UserFilters';
import { Col, Row, Button, Drawer, Skeleton, Select, Tag } from 'antd';
import { FaPlus } from 'react-icons/fa6';
import { LuSlidersHorizontal } from 'react-icons/lu';
import CustomTable from '@/components/customTable/CustomTable';
import { useDispatch, useSelector } from 'react-redux';
import { getUsersFunc, setGetUserDetails } from '@/store/userTableDataSlice';
import { TABLE_FOR_USER_MANAGEMENT } from '@/utils/columns';
import { getOrganizationsFunc } from '@/store/organizationSlice';
import { capitalizeWords } from '@/utils/commonFunctions';
import {
  ADMIN_ROLE_NUMBER_VALUE,
  ORG_COLUMN_FOR_USER_MGT,
  ROLE_COLUMN_FOR_USER_MGT,
  TOTAL_ITEMS_PER_PAGE,
} from '@/utils/constant.util';

const UserManagement = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const userRole = useSelector((state) => state.auth.userRole);
  const isLoading = useSelector((state) => state.userTable.isLoading);
  const getOrganizations = useSelector(
    (state) => state.organizationTable.getOrganizations
  );
  const getUsersData = useSelector((state) => state.userTable.getUsersData);
  const totalCount = useSelector((state) => state.userTable.totalCount);
  const [isAuth, setIsAuth] = useState(false);
  const [selectedOrganization, setSelectedOrganization] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [drawerHeadingText, setDrawerHeadingText] = useState('');
  const [displayViewDrawer, setDisplayViewDrawer] = useState(false);
  const [displayAddUserDrawer, setDisplayAddUserDrawer] = useState(false);
  const [displayFilterDrawer, setDisplayFilterDrawer] = useState(false);
  const [isEditClicked, setIsEditClicked] = useState(false);
  const [clickedColumnId, setClickedColumnId] = useState(null);

  const [filterParams, setFilterparams] = useState({});
  const [isClearable, setIsClearable] = useState(false);
  const [page, setPage] = useState(1);
  const [selectedOrgStatus, setSelectedOrgStatus] = useState(null);

  const getAlluserDataFunc = async (page, filters, selectedOrganization) => {
    const organizationId = selectedOrganization?.toString().trim() || 'n';

    const payload = {
      page,
      perPage: TOTAL_ITEMS_PER_PAGE,
      filters,
      organizationId,
    };
    await dispatch(getUsersFunc(payload));
  };

  // Change this when user Data is Available
  const displayEmptyColumn = (columnArr) => {
    let newColumns = [...columnArr];
    newColumns.splice(1, 0, ORG_COLUMN_FOR_USER_MGT);
    newColumns.splice(6, 0, ROLE_COLUMN_FOR_USER_MGT);
    return newColumns;
  };

  const makeOptionsForOrganizations = (getOrganizations) => {
    if (getOrganizations) {
      return [
        // { value: "", label: "Select Any Organization" },
        ...getOrganizations?.map((elem) => ({
          label: capitalizeWords(elem.name),
          value: elem.id,
        })),
      ];
    }
  };

  const handleOrganizationChange = (value) => {
    setSelectedOrganization(value);
    const org = getOrganizations.find(
      (elem) => parseInt(elem.id) === parseInt(value)
    );
    setSelectedOrgStatus(org.isActive);
    setPage(1);
  };

  const handleAddAndEditDrawer = () => {
    setDisplayAddUserDrawer(true);
    setDrawerHeadingText('Add');
  };

  const handleFilterDrawer = () => {
    setDisplayFilterDrawer(true);
    setDisplayAddUserDrawer(false);
    setDisplayViewDrawer(false);
  };

  const handleViewOrganizationTable = (record) => {
    setDisplayViewDrawer(true);
    setClickedColumnId(record?.id);
  };

  const handleEditOrganizationTable = (record) => {
    setDisplayAddUserDrawer(true);
    setDrawerHeadingText('Edit');
    setIsEditClicked(true);
    setClickedColumnId(record?.id);
  };

  const handleCloseDrawer = () => {
    setDisplayViewDrawer(false);
    setClickedColumnId(null);
    setDrawerHeadingText('');
    setIsEditClicked(false);
    setDisplayAddUserDrawer(false);
    setDisplayFilterDrawer(false);
    dispatch(setGetUserDetails({}));
    if (!getUsersData || getUsersData?.length === 0) {
      getAlluserDataFunc(1, {}, selectedOrganization);
      setFilterparams({});
      setIsClearable(false);
      setPage(1);
    }
  };

  useEffect(() => {
    getAlluserDataFunc(page, filterParams, selectedOrganization);
  }, [page, selectedOrganization]);

  useEffect(() => {
    if (selectedOrganization) {
      const organization = getOrganizations.find(
        (elem) => elem.id === selectedOrganization
      );
      if (organization) {
        setOrganizationName(organization.name);
      }
    }
  }, [selectedOrganization]);

  useEffect(() => {
    dispatch(getOrganizationsFunc());
  }, []);

  useEffect(() => {
    setIsAuth(isAuthenticated);
  }, [isAuthenticated, userRole]);

  return (
    <>
      {isAuth && userRole == ADMIN_ROLE_NUMBER_VALUE && (
        <div className='user-management-parent-container'>
          <Row className='users-child-container-one'>
            <h3 className='user-heading-text-customization'>User Management</h3>
            <Button
              size='large'
              className={
                !selectedOrganization || !selectedOrgStatus
                  ? ''
                  : 'new-user-add-btn'
              }
              icon={<FaPlus />}
              disabled={!selectedOrganization || !selectedOrgStatus}
              onClick={handleAddAndEditDrawer}
            >
              Add User
            </Button>
          </Row>

          <Row className='users-child-container-second'>
            <Col>
              <p className='users-mormal-text-customization'>Organization</p>
              <Select
                className='user-mgt-select-for-organization'
                placeholder='Select OR Search Organization'
                size='large'
                options={makeOptionsForOrganizations(getOrganizations)}
                showSearch
                optionFilterProp='children'
                filterOption={(input, option) =>
                  (option?.label?.toLocaleLowerCase() ?? '').includes(
                    input?.toLocaleLowerCase()
                  )
                }
                onChange={handleOrganizationChange}
              />
              {selectedOrgStatus === false && (
                <Tag className='user-mgt-tag-for-status' color='red'>
                  Inactive
                </Tag>
              )}
            </Col>

            <Button
              className='user-mgt-filter-btn'
              size='large'
              icon={<LuSlidersHorizontal className='user-mgt-filter-icon' />}
              disabled={!selectedOrganization}
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
                rowKey={'id'}
                rows={getUsersData}
                columns={
                  getUsersData?.length > 0 && selectedOrganization !== ''
                    ? TABLE_FOR_USER_MANAGEMENT
                    : displayEmptyColumn(TABLE_FOR_USER_MANAGEMENT)
                }
                isViewable={true}
                isEditable={selectedOrgStatus ? true : false}
                onView={handleViewOrganizationTable}
                onEdit={handleEditOrganizationTable}
                rowSelectionType={false}
                pagination={true}
                current={page}
                pageSize={TOTAL_ITEMS_PER_PAGE}
                total={totalCount}
                onPageChange={(page) => setPage(page)}
              />
            )}
          </Row>

          {/* All Drawer start from here */}

          {/* Add and Edit User Drawer */}

          <AddUser
            onClose={handleCloseDrawer}
            page={page}
            organizationName={organizationName}
            organizationID={selectedOrganization}
            isEditClicked={isEditClicked}
            columnId={clickedColumnId}
            drawerHeadingText={drawerHeadingText}
            displayAddUserDrawer={displayAddUserDrawer}
          />

          {/* View User Details Drawer */}
          <DisplayUser
            columnId={clickedColumnId}
            onClose={handleCloseDrawer}
            organizationName={organizationName}
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
            <UserFilters
              onClose={handleCloseDrawer}
              setPage={setPage}
              organizationID={selectedOrganization}
              filterParams={filterParams}
              setFilterparams={setFilterparams}
              isClearable={isClearable}
              setIsClearable={setIsClearable}
            />
          </Drawer>
        </div>
      )}
    </>
  );
};

export default UserManagement;
