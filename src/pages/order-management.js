import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import '../styles/orderManagement.css';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  Col,
  Row,
  Select,
  Drawer,
  Skeleton,
  message,
  Dropdown,
} from 'antd';
import CustomTable from '@/components/customTable/CustomTable';
import {
  ARE_YOU_SURE_WANT_TO_DELETE_ORDER,
  ORDER_MANAGEMENT_ACCESS_ROLES_ARRAY,
  ORDER_MODAL_CANCEL_TEXT,
  ORDER_MODAL_OK_TEXT,
  TOTAL_ITEMS_PER_PAGE,
} from '@/utils/constant.util';
import { FaPlus } from 'react-icons/fa6';
import { LuSlidersHorizontal } from 'react-icons/lu';
import {
  ORDER_MANAGEMENT_ORDER_STATUS_OPTIONS,
  ORDER_MANAGEMENT_ORDER_TYPES_OPTIONS,
} from '@/utils/options';
import { TABLE_FOR_ORDER_MANAGEMENT } from '@/utils/columns';
import DisplayOrderDetails from '@/components/orders/DisplayOrderDetails';
import OrderFilters from '@/components/orders/OrderFilters';
import {
  deleteOrderById,
  getAllCreatedOrderData,
  getUserListBasedOnLoggedInPerson,
  resetOrderStateToInitialState,
  resetSearchPatientData,
  setTab1FormData,
  getOrderTypeList,
} from '@/store/orderSlice';
import { resetCreateOrderDataBacktoInitialState } from '@/store/createOrderFormSlice';
import OrderModal from '@/components/orders/createOrder/OrderModal';
import { RiDeleteBinLine } from 'react-icons/ri';
import { setSelectedUserAtOrderMgt } from '@/store/authSlice';
import OrderManagementDropdowns from '@/components/OrderManagementDropdowns';

