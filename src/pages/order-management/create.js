import React, { useEffect, useState } from 'react';
import '../../styles/orders/createOrder.css';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Segmented } from 'antd';
import { OrderManagementCreateOrderTabs } from '@/utils/options';
import PatientDemographics from '@/components/orders/createOrder/PatientDemographics';
import MedicalHistory from '@/components/orders/createOrder/MedicalHistory';
import InsuranceInfo from '@/components/orders/createOrder/InsuranceInfo';
import PatientDocs from '@/components/orders/createOrder/PatientDocs';
import { useRouter } from 'next/router';
import { getOrderDetailsById } from '@/store/orderSlice';
import {
  resetCreateOrderDataBacktoInitialState,
  setCurrentSelectedTab,
} from '@/store/createOrderFormSlice';
import { CREATE, EDIT } from '@/utils/constant.util';

const CreateOrder = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { orderId } = router.query;
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const userRole = useSelector((state) => state.auth.userRole);
  const tab2 = useSelector((state) => state.createOrderTabs.medicalHistoryTab);
  const tab3 = useSelector((state) => state.createOrderTabs.insuranceInfoTab);
  const tab4 = useSelector((state) => state.createOrderTabs.pateintDocsTab);
  const currentTab = useSelector(
    (state) => state.createOrderTabs.currentSelectedTab
  );

  const orderingResStatus = useSelector(
    (state) => state.allOrdersData.orderingResStatus
  );
  const referringResStatus = useSelector(
    (state) => state.allOrdersData.referringResStatus
  );
  const pcpNumberResStatus = useSelector(
    (state) => state.allOrdersData.pcpNumberResStatus
  );
  const [isAuth, setIsAuth] = useState(false);
  const [selectedTab, setSelectedTab] = useState('');

  const handleTabChange = (value) => {
    setSelectedTab(value);
    dispatch(setCurrentSelectedTab(value));
  };

  useEffect(() => {
    setIsAuth(isAuthenticated);
  }, [isAuthenticated, userRole]);

  useEffect(() => {
    setSelectedTab(currentTab);
  }, [currentTab]);

  useEffect(() => {
    if (orderId) {
      orderDetailsByOrderId(orderId);
    }
  }, [orderId]);

  const orderDetailsByOrderId = async (orderId) => {
    if (orderId) {
      await dispatch(getOrderDetailsById(orderId));
    } else {
      dispatch(resetCreateOrderDataBacktoInitialState());
    }
  };

  return (
    <>
      {isAuth && userRole == 2 && (
        <div className='create-order-parent-component'>
          <Row className='create-order-heading-container'>
            <h3 className='create-order-heading'>
              {orderId ? EDIT : CREATE} Order
            </h3>
          </Row>
          <Row>
            <Segmented
              size='large'
              options={OrderManagementCreateOrderTabs(tab2, tab3, tab4)}
              onChange={handleTabChange}
              value={selectedTab}
              block={true}
            />
          </Row>
          <div className='all-tabs-parent-container-at-co'>
            <div className='all-tabs-form-container-at-create-order'>
              {selectedTab === 'patientDemographics' && <PatientDemographics />}
              {selectedTab === 'medicalHistory' && <MedicalHistory />}
              {selectedTab === 'insuranceInfo' && <InsuranceInfo />}
              {selectedTab === 'patientDocuments' && <PatientDocs />}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateOrder;
