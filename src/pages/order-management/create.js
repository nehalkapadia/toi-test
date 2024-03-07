import React, { useEffect, useState } from 'react';
import '../../styles/orders/createOrder.css';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Segmented } from 'antd';
import { OrderManagementCreateOrderTabs } from '@/utils/options';
import PatientDemographics from '@/components/orders/createOrder/PatientDemographics';
import MedicalHistory from '@/components/orders/createOrder/MedicalHistory';
import InsuranceInfo from '@/components/orders/createOrder/InsuranceInfo';
import OrderDetails from '@/components/orders/createOrder/OrderDetails';
import PatientDocs from '@/components/orders/createOrder/PatientDocs';
import { useRouter } from 'next/router';
import { getOrderDetailsById, getOrderTypeList } from '@/store/orderSlice';
import {
  resetCreateOrderDataBacktoInitialState,
  setCurrentSelectedTab,
} from '@/store/createOrderFormSlice';
import {
  CREATE,
  EDIT,
  ORDER_MANAGEMENT_ACCESS_ROLES_ARRAY,
  ORDER_TYPES_ARRAY,
} from '@/utils/constant.util';

const CreateOrder = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { orderId, type } = router.query;
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const userRole = useSelector((state) => state.auth.userRole);
  const tab1 = useSelector(
    (state) => state.createOrderTabs.patientDemographicsTab
  );
  const orderTypeList = useSelector(
    (state) => state.allOrdersData.orderTypeList
  );

  const tab2 = useSelector((state) => state.createOrderTabs.medicalHistoryTab);
  const tab3 = useSelector((state) => state.createOrderTabs.insuranceInfoTab);
  const tab4 = useSelector((state) => state.createOrderTabs.orderDetailsTab);
  const tab5 = useSelector((state) => state.createOrderTabs.pateintDocsTab);
  const currentTab = useSelector(
    (state) => state.createOrderTabs.currentSelectedTab
  );
  const [isAuth, setIsAuth] = useState(false);
  const [selectedTab, setSelectedTab] = useState('');

  const handleTabChange = (value) => {
    setSelectedTab(value);
    dispatch(setCurrentSelectedTab(value));
  };

  const orderDetailsByOrderId = async (orderId) => {
    if (orderId) {
      await dispatch(getOrderDetailsById(orderId));
    } else {
      dispatch(resetCreateOrderDataBacktoInitialState());
    }
  };

  useEffect(() => {
    setIsAuth(isAuthenticated);
  }, [isAuthenticated, userRole]);

  useEffect(() => {
    setSelectedTab(currentTab);
  }, [currentTab]);

  useEffect(() => {
    dispatch(getOrderTypeList());
    if (orderId) {
      orderDetailsByOrderId(orderId);
    }
  }, [orderId]);

  return (
    <>
      {isAuth &&
        ORDER_MANAGEMENT_ACCESS_ROLES_ARRAY?.includes(Number(userRole)) &&
        ORDER_TYPES_ARRAY?.includes(type) && (
          <div className='create-order-parent-component'>
            <Row className='create-order-heading-container'>
              <h3 className='create-order-heading'>
                {orderId ? EDIT : CREATE} Order
              </h3>
            </Row>
            <Row>
              <Segmented
                size='large'
                options={OrderManagementCreateOrderTabs(
                  tab1,
                  tab2,
                  tab3,
                  tab4,
                  tab5
                )}
                onChange={handleTabChange}
                value={selectedTab}
                block={true}
              />
            </Row>
            <div className='all-tabs-parent-container-at-co'>
              <div>
                {selectedTab === 'patientDemographics' && (
                  <PatientDemographics />
                )}
                {selectedTab === 'medicalHistory' && <MedicalHistory />}
                {selectedTab === 'insuranceInfo' && <InsuranceInfo />}
                {selectedTab === 'patientDocuments' && <PatientDocs />}
                {selectedTab === 'orderDetails' && <OrderDetails />}
              </div>
            </div>
          </div>
        )}
    </>
  );
};

export default CreateOrder;
