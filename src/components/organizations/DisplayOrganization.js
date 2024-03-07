import React, { useEffect, useState } from 'react';
import '../../styles/organizations/displayOrganization.css';
import { Button, Col, Drawer, Row, Skeleton } from 'antd';
import {
  ACTIVE_STATUS,
  INACTIVE_STATUS,
  ORG_MESSAGES,
  PERCENTAGE_TEXT_FOR_100,
  PERCENTAGE_TEXT_FOR_80,
} from '@/utils/constant.util';
import { useDispatch, useSelector } from 'react-redux';
import { getOrganizationsById } from '@/store/organizationSlice';
import { formatPhoneNumberToUSFormat } from '@/utils/commonFunctions';

const DisplayOrganization = ({ displayViewDrawer, columnId, onClose }) => {
  const dispatch = useDispatch();
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const isLoading = useSelector(
    (state) => state.organizationTable.viewIsLoading
  );
  const getOrgDetails =
    useSelector((state) => state.organizationTable.getOrgDetails) || {};

  const { name, email, phoneNumber, domain, address, isActive } = getOrgDetails;

  useEffect(() => {
    if (columnId) {
      dispatch(getOrganizationsById(columnId));
    }
  }, [columnId]);

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

  return (
    <Drawer
      title='View Organization'
      placement='right'
      open={displayViewDrawer}
      closable={true}
      onClose={onClose}
      width={isSmallScreen ? PERCENTAGE_TEXT_FOR_100 : PERCENTAGE_TEXT_FOR_80}
      destroyOnClose={true}
      footer={
        <Row className='view-org-footer-container'>
          <Button size='large' className='view-org-close-btn' onClick={onClose}>
            Close
          </Button>
        </Row>
      }
    >
      {isLoading ? (
        <Skeleton active paragraph={{ row: 18 }} />
      ) : (
        <div className='display-organization-container'>
          <Row span={24} gutter={24}>
            <Col
              className='display-org-each-column-gap'
              xs={{ span: 24 }}
              sm={{ span: 12 }}
              md={{ span: 8 }}
              lg={{ span: 6 }}
            >
              <label className='column-name-lable-at-om'>Organization</label>
              <h3 className='column-value-as-heading-at-om text-transform-class-om'>
                {name}
              </h3>
            </Col>

            <Col
              className='display-org-each-column-gap'
              xs={{ span: 24 }}
              sm={{ span: 12 }}
              md={{ span: 8 }}
              lg={{ span: 6 }}
            >
              <label className='column-name-lable-at-om'>Email ID</label>
              <h3 className='column-value-as-heading-at-om'>
                {email || 'N/A'}
              </h3>
            </Col>

            <Col
              className='display-org-each-column-gap'
              xs={{ span: 24 }}
              sm={{ span: 12 }}
              md={{ span: 8 }}
              lg={{ span: 6 }}
            >
              <label className='column-name-lable-at-om'>Phone Number</label>
              <h3 className='column-value-as-heading-at-om'>
                {formatPhoneNumberToUSFormat(phoneNumber)}
              </h3>
            </Col>

            <Col
              className='display-org-each-column-gap'
              xs={{ span: 24 }}
              sm={{ span: 12 }}
              md={{ span: 8 }}
              lg={{ span: 6 }}
            >
              <label className='column-name-lable-at-om'>Domain</label>
              <h3 className='column-value-as-heading-at-om text-transform-class-om'>
                {domain}
              </h3>
            </Col>

            <Col
              className='display-org-each-column-gap'
              xs={{ span: 24 }}
              sm={{ span: 12 }}
              md={{ span: 8 }}
              lg={{ span: 6 }}
            >
              <label className='column-name-lable-at-om'>Address</label>
              <h3 className='column-value-as-heading-at-om text-transform-class-om'>
                {address || ORG_MESSAGES.address_not_available}
              </h3>
            </Col>

            <Col
              className='display-org-each-column-gap'
              xs={{ span: 24 }}
              sm={{ span: 12 }}
              md={{ span: 8 }}
              lg={{ span: 6 }}
            >
              <label className='column-name-lable-at-om'>Status</label>
              <h3 className={`organization-current-${isActive}`}>
                {isActive ? ACTIVE_STATUS : INACTIVE_STATUS}
              </h3>
            </Col>
          </Row>
        </div>
      )}
    </Drawer>
  );
};

export default DisplayOrganization;
