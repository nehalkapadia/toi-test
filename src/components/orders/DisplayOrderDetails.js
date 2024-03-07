import React, { useEffect, useState } from 'react';
import '../../styles/orders/displayOrderDetails.css';
import { Col, Row, Tabs } from 'antd';
import { DisplayFilesContainer } from './createOrder/UploadedImageContainer';
import { useDispatch, useSelector } from 'react-redux';
import {
  getOrderDetailsById,
  getPatientDocumentsAtEdit,
} from '@/store/orderSlice';
import { DISPLAY_DIFFERENT_TABS_OF_ORDER_MANAGEMENT } from '@/utils/options';
import { formatPhoneNumberToUSFormat } from '@/utils/commonFunctions';
import dayjs from 'dayjs';
import {
  CHEMO_ORDER_TYPE,
  DATE_FORMAT_STARTING_FROM_MONTH,
  LAB,
  MAX_CPT_CODE_TO_BE_UPLOADED,
  NA,
  OFFICE_VISIT_ORDER_TYPE,
  PATHOLOGY,
  PREVIOUS_AUTHORIZATION,
  RADIATION_ORDER_TYPE,
  RADIOLOGY,
} from '@/utils/constant.util';
import NoFileDisplay from './NoFileDisplay';
import CustomTable from '../customTable/CustomTable';
import {
  TABLE_FOR_CPT_CODES_AT_ORDER_DETAILS_CHEMO,
  TABLE_FOR_CPT_CODES_AT_ORDER_DETAILS_TAB,
} from '@/utils/columns';