const OrderManagement = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const userRole = useSelector((state) => state.auth.userRole);
  const user = useSelector((state) => state.auth.user);
  const { id: userId } = user || {};
  const selectedUser = useSelector(
    (state) => state.auth.selectedUserAtOrderMgt
  );
  const isLoading = useSelector(
    (state) => state.allOrdersData.getAllOrderIsLoading
  );
  const totalOrderCount = useSelector(
    (state) => state.allOrdersData.totalOrderCount
  );
  const getAllOrders = useSelector((state) => state.allOrdersData.getAllOrders);
  const getUsersListForDropdown = useSelector(
    (state) => state.allOrdersData.getUsersListForDropdown
  );
  const orderTypeList =
    useSelector((state) => state.allOrdersData.orderTypeList) || [];

  const [isAuth, setIsAuth] = useState(false);
  const [checkedOrderTypes, setCheckedOrderTypes] = useState([]);
  const [checkedOrderStatus, setCheckedOrderStatus] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [clickedColumnId, setClickedColumnId] = useState(null);
  const [displayViewDrawer, setDisplayViewDrawer] = useState(false);
  const [displayFilterDrawer, setDisplayFilterDrawer] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isOrderTypeOpen, setIsOrderTypeOpen] = useState(false);
  const [isOrderStatusOpen, setIsOrderStatusOpen] = useState(false);

  const [filterParams, setFilterparams] = useState({});
  const [isClearable, setIsClearable] = useState(false);
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [deleteRecord, setDeleteRecord] = useState(null);

  const getAllOrderDataFunc = async (
    selectedUser,
    checkedOrderStatus,
    checkedOrderTypes,
    filterParams,
    currentPage
  ) => {
    const payload = {
      filters: {
        userId: selectedUser
          ? selectedUser === 'all'
            ? ''
            : selectedUser
          : userId,
        status: checkedOrderStatus,
        orderTypes: checkedOrderTypes,
        ...filterParams,
      },
      page: currentPage,
      pageSize: TOTAL_ITEMS_PER_PAGE,
      orderBy: 'updatedAt',
      ascending: false,
    };

    await dispatch(getAllCreatedOrderData(payload));
  };

  const handleCreateOrder = (item) => {
    dispatch(resetCreateOrderDataBacktoInitialState());
    dispatch(resetOrderStateToInitialState());
    router.push(`/order-management/create?type=${item?.label}`);
  };

  const createOrderOptions = orderTypeList?.map((item) => {
    return {
      ...item,
      className: 'create-order-btn-options-at-om',
      onClick: () => handleCreateOrder(item),
    };
  });

  const generateDropdownOptions = (data = []) => {
    const emptyOption = {
      value: 'all',
      label: 'All Orders',
    };
    const optionsArr = data.map((elem) => {
      const label = `${elem.firstName} ${elem.lastName}`;
      return {
        value: elem.id,
        label: elem.id === userId ? 'My Orders' : label,
      };
    });

    const userIdIndex = optionsArr.findIndex((elem) => elem.value === userId);
    if (userIdIndex !== -1) {
      const myOrdersOption = optionsArr.splice(userIdIndex, 1)[0];
      optionsArr.unshift(myOrdersOption);
    }
    optionsArr.unshift(emptyOption);
    return optionsArr;
  };

  const handleSelectUserChange = (value) => {
    setCurrentPage(1);
    dispatch(setSelectedUserAtOrderMgt(value));
  };

  const handleViewOrders = (record) => {
    setDisplayViewDrawer(true);
    setClickedColumnId(record?.id);
    setDisplayFilterDrawer(false);
  };

  const handleEditOrders = (record) => {
    setClickedColumnId(record?.id);
    router.push(
      `/order-management/create?type=${record?.orderTypeData?.name}&orderId=${record?.id}`
    );
  };

  const handleDeleteOrders = async (record) => {
    const deletedOrder = await dispatch(deleteOrderById(record?.id));
    if (deletedOrder?.payload?.status) {
      message.success(deletedOrder?.payload?.message);
      getAllOrderDataFunc(
        selectedUser,
        checkedOrderStatus,
        checkedOrderTypes,
        filterParams,
        currentPage
      );
    } else {
      message.error(deletedOrder?.payload?.message);
    }
  };

  const handleFilterDrawer = () => {
    setDisplayFilterDrawer(true);
    setDisplayViewDrawer(false);
    setClickedColumnId(null);
  };

  const handleCloseDrawer = () => {
    setDisplayViewDrawer(false);
    setDisplayFilterDrawer(false);
    setClickedColumnId(null);
    dispatch(setTab1FormData({}));
    dispatch(resetCreateOrderDataBacktoInitialState());
    dispatch(resetSearchPatientData());
    if (getAllOrders?.length === 0 || !getAllOrders) {
      getAllOrderDataFunc(
        selectedUser,
        checkedOrderStatus,
        checkedOrderTypes,
        {},
        1
      );
      setFilterparams({});
      setIsClearable(false);
      setCurrentPage(1);
    }
  };

  useEffect(() => {
    setIsAuth(isAuthenticated);
  }, [isAuthenticated, userRole]);

  useEffect(() => {
    getAllOrderDataFunc(
      selectedUser,
      checkedOrderStatus,
      checkedOrderTypes,
      filterParams,
      currentPage
    );
    dispatch(getUserListBasedOnLoggedInPerson());
    dispatch(getOrderTypeList());
  }, [currentPage, selectedUser, checkedOrderStatus, checkedOrderTypes]);

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

  const showModal = (record) => {
    setDeleteRecord(record);
    setOpen(true);
  };
  const handleOk = async () => {
    setConfirmLoading(true);
    await handleDeleteOrders(deleteRecord);
    setOpen(false);
    setConfirmLoading(false);
  };
  const handleCancel = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (!selectedUser) {
      dispatch(setSelectedUserAtOrderMgt(userId));
    }
  }, [userId]);

  return (
    <>
      {isAuth &&
        ORDER_MANAGEMENT_ACCESS_ROLES_ARRAY?.includes(Number(userRole)) && (
          <div>
            <div className='order-management-parent-container'>
              <Row className='order-mgt-first-child-container'>
                <Col>
                  <h3 className='order-mgt-heading'>Order Management</h3>
                </Col>
                <Col>
                  <Dropdown
                    menu={{ items: createOrderOptions }}
                    trigger={['click']}
                    placement='bottom'
                  >
                    <Button
                      size='large'
                      icon={<FaPlus />}
                      className='create-order-btn'
                    >
                      Create Order
                    </Button>
                  </Dropdown>
                </Col>
              </Row>

              <Row className='order-mgt-second-child-container'>
                <Col>
                  <Select
                    className='order-mgt-user-select-tag'
                    size='large'
                    options={generateDropdownOptions(getUsersListForDropdown)}
                    onChange={handleSelectUserChange}
                    placeholder='Select'
                    value={selectedUser}
                  />
                </Col>

                <Col>
                  <Row gutter={16} className='order-mgt-filters-container'>
                    <Col>
                      <OrderManagementDropdowns
                        dropdownTitle={'Order Type'}
                        dropdownOpen={isOrderTypeOpen}
                        setDropdownOpen={setIsOrderTypeOpen}
                        dropdownOptions={orderTypeList}
                        ValuesArray={checkedOrderTypes}
                        setValuesArray={setCheckedOrderTypes}
                        setPage={setCurrentPage}
                      />
                    </Col>

                    <Col>
                      <OrderManagementDropdowns
                        dropdownTitle={'Order Status'}
                        dropdownOpen={isOrderStatusOpen}
                        setDropdownOpen={setIsOrderStatusOpen}
                        dropdownOptions={ORDER_MANAGEMENT_ORDER_STATUS_OPTIONS}
                        ValuesArray={checkedOrderStatus}
                        setValuesArray={setCheckedOrderStatus}
                        setPage={setCurrentPage}
                      />
                    </Col>

                    <Col>
                      <Button
                        size='large'
                        className='order-mgt-filter-btn'
                        icon={<LuSlidersHorizontal />}
                        onClick={handleFilterDrawer}
                      >
                        Filters
                      </Button>
                    </Col>
                  </Row>
                </Col>
              </Row>

              <Row>
                {isLoading ? (
                  <Skeleton active paragraph={{ row: 15 }} />
                ) : (
                  <CustomTable
                    rowKey='id'
                    rows={getAllOrders}
                    columns={TABLE_FOR_ORDER_MANAGEMENT}
                    isViewable={true}
                    isEditable={true}
                    isDeleteable={true}
                    onView={handleViewOrders}
                    onEdit={handleEditOrders}
                    onDelete={showModal}
                    rowSelectionType={false}
                    pagination={true}
                    current={currentPage}
                    pageSize={TOTAL_ITEMS_PER_PAGE}
                    total={totalOrderCount}
                    onPageChange={(page) => setCurrentPage(page)}
                    showQuickJumper={true}
                    scroll={{ x: 1200, y:300 }}
                  />
                )}
              </Row>

              {/* Drawer Start From Here */}

              {/* View Order Details Drawer */}
              <Drawer
                title='View Order Documents'
                placement='right'
                open={displayViewDrawer}
                onClose={handleCloseDrawer}
                closable={true}
                width={isSmallScreen ? '100%' : '80%'}
                className='common-class-for-all-app-drawers-for-width'
                destroyOnClose={true}
                footer={
                  <Col className='order-mgt-drawer-footer'>
                    <Button
                      size='large'
                      className='order-mgt-drawer-close-btn'
                      onClick={handleCloseDrawer}
                    >
                      Close
                    </Button>
                  </Col>
                }
              >
                <DisplayOrderDetails columnId={clickedColumnId} />
              </Drawer>

              {/* Filter Order Details Drawer */}
              <Drawer
                title='Filters'
                placement='right'
                open={displayFilterDrawer}
                onClose={handleCloseDrawer}
                closable={true}
                width={'300px'}
                destroyOnClose={false}
                footer={false}
              >
                <OrderFilters
                  setPage={setCurrentPage}
                  onClose={handleCloseDrawer}
                  userId={selectedUser}
                  Orderstatus={checkedOrderStatus}
                  filterParams={filterParams}
                  setFilterparams={setFilterparams}
                  isClearable={isClearable}
                  setIsClearable={setIsClearable}
                  checkedOrderTypes={checkedOrderTypes}
                />
              </Drawer>
              {/* Delete Order Modal */}
              <OrderModal
                title={<RiDeleteBinLine color='red' size={45} />}
                open={open}
                handleOk={handleOk}
                confirmLoading={confirmLoading}
                handleCancel={handleCancel}
                modalText={ARE_YOU_SURE_WANT_TO_DELETE_ORDER}
                okText={ORDER_MODAL_OK_TEXT}
                cancelText={ORDER_MODAL_CANCEL_TEXT}
              />
            </div>
          </div>
        )}
    </>
  );
};

export default OrderManagement;
