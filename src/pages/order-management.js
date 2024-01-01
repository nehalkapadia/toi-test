import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import '../styles/orderManagement.css';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Col, Checkbox, Row, Select, Drawer, Skeleton } from 'antd';
import CustomTable from '@/components/customTable/CustomTable';
import { TOTAL_ITEMS_PER_PAGE } from '@/utils/constant.util';
import { FaPlus } from 'react-icons/fa6';
import { LuSlidersHorizontal } from 'react-icons/lu';
import { ORDER_MANAGEMENT_ORDER_STATUS_OPTIONS } from '@/utils/options';
import { TABLE_FOR_ORDER_MANAGEMENT } from '@/utils/columns';
import DisplayOrderDetails from '@/components/orders/DisplayOrderDetails';
import OrderFilters from '@/components/orders/OrderFilters';
import {
  getAllCreatedOrderData,
  getUserListBasedOnLoggedInPerson,
  setSearchResponse,
} from '@/store/orderSlice';
import { resetCreateOrderDataBacktoInitialState } from '@/store/createOrderFormSlice';

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
    dispatch(setSearchResponse(true))
    router.push('/order-management/create?orderId=' + record?.id);
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
        },
        page: currentPage,
        pageSize: TOTAL_ITEMS_PER_PAGE,
        orderBy: 'updatedAt',
        ascending: false,
      })
    );
    dispatch(getUserListBasedOnLoggedInPerson());
  }, [currentPage, selectedUser, checkedOrderStatus]);

  return (
    <>
      {isAuth && userRole == 2 && (
        <div>
          <div className="order-management-parent-container">
            <Row className="order-mgt-first-child-container">
              <Col>
                <h3 className="order-mgt-heading">Order Management</h3>
              </Col>
              <Col>
                <Button
                  size="large"
                  icon={<FaPlus />}
                  className="create-order-btn"
                  onClick={handleCreateOrder}
                >
                  Create Order
                </Button>
              </Col>
            </Row>

            <Row className="order-mgt-second-child-container">
              <Col>
                <Select
                  className="order-mgt-user-select-tag"
                  size="large"
                  options={generateDropdownOptions(getUsersListForDropdown)}
                  onChange={handleSelectUserChange}
                  placeholder="Select"
                  defaultValue={userId}
                />
              </Col>

              <Col>
                <Row className="order-mgt-filters-container">
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
                      size="large"
                      className="order-mgt-filter-btn"
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
                  rowKey="id"
                  rows={getAllOrders}
                  columns={TABLE_FOR_ORDER_MANAGEMENT}
                  isViewable={true}
                  isEditable={true}
                  onView={handleViewOrders}
                  onEdit={handleEditOrders}
                  rowSelectionType={false}
                  pagination={true}
                  current={currentPage}
                  pageSize={TOTAL_ITEMS_PER_PAGE}
                  total={totalOrderCount}
                  onPageChange={(page) => setCurrentPage(page)}
                  showQuickJumper={false}
                />
              )}
            </Row>

            {/* Drawer Start From Here */}

            {/* View Order Details Drawer */}
            <Drawer
              title="View Order"
              placement="right"
              open={displayViewDrawer}
              onClose={handleCloseDrawer}
              closable={true}
              width={'80%'}
              destroyOnClose={true}
              footer={
                <Col className="order-mgt-drawer-footer">
                  <Button
                    size="large"
                    className="order-mgt-drawer-close-btn"
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
              title="Filters"
              placement="right"
              open={displayFilterDrawer}
              onClose={handleCloseDrawer}
              closable={true}
              width={'300px'}
              destroyOnClose={false}
              footer={false}
            >
              <OrderFilters
                page={currentPage}
                onClose={handleCloseDrawer}
                userId={selectedUser}
                Orderstatus={checkedOrderStatus}
              />
            </Drawer>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderManagement;
