import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import '../styles/orderManagement.css';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  Col,
  Checkbox,
  Row,
  Select,
  Drawer,
  Skeleton,
  Modal,
  message,
} from 'antd';
import CustomTable from '@/components/customTable/CustomTable';
import {
  ARE_YOU_SURE_WANT_TO_DELETE_ORDER,
  ORDER_MODAL_CANCEL_TEXT,
  ORDER_MODAL_OK_TEXT,
  TOTAL_ITEMS_PER_PAGE,
} from '@/utils/constant.util';
import { FaPlus } from 'react-icons/fa6';
import { LuSlidersHorizontal } from 'react-icons/lu';
import { ORDER_MANAGEMENT_ORDER_STATUS_OPTIONS } from '@/utils/options';
import { TABLE_FOR_ORDER_MANAGEMENT } from '@/utils/columns';
import DisplayOrderDetails from '@/components/orders/DisplayOrderDetails';
import OrderFilters from '@/components/orders/OrderFilters';
import {
  deleteOrderById,
  getAllCreatedOrderData,
  getUserListBasedOnLoggedInPerson,
  resetOrderStateToInitialState,
  resetSearchPatientData,
  setSearchResponse,
  setTab1FormData,
} from '@/store/orderSlice';
import { resetCreateOrderDataBacktoInitialState } from '@/store/createOrderFormSlice';
import OrderModal from '@/components/orders/createOrder/OrderModal';
import { RiDeleteBinLine } from 'react-icons/ri';

const OrderManagement = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const userRole = useSelector((state) => state.auth.userRole);
  const user = useSelector((state) => state.auth.user);
  const { id: userId } = user || {};
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

  const [isAuth, setIsAuth] = useState(false);
  const [selectedUser, setSelectedUser] = useState('');
  const [checkedOrderStatus, setCheckedOrderStatus] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [clickedColumnId, setClickedColumnId] = useState(null);
  const [displayViewDrawer, setDisplayViewDrawer] = useState(false);
  const [displayFilterDrawer, setDisplayFilterDrawer] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  const [filterParams, setFilterparams] = useState({});
  const [isClearable, setIsClearable] = useState(false);
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState(ARE_YOU_SURE_WANT_TO_DELETE_ORDER);
  const [deleteRecord, setDeleteRecord] = useState(null);

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

  const handleCreateOrder = () => {
    dispatch(resetCreateOrderDataBacktoInitialState());
    dispatch(resetOrderStateToInitialState());
    router.push('/order-management/create');
  };

  const handleSelectUserChange = (value) => {
    setSelectedUser(value);
  };

  const handleOrderStatusChange = (value) => {
    setCheckedOrderStatus(value);
  };

  const handleViewOrders = (record) => {
    setDisplayViewDrawer(true);
    setClickedColumnId(record?.id);
    setDisplayFilterDrawer(false);
  };

  const handleEditOrders = (record) => {
    setClickedColumnId(record?.id);
    dispatch(setSearchResponse(true));
    router.push('/order-management/create?orderId=' + record?.id);
  };

  const handleDeleteOrders = async (record) => {
    const deletedOrder = await dispatch(deleteOrderById(record?.id));
    if (deletedOrder?.payload?.status) {
      message.success(deletedOrder?.payload?.message);
      dispatch(
        getAllCreatedOrderData({
          filters: {
            userId: selectedUser
              ? selectedUser === 'all'
                ? ''
                : selectedUser
              : userId,
            status: checkedOrderStatus,
            ...filterParams,
          },
          page: currentPage,
          pageSize: TOTAL_ITEMS_PER_PAGE,
          orderBy: 'updatedAt',
          ascending: false,
        })
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
    dispatch(resetSearchPatientData());
  };

  useEffect(() => {
    setIsAuth(isAuthenticated);
  }, [isAuthenticated, userRole]);

  useEffect(() => {
    dispatch(
      getAllCreatedOrderData({
        filters: {
          userId: selectedUser
            ? selectedUser === 'all'
              ? ''
              : selectedUser
            : userId,
          status: checkedOrderStatus,
          ...filterParams,
        },
        page: currentPage,
        pageSize: TOTAL_ITEMS_PER_PAGE,
        orderBy: 'updatedAt',
        ascending: false,
      })
    );
    dispatch(getUserListBasedOnLoggedInPerson());
  }, [currentPage, selectedUser, checkedOrderStatus]);

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

  return (
    <>
      {isAuth && userRole == 2 && (
        <div>
          <div className='order-management-parent-container'>
            <Row className='order-mgt-first-child-container'>
              <Col>
                <h3 className='order-mgt-heading'>Order Management</h3>
              </Col>
              <Col>
                <Button
                  size='large'
                  icon={<FaPlus />}
                  className='create-order-btn'
                  onClick={handleCreateOrder}
                >
                  Create Order
                </Button>
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
                  defaultValue={userId}
                />
              </Col>

              <Col>
                <Row className='order-mgt-filters-container'>
                  <Col>
                    <Checkbox.Group
                      options={ORDER_MANAGEMENT_ORDER_STATUS_OPTIONS}
                      // defaultValue={["draft"]}
                      value={checkedOrderStatus}
                      onChange={handleOrderStatusChange}
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
                page={currentPage}
                setPage={setCurrentPage}
                onClose={handleCloseDrawer}
                userId={selectedUser}
                Orderstatus={checkedOrderStatus}
                filterParams={filterParams}
                setFilterparams={setFilterparams}
                isClearable={isClearable}
                setIsClearable={setIsClearable}
              />
            </Drawer>
            {/* Delete Order Modal */}
            <OrderModal
              title={<RiDeleteBinLine color='red' size={45} />}
              open={open}
              handleOk={handleOk}
              confirmLoading={confirmLoading}
              handleCancel={handleCancel}
              modalText={modalText}
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