const DisplayOrderDetails = ({ columnId }) => {
  const dispatch = useDispatch();
  const getOrderDetails = useSelector(
    (state) => state.allOrdersData.getOrderDetails
  );
  const patientAllUploadedFilesData = useSelector(
    (state) => state.allOrdersData.patientAllUploadedFilesData
  );
  const patientUploadedDocsData = useSelector(
    (state) => state.allOrdersData.patientUploadedDocsData
  );

  const {
    insuranceCardCopyFiles = [],
    labStatusFiles = [],
    medicalReleaseFiles = [],
    pathologyFiles = [],
    prevAuthorizationFiles = [],
    radiologyFiles = [],
    secondaryInsuranceFiles = [],
  } = patientAllUploadedFilesData || {};

  const {
    mdNotesFiles = [],
    writtenOrdersFiles = [],
    patientAuthDocFiles = [],
  } = patientUploadedDocsData || {};

  const [selectedTab, setSelectedTab] = useState(1);

  const {
    patientDemography: patientDemographics,
    medicalHistory,
    medicalRecord,
    insuranceInfo,
    orderDetails,
    orderTypeData,
  } = getOrderDetails || {};

  const handleChangeOfCategoryTab = (key) => {
    setSelectedTab(key);
  };

  useEffect(() => {
    if (columnId) {
      dispatch(getOrderDetailsById(columnId)).then((res) => {
        if (res?.payload?.status) {
          const { patientId, orderTypeId } = res?.payload?.data;
          const isSecondaryInsurance =
            res?.payload?.data?.insuranceInfo?.secondaryInsurance;
          dispatch(
            getPatientDocumentsAtEdit({
              patientId,
              orderId: columnId,
              orderTypeId,
              view: true,
              isSecondaryInsurance,
            })
          );
          // had to clear all documents variable when we close this drawer
        }
      });
    }
  }, [columnId]);

  const getProviderName = (orderingData) => {
    if (orderingData?.first_name) {
      return `${orderingData?.first_name} ${orderingData?.last_name}`;
    } else {
      return false;
    }
  };

  const getMedicalRecordStatus = (type) => {
    switch (type) {
      case RADIOLOGY:
        return medicalRecord?.isRadiologyStatus || radiologyFiles?.length > 0
          ? 'Yes'
          : 'No';
      case PATHOLOGY:
        return medicalRecord?.isPathologyStatus || pathologyFiles?.length > 0
          ? 'Yes'
          : 'No';
      case LAB:
        return medicalRecord?.isLabStatus || labStatusFiles?.length > 0
          ? 'Yes'
          : 'No';
      case PREVIOUS_AUTHORIZATION:
        return medicalRecord?.isPreviousAuthorizationStatus ||
          prevAuthorizationFiles?.length > 0
          ? 'Yes'
          : 'No';
      default:
        return 'No';
    }
  };

  return (
    <div className='display-order-details-parent-container'>
      <Row>
        <Tabs
          tabBarGutter={120}
          items={DISPLAY_DIFFERENT_TABS_OF_ORDER_MANAGEMENT}
          activeKey={selectedTab}
          onChange={handleChangeOfCategoryTab}
        />
      </Row>

      {selectedTab === 1 && (
        <div>
          <Col>
            <h3 className='order-type-heading-text-at-view-order'>
              {orderTypeData?.name}
            </h3>
          </Col>
          <Row span={24} gutter={24}>
            <Col
              className='dod-tabs-for-each-row-gap'
              xs={{ span: 24 }}
              sm={{ span: 12 }}
              md={{ span: 8 }}
              lg={{ span: 6 }}
            >
              <label className='dod-tabs-label-text'>First Name</label>
              <h3 className='dod-tabs-inner-heading-for-titles'>
                {patientDemographics?.firstName}
              </h3>
            </Col>
            <Col
              className='dod-tabs-for-each-row-gap'
              xs={{ span: 24 }}
              sm={{ span: 12 }}
              md={{ span: 8 }}
              lg={{ span: 6 }}
            >
              <label className='dod-tabs-label-text'>Last Name</label>
              <h3 className='dod-tabs-inner-heading-for-titles'>
                {patientDemographics?.lastName}
              </h3>
            </Col>
            <Col
              className='dod-tabs-for-each-row-gap'
              xs={{ span: 24 }}
              sm={{ span: 12 }}
              md={{ span: 8 }}
              lg={{ span: 6 }}
            >
              <label className='dod-tabs-label-text'>Gender</label>
              <h3 className='dod-tabs-inner-heading-for-titles'>
                {patientDemographics?.gender}
              </h3>
            </Col>
            <Col
              className='dod-tabs-for-each-row-gap'
              xs={{ span: 24 }}
              sm={{ span: 12 }}
              md={{ span: 8 }}
              lg={{ span: 6 }}
            >
              <label className='dod-tabs-label-text'>Date Of Birth</label>
              <h3 className='dod-tabs-inner-heading-for-titles'>
                {dayjs(patientDemographics?.dob).format(
                  DATE_FORMAT_STARTING_FROM_MONTH
                )}
              </h3>
            </Col>

            <Col
              className='dod-tabs-for-each-row-gap'
              xs={{ span: 24 }}
              sm={{ span: 12 }}
              md={{ span: 8 }}
              lg={{ span: 6 }}
            >
              <label className='dod-tabs-label-text'>Member Cell Phone</label>
              <h3 className='dod-tabs-inner-heading-for-titles'>
                {formatPhoneNumberToUSFormat(
                  patientDemographics?.primaryPhoneNumber
                ) || NA}
              </h3>
            </Col>
            <Col
              className='dod-tabs-for-each-row-gap'
              xs={{ span: 24 }}
              sm={{ span: 12 }}
              md={{ span: 8 }}
              lg={{ span: 6 }}
            >
              <label className='dod-tabs-label-text'>Member Home Phone</label>
              <h3 className='dod-tabs-inner-heading-for-titles'>
                {formatPhoneNumberToUSFormat(
                  patientDemographics?.secondaryPhoneNumber
                ) || NA}
              </h3>
            </Col>
            <Col
              className='dod-tabs-for-each-row-gap'
              xs={{ span: 24 }}
              sm={{ span: 12 }}
              md={{ span: 8 }}
              lg={{ span: 6 }}
            >
              <label className='dod-tabs-label-text'>Email</label>
              <h3 className='dod-tabs-inner-email-field'>
                {patientDemographics?.email || NA}
              </h3>
            </Col>
            <Col
              className='dod-tabs-for-each-row-gap'
              xs={{ span: 24 }}
              sm={{ span: 12 }}
              md={{ span: 8 }}
              lg={{ span: 6 }}
            >
              <label className='dod-tabs-label-text'>Preferred Language</label>
              <h3 className='dod-tabs-inner-heading-for-titles'>
                {patientDemographics?.preferredLanguage || NA}
              </h3>
            </Col>
            <Col
              className='dod-tabs-for-each-row-gap'
              xs={{ span: 24 }}
              sm={{ span: 12 }}
              md={{ span: 8 }}
              lg={{ span: 6 }}
            >
              <label className='dod-tabs-label-text'>Member ID</label>
              <h3 className='dod-tabs-inner-heading-for-titles'>
                {patientDemographics?.hsMemberID || NA}
              </h3>
            </Col>
            <Col
              className='dod-tabs-for-each-row-gap'
              xs={{ span: 24 }}
              sm={{ span: 12 }}
              md={{ span: 8 }}
              lg={{ span: 6 }}
            >
              <label className='dod-tabs-label-text'>Address</label>
              <h3 className='dod-tabs-inner-heading-for-titles'>
                {patientDemographics?.address || NA}
              </h3>
            </Col>
          </Row>
        </div>
      )}

      {selectedTab === 2 && (
        <div>
          <Col>
            <h3 className='order-type-heading-text-at-view-order'>
              {orderTypeData?.name}
            </h3>
          </Col>
          <Row span={24} gutter={24}>
            <Col
              className='dod-tabs-for-each-row-gap'
              xs={{ span: 24 }}
              sm={{ span: 8 }}
              md={{ span: 6 }}
              lg={{ span: 6 }}
            >
              <label className='dod-tabs-label-text'>Diagnosis</label>
              <h3 className='dod-tabs-inner-heading-for-titles'>
                {medicalHistory?.diagnosis || NA}
              </h3>
            </Col>
            {(orderTypeData?.name === OFFICE_VISIT_ORDER_TYPE ||
              orderTypeData?.name === RADIATION_ORDER_TYPE) && (
              <Col
                className='dod-tabs-for-each-row-gap'
                xs={{ span: 24 }}
                sm={{ span: 8 }}
                md={{ span: 6 }}
                lg={{ span: 6 }}
              >
                <label className='dod-tabs-label-text'>Date Of Visit</label>
                <h3 className='dod-tabs-inner-heading-for-titles'>
                  {medicalHistory?.dateOfVisit
                    ? dayjs(medicalHistory?.dateOfVisit).format(
                        DATE_FORMAT_STARTING_FROM_MONTH
                      )
                    : NA}
                </h3>
              </Col>
            )}
            {orderTypeData?.name === CHEMO_ORDER_TYPE && (
              <>
                <Col
                  className='dod-tabs-for-each-row-gap'
                  xs={{ span: 24 }}
                  sm={{ span: 8 }}
                  md={{ span: 6 }}
                  lg={{ span: 6 }}
                >
                  <label className='dod-tabs-label-text'>
                    Chemotherapy Status
                  </label>
                  <h3
                    className={`dod-tabs-inner-heading-for-titles dod-class-for-diff-status-${medicalHistory?.chemoTherapyStatus}`}
                  >
                    {medicalHistory?.chemoTherapyStatus ? 'Yes' : 'No'}
                  </h3>
                </Col>
                <Col
                  className='dod-tabs-for-each-row-gap'
                  xs={{ span: 24 }}
                  sm={{ span: 8 }}
                  md={{ span: 6 }}
                  lg={{ span: 6 }}
                >
                  <label className='dod-tabs-label-text'>
                    Received Prior Treatment?
                  </label>
                  <h3
                    className={`dod-tabs-inner-heading-for-titles dod-class-for-diff-status-${medicalHistory?.chemoTherapyStatus}`}
                  >
                    {medicalHistory?.chemoTherapyStatus ? 'Yes' : 'No'}
                  </h3>
                </Col>
                <Col
                  className='dod-tabs-for-each-row-gap'
                  xs={{ span: 24 }}
                  sm={{ span: 8 }}
                  md={{ span: 6 }}
                  lg={{ span: 6 }}
                >
                  <label className='dod-tabs-label-text'>
                    Chemotherapy Ordered
                  </label>
                  <h3
                    className={`dod-tabs-inner-heading-for-titles dod-class-for-diff-status-${medicalHistory?.chemotherapyOrdered}`}
                  >
                    {medicalHistory?.chemoTherapyStatus
                      ? dayjs(medicalHistory?.chemotherapyOrdered).format(
                          DATE_FORMAT_STARTING_FROM_MONTH
                        )
                      : NA}
                  </h3>
                </Col>
              </>
            )}
            { (orderTypeData?.name === OFFICE_VISIT_ORDER_TYPE || orderTypeData?.name === RADIATION_ORDER_TYPE) && (
              <>
                <Col
                  className='dod-tabs-for-each-row-gap'
                  xs={{ span: 24 }}
                  sm={{ span: 8 }}
                  md={{ span: 6 }}
                  lg={{ span: 6 }}
                >
                  <label className='dod-tabs-label-text'>
                    Ordering Provider
                  </label>
                  <h3 className='dod-tabs-inner-heading-for-titles'>
                    {medicalHistory?.orderingProvider || NA}
                  </h3>
                </Col>
                <Col
                  className='dod-tabs-for-each-row-gap'
                  xs={{ span: 24 }}
                  sm={{ span: 8 }}
                  md={{ span: 6 }}
                  lg={{ span: 6 }}
                >
                  <label className='dod-tabs-label-text'>
                    Ordering Provider Name
                  </label>
                  <h3 className='dod-tabs-inner-heading-for-titles'>
                    {getProviderName(medicalHistory?.orderingProviderData) ||
                      NA}
                  </h3>
                </Col>
            </>
          )}
          </Row>

          {orderTypeData?.name === CHEMO_ORDER_TYPE && (
            <>
              <Row span={24} gutter={24}>
                <Col
                  className='dod-tabs-for-each-row-gap'
                  xs={{ span: 24 }}
                  sm={{ span: 8 }}
                  md={{ span: 6 }}
                  lg={{ span: 6 }}
                >
                  <label className='dod-tabs-label-text'>
                    Ordering Provider
                  </label>
                  <h3 className='dod-tabs-inner-heading-for-titles'>
                    {medicalHistory?.orderingProvider || NA}
                  </h3>
                </Col>

                <Col
                  className='dod-tabs-for-each-row-gap'
                  xs={{ span: 24 }}
                  sm={{ span: 8 }}
                  md={{ span: 6 }}
                  lg={{ span: 6 }}
                >
                  <label className='dod-tabs-label-text'>
                    Referring Provider
                  </label>
                  <h3 className='dod-tabs-inner-heading-for-titles'>
                    {medicalHistory?.referringProvider || NA}
                  </h3>
                </Col>

                <Col
                  className='dod-tabs-for-each-row-gap'
                  xs={{ span: 24 }}
                  sm={{ span: 8 }}
                  md={{ span: 6 }}
                  lg={{ span: 6 }}
                >
                  <label className='dod-tabs-label-text'>PCP Number</label>
                  <h3 className='dod-tabs-inner-heading-for-titles'>
                    {medicalHistory?.pcpName ||
                      medicalHistory?.referringProvider ||
                      NA}
                  </h3>
                </Col>
                <Col
                  className='dod-tabs-for-each-row-gap'
                  xs={{ span: 24 }}
                  sm={{ span: 8 }}
                  md={{ span: 6 }}
                  lg={{ span: 6 }}
                >
                  <label className='dod-tabs-label-text'>Date Of Visit</label>
                  <h3 className='dod-tabs-inner-heading-for-titles'>
                    {medicalHistory?.dateOfVisit
                      ? dayjs(medicalHistory?.dateOfVisit).format(
                          DATE_FORMAT_STARTING_FROM_MONTH
                        )
                      : NA}
                  </h3>
                </Col>
              </Row>

              <Row span={24} gutter={24}>
                <Col
                  className='dod-tabs-for-each-row-gap'
                  xs={{ span: 24 }}
                  sm={{ span: 8 }}
                  md={{ span: 6 }}
                  lg={{ span: 6 }}
                >
                  <label className='dod-tabs-label-text'>
                    Ordering Provider Name
                  </label>
                  <h3 className='dod-tabs-inner-heading-for-titles'>
                    {getProviderName(medicalHistory?.orderingProviderData) ||
                      NA}
                  </h3>
                </Col>

                <Col
                  className='dod-tabs-for-each-row-gap'
                  xs={{ span: 24 }}
                  sm={{ span: 8 }}
                  md={{ span: 6 }}
                  lg={{ span: 6 }}
                >
                  <label className='dod-tabs-label-text'>
                    Referring Provider Name
                  </label>
                  <h3 className='dod-tabs-inner-heading-for-titles'>
                    {getProviderName(medicalHistory?.referringProviderData) ||
                      NA}
                  </h3>
                </Col>

                <Col
                  className='dod-tabs-for-each-row-gap'
                  xs={{ span: 24 }}
                  sm={{ span: 8 }}
                  md={{ span: 6 }}
                  lg={{ span: 6 }}
                >
                  <label className='dod-tabs-label-text'>PCP Number Name</label>
                  <h3 className='dod-tabs-inner-heading-for-titles'>
                    {getProviderName(medicalHistory?.pcpNameData) ||
                      getProviderName(medicalHistory?.referringProviderData) ||
                      NA}
                  </h3>
                </Col>
              </Row>

              <Row span={24} gutter={24}>
                <Col
                  className='dod-tabs-for-each-row-gap'
                  xs={{ span: 24 }}
                  sm={{ span: 8 }}
                  md={{ span: 6 }}
                  lg={{ span: 6 }}
                >
                  <label className='dod-tabs-label-text'>
                    Radiology Status
                  </label>
                  <h3 className='dod-tabs-inner-heading-for-titles'>
                    {getMedicalRecordStatus(RADIOLOGY)}
                  </h3>
                </Col>
                <Col
                  className='dod-tabs-for-each-row-gap'
                  xs={{ span: 24 }}
                  sm={{ span: 8 }}
                  md={{ span: 6 }}
                  lg={{ span: 6 }}
                >
                  <label className='dod-tabs-label-text'>
                    Radiology Facility
                  </label>
                  <h3 className='dod-tabs-inner-heading-for-titles'>
                    {medicalRecord?.isRadiologyStatus
                      ? medicalRecord?.radiologyFacility || NA
                      : NA}
                  </h3>
                </Col>
              </Row>

              <Row span={24} gutter={24} className='upload-btm-mr-25'>
                <Col span={24} className='upload-documents-container-at-tab-2'>
                  <label className='dod-tabs-label-text'>
                    Uploaded Radiology Documents
                  </label>
                </Col>

                {radiologyFiles?.length > 0 ? (
                  radiologyFiles?.map((elem) => (
                    <Col
                      className='dod-tabs-for-each-row-gap'
                      xs={{ span: 24 }}
                      sm={{ span: 12 }}
                      md={{ span: 8 }}
                      lg={{ span: 8 }}
                      key={elem?.id}
                    >
                      <DisplayFilesContainer dataObj={elem} />
                    </Col>
                  ))
                ) : (
                  <NoFileDisplay />
                )}
              </Row>

              <Row span={24} gutter={24}>
                <Col
                  className='dod-tabs-for-each-row-gap'
                  xs={{ span: 24 }}
                  sm={{ span: 8 }}
                  md={{ span: 6 }}
                  lg={{ span: 6 }}
                >
                  <label className='dod-tabs-label-text'>
                    Pathology Status
                  </label>
                  <h3 className='dod-tabs-inner-heading-for-titles'>
                    {getMedicalRecordStatus(PATHOLOGY)}
                  </h3>
                </Col>
                <Col
                  className='dod-tabs-for-each-row-gap'
                  xs={{ span: 24 }}
                  sm={{ span: 8 }}
                  md={{ span: 6 }}
                  lg={{ span: 6 }}
                >
                  <label className='dod-tabs-label-text'>
                    Pathology Facility
                  </label>
                  <h3 className='dod-tabs-inner-heading-for-titles'>
                    {medicalRecord?.isPathologyStatus
                      ? medicalRecord?.pathologyFacility || NA
                      : NA}
                  </h3>
                </Col>
              </Row>

              <Row span={24} gutter={24} className='upload-btm-mr-25'>
                <Col span={24} className='upload-documents-container-at-tab-2'>
                  <label className='dod-tabs-label-text'>
                    Uploaded Pathology Documents
                  </label>
                </Col>

                {pathologyFiles?.length > 0 ? (
                  pathologyFiles?.map((elem) => (
                    <Col
                      className='dod-tabs-for-each-row-gap'
                      xs={{ span: 24 }}
                      sm={{ span: 12 }}
                      md={{ span: 8 }}
                      lg={{ span: 8 }}
                      key={elem?.id}
                    >
                      <div>
                        <DisplayFilesContainer dataObj={elem} />
                      </div>
                    </Col>
                  ))
                ) : (
                  <NoFileDisplay />
                )}
              </Row>

              <Row span={24} gutter={24}>
                <Col
                  className='dod-tabs-for-each-row-gap'
                  xs={{ span: 24 }}
                  sm={{ span: 8 }}
                  md={{ span: 6 }}
                  lg={{ span: 6 }}
                >
                  <label className='dod-tabs-label-text'>Lab Status</label>
                  <h3 className='dod-tabs-inner-heading-for-titles'>
                    {getMedicalRecordStatus(LAB)}
                  </h3>
                </Col>
                <Col
                  className='dod-tabs-for-each-row-gap'
                  xs={{ span: 24 }}
                  sm={{ span: 8 }}
                  md={{ span: 6 }}
                  lg={{ span: 6 }}
                >
                  <label className='dod-tabs-label-text'>Lab Facility</label>
                  <h3 className='dod-tabs-inner-heading-for-titles'>
                    {medicalRecord?.isLabStatus
                      ? medicalRecord?.labFacility || NA
                      : NA}
                  </h3>
                </Col>
              </Row>

              <Row span={24} gutter={24} className='upload-btm-mr-25'>
                <Col span={24} className='upload-documents-container-at-tab-2'>
                  <label className='dod-tabs-label-text'>
                    Uploaded Lab Documents
                  </label>
                </Col>

                {labStatusFiles?.length > 0 ? (
                  labStatusFiles?.map((elem) => (
                    <Col
                      className='dod-tabs-for-each-row-gap'
                      xs={{ span: 24 }}
                      sm={{ span: 12 }}
                      md={{ span: 8 }}
                      lg={{ span: 8 }}
                      key={elem?.id}
                    >
                      <div>
                        <DisplayFilesContainer dataObj={elem} />
                      </div>
                    </Col>
                  ))
                ) : (
                  <NoFileDisplay />
                )}
              </Row>

              <Row span={24} gutter={24}>
                <Col
                  className='dod-tabs-for-each-row-gap'
                  xs={{ span: 24 }}
                  sm={{ span: 8 }}
                  md={{ span: 6 }}
                  lg={{ span: 6 }}
                >
                  <label className='dod-tabs-label-text'>
                    Previous Authorization
                  </label>
                  <h3 className='dod-tabs-inner-heading-for-titles'>
                    {getMedicalRecordStatus(PREVIOUS_AUTHORIZATION)}
                  </h3>
                </Col>
              </Row>

              <Row span={24} gutter={24} className='upload-btm-mr-25'>
                <Col span={24} className='upload-documents-container-at-tab-2'>
                  <label className='dod-tabs-label-text'>
                    Previous Authorization Uploaded Documents
                  </label>
                </Col>

                {prevAuthorizationFiles?.length > 0 ? (
                  prevAuthorizationFiles?.map((elem) => (
                    <Col
                      className='dod-tabs-for-each-row-gap'
                      xs={{ span: 24 }}
                      sm={{ span: 12 }}
                      md={{ span: 8 }}
                      lg={{ span: 8 }}
                      key={elem?.id}
                    >
                      <div>
                        <DisplayFilesContainer dataObj={elem} />
                      </div>
                    </Col>
                  ))
                ) : (
                  <NoFileDisplay />
                )}
              </Row>

              <Row span={24} gutter={24} className='upload-btm-mr-25'>
                <Col span={24} className='upload-documents-container-at-tab-2'>
                  <label className='dod-tabs-label-text'>
                    Single Medical Release Form
                  </label>
                </Col>

                {medicalReleaseFiles?.length > 0 ? (
                  medicalReleaseFiles?.map((elem) => (
                    <Col
                      className='dod-tabs-for-each-row-gap'
                      xs={{ span: 24 }}
                      sm={{ span: 12 }}
                      md={{ span: 8 }}
                      lg={{ span: 8 }}
                      key={elem?.id}
                    >
                      <div>
                        <DisplayFilesContainer dataObj={elem} />
                      </div>
                    </Col>
                  ))
                ) : (
                  <NoFileDisplay />
                )}
              </Row>
            </>
          )}
        </div>
      )}

      {selectedTab === 3 && (
        <div>
          <Col>
            <h3 className='order-type-heading-text-at-view-order'>
              {orderTypeData?.name}
            </h3>
          </Col>
          <Row span={24} gutter={24}>
            <Col
              className='dod-tabs-for-each-row-gap'
              xs={{ span: 24 }}
              sm={{ span: 8 }}
              md={{ span: 6 }}
              lg={{ span: 6 }}
            >
              <label className='dod-tabs-label-text'>Health Plan</label>
              <h3 className='dod-tabs-inner-heading-for-titles'>
                {insuranceInfo?.healthPlan || NA}
              </h3>
            </Col>
            <Col
              className='dod-tabs-for-each-row-gap'
              xs={{ span: 24 }}
              sm={{ span: 8 }}
              md={{ span: 6 }}
              lg={{ span: 6 }}
            >
              <label className='dod-tabs-label-text'>LoB</label>
              <h3 className='dod-tabs-inner-heading-for-titles'>
                {insuranceInfo?.lob || NA}
              </h3>
            </Col>

            {insuranceInfo?.medicareId && (
              <Col
                className='dod-tabs-for-each-row-gap'
                xs={{ span: 24 }}
                sm={{ span: 8 }}
                md={{ span: 6 }}
                lg={{ span: 6 }}
              >
                <label className='dod-tabs-label-text'>Medicare</label>
                <h3 className='dod-tabs-inner-heading-for-titles'>
                  {insuranceInfo?.medicareId || NA}
                </h3>
              </Col>
            )}
          </Row>

          <Row span={24} gutter={24}>
            <Col
              className='dod-tabs-for-each-row-gap'
              xs={{ span: 24 }}
              sm={{ span: 8 }}
              md={{ span: 6 }}
              lg={{ span: 6 }}
            >
              <label className='dod-tabs-label-text'>
                Primary Subscriber Number
              </label>
              <h3 className='dod-tabs-inner-heading-for-titles'>
                {insuranceInfo?.primarySubscriberNumber || NA}
              </h3>
            </Col>
            <Col
              className='dod-tabs-for-each-row-gap'
              xs={{ span: 24 }}
              sm={{ span: 8 }}
              md={{ span: 6 }}
              lg={{ span: 6 }}
            >
              <label className='dod-tabs-label-text'>
                Primary Group Number
              </label>
              <h3 className='dod-tabs-inner-heading-for-titles'>
                {insuranceInfo?.primaryGroupNumber || NA}
              </h3>
            </Col>
          </Row>

          <Row span={24} gutter={24}>
            <Col
              className='dod-tabs-for-each-row-gap'
              xs={{ span: 24 }}
              sm={{ span: 8 }}
              md={{ span: 6 }}
              lg={{ span: 6 }}
            >
              <label className='dod-tabs-label-text'>
                Secondary Subscriber Number
              </label>
              <h3 className='dod-tabs-inner-heading-for-titles'>
                {insuranceInfo?.secondarySubscriberNumber || NA}
              </h3>
            </Col>
            <Col
              className='dod-tabs-for-each-row-gap'
              xs={{ span: 24 }}
              sm={{ span: 8 }}
              md={{ span: 6 }}
              lg={{ span: 6 }}
            >
              <label className='dod-tabs-label-text'>
                Secondary Group Number
              </label>
              <h3 className='dod-tabs-inner-heading-for-titles'>
                {insuranceInfo?.secondaryGroupNumber || NA}
              </h3>
            </Col>
          </Row>

          <Row span={24} gutter={24}>
            <Col
              className='dod-tabs-for-each-row-gap'
              xs={{ span: 24 }}
              sm={{ span: 8 }}
              md={{ span: 6 }}
              lg={{ span: 6 }}
            >
              <label className='dod-tabs-label-text'>Primary Insurance</label>
              <h3 className='dod-tabs-inner-heading-for-titles'>{'Yes'}</h3>
            </Col>
            <Col
              className='dod-tabs-for-each-row-gap'
              xs={{ span: 24 }}
              sm={{ span: 8 }}
              md={{ span: 6 }}
              lg={{ span: 6 }}
            >
              <label className='dod-tabs-label-text'>Primary Start Date</label>
              <h3 className='dod-tabs-inner-heading-for-titles'>
                {insuranceInfo?.primaryStartDate
                  ? dayjs(insuranceInfo?.primaryStartDate).format(
                      DATE_FORMAT_STARTING_FROM_MONTH
                    )
                  : NA}
              </h3>
            </Col>
            <Col
              className='dod-tabs-for-each-row-gap'
              xs={{ span: 24 }}
              sm={{ span: 8 }}
              md={{ span: 6 }}
              lg={{ span: 6 }}
            >
              <label className='dod-tabs-label-text'>Primary End Date</label>
              <h3 className='dod-tabs-inner-heading-for-titles'>
                {insuranceInfo?.primaryEndDate
                  ? dayjs(insuranceInfo?.primaryEndDate).format(
                      DATE_FORMAT_STARTING_FROM_MONTH
                    )
                  : NA}
              </h3>
            </Col>
          </Row>

          <Row span={24} gutter={24} className='upload-btm-mr-25'>
            <Col span={24} className='upload-documents-container-at-tab-2'>
              <label className='dod-tabs-label-text'>
                Copy Of Insurance Card
              </label>
            </Col>

            {insuranceCardCopyFiles?.length > 0 ? (
              insuranceCardCopyFiles?.map((elem) => (
                <Col
                  className='dod-tabs-for-each-row-gap'
                  xs={{ span: 24 }}
                  sm={{ span: 12 }}
                  md={{ span: 8 }}
                  lg={{ span: 8 }}
                  key={elem?.id}
                >
                  <div>
                    <DisplayFilesContainer dataObj={elem} />
                  </div>
                </Col>
              ))
            ) : (
              <NoFileDisplay />
            )}
          </Row>

          <Row span={24} gutter={24}>
            <Col
              className='dod-tabs-for-each-row-gap'
              xs={{ span: 24 }}
              sm={{ span: 8 }}
              md={{ span: 6 }}
              lg={{ span: 6 }}
            >
              <label className='dod-tabs-label-text'>Secondary Insurance</label>
              <h3 className='dod-tabs-inner-heading-for-titles'>
                {insuranceInfo?.secondaryInsurance || NA}
              </h3>
            </Col>

            {insuranceInfo?.secondaryInsurance && (
              <>
                <Col
                  className='dod-tabs-for-each-row-gap'
                  xs={{ span: 24 }}
                  sm={{ span: 8 }}
                  md={{ span: 6 }}
                  lg={{ span: 6 }}
                >
                  <label className='dod-tabs-label-text'>
                    Secondary Start Date
                  </label>
                  <h3 className='dod-tabs-inner-heading-for-titles'>
                    {insuranceInfo?.secondaryStartDate
                      ? dayjs(insuranceInfo?.secondaryStartDate).format(
                          DATE_FORMAT_STARTING_FROM_MONTH
                        )
                      : NA}
                  </h3>
                </Col>

                <Col
                  className='dod-tabs-for-each-row-gap'
                  xs={{ span: 24 }}
                  sm={{ span: 8 }}
                  md={{ span: 6 }}
                  lg={{ span: 6 }}
                >
                  <label className='dod-tabs-label-text'>
                    Secondary End Date
                  </label>
                  <h3 className='dod-tabs-inner-heading-for-titles'>
                    {insuranceInfo?.secondaryEndDate
                      ? dayjs(insuranceInfo?.secondaryEndDate).format(
                          DATE_FORMAT_STARTING_FROM_MONTH
                        )
                      : NA}
                  </h3>
                </Col>
              </>
            )}
          </Row>

          <Row span={24} gutter={24}>
            <Col span={24} className='upload-documents-container-at-tab-2'>
              <label className='dod-tabs-label-text'>
                Secondary Insurance Documents
              </label>
            </Col>

            {secondaryInsuranceFiles?.length > 0 ? (
              secondaryInsuranceFiles?.map((elem) => (
                <Col
                  className='dod-tabs-for-each-row-gap'
                  xs={{ span: 24 }}
                  sm={{ span: 12 }}
                  md={{ span: 8 }}
                  lg={{ span: 8 }}
                  key={elem?.id}
                >
                  <div>
                    <DisplayFilesContainer dataObj={elem} />
                  </div>
                </Col>
              ))
            ) : (
              <NoFileDisplay />
            )}
          </Row>
        </div>
      )}

      {selectedTab === 4 && (
        <div>
          <Col>
            <h3 className='order-type-heading-text-at-view-order'>
              {orderTypeData?.name}
            </h3>
          </Col>

          <CustomTable
            rowKey='id'
            rows={orderDetails?.cptCodes}
            columns={
              orderTypeData?.name === CHEMO_ORDER_TYPE
                ? TABLE_FOR_CPT_CODES_AT_ORDER_DETAILS_CHEMO
                : TABLE_FOR_CPT_CODES_AT_ORDER_DETAILS_TAB
            }
            pagination={false}
            pageSize={MAX_CPT_CODE_TO_BE_UPLOADED}
            scroll={{ y: 300 }}
          />
        </div>
      )}

      {selectedTab === 5 && (
        <div>
          <Col>
            <h3 className='order-type-heading-text-at-view-order'>
              {orderTypeData?.name}
            </h3>
          </Col>
          {orderTypeData?.name === CHEMO_ORDER_TYPE && (
            <Row span={24} gutter={24}>
              <Col span={24} className='upload-documents-container-at-tab-2'>
                <label className='dod-tabs-label-text'>
                  Written Orders For Treatment
                </label>
              </Col>

              {writtenOrdersFiles?.length > 0 ? (
                writtenOrdersFiles?.map((elem) => (
                  <Col
                    className='dod-tabs-for-each-row-gap'
                    xs={{ span: 24 }}
                    sm={{ span: 12 }}
                    md={{ span: 8 }}
                    lg={{ span: 8 }}
                    key={elem?.id}
                  >
                    <div>
                      <DisplayFilesContainer dataObj={elem} />
                    </div>
                  </Col>
                ))
              ) : (
                <NoFileDisplay />
              )}
            </Row>
          )}

          <Row span={24} gutter={24}>
            <Col span={24} className='upload-documents-container-at-tab-2'>
              <label className='dod-tabs-label-text'>
                {orderTypeData?.name === OFFICE_VISIT_ORDER_TYPE
                  ? 'Referral'
                  : 'MD Notes'}
              </label>
            </Col>

            {mdNotesFiles?.length > 0 ? (
              mdNotesFiles?.map((elem) => (
                <Col
                  className='dod-tabs-for-each-row-gap'
                  xs={{ span: 24 }}
                  sm={{ span: 12 }}
                  md={{ span: 8 }}
                  lg={{ span: 8 }}
                  key={elem?.id}
                >
                  <div>
                    <DisplayFilesContainer dataObj={elem} />
                  </div>
                </Col>
              ))
            ) : (
              <NoFileDisplay />
            )}
          </Row>

          <Row span={24} gutter={24}>
            <Col span={24} className='upload-documents-container-at-tab-2'>
              <label className='dod-tabs-label-text'>
                Patient Auth Response
              </label>
            </Col>

            {patientAuthDocFiles?.length > 0 ? (
              patientAuthDocFiles?.map((elem) => (
                <Col
                  className='dod-tabs-for-each-row-gap'
                  xs={{ span: 24 }}
                  sm={{ span: 12 }}
                  md={{ span: 8 }}
                  lg={{ span: 8 }}
                  key={elem?.id}
                >
                  <div>
                    <DisplayFilesContainer dataObj={elem} />
                  </div>
                </Col>
              ))
            ) : (
              <NoFileDisplay />
            )}
          </Row>
        </div>
      )}
    </div>
  );
};

export default DisplayOrderDetails;
