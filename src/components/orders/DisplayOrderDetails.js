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
import { DATE_FORMAT_STARTING_FROM_MONTH, NA } from '@/utils/constant.util';
import NoFileDisplay from './NoFileDisplay';

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

  const { mdNotesFiles = [], writtenOrdersFiles = [] } =
    patientUploadedDocsData || {};

  const [selectedTab, setSelectedTab] = useState(1);

  const {
    patientDemography: patientDemographics,
    medicalHistory,
    medicalRecord,
    insuranceInfo,
  } = getOrderDetails || {};

  const handleChangeOfCategoryTab = (key) => {
    setSelectedTab(key);
  };

  useEffect(() => {
    if (columnId) {
      dispatch(getOrderDetailsById(columnId)).then((res) => {
        if (res?.payload?.status) {
          const { patientId } = res?.payload?.data;
          dispatch(getPatientDocumentsAtEdit({ patientId, orderId: columnId }));
          // had to clear all documents variable when we close this drawer
        }
      });
    }
  }, [columnId]);

  return (
    <div className='display-order-details-parent-container'>
      <Row>
        <Tabs
          items={DISPLAY_DIFFERENT_TABS_OF_ORDER_MANAGEMENT}
          activeKey={selectedTab}
          onChange={handleChangeOfCategoryTab}
        />
      </Row>

      {selectedTab === 1 && (
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
            <label className='dod-tabs-label-text'>MRN Number</label>
            <h3 className='dod-tabs-inner-heading-for-titles'>
              {patientDemographics?.mrn || NA}
            </h3>
          </Col>

          <Col
            className='dod-tabs-for-each-row-gap'
            xs={{ span: 24 }}
            sm={{ span: 12 }}
            md={{ span: 8 }}
            lg={{ span: 6 }}
          >
            <label className='dod-tabs-label-text'>Primary Phone Number</label>
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
            <label className='dod-tabs-label-text'>
              Secondary Phone Number
            </label>
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
            <label className='dod-tabs-label-text'>Race</label>
            <h3 className='dod-tabs-inner-heading-for-titles'>
              {patientDemographics?.race || NA}
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
      )}

      {selectedTab === 2 && (
        <div>
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
                {medicalHistory?.diagnosis}
              </h3>
            </Col>
            <Col
              className='dod-tabs-for-each-row-gap'
              xs={{ span: 24 }}
              sm={{ span: 8 }}
              md={{ span: 6 }}
              lg={{ span: 6 }}
            >
              <label className='dod-tabs-label-text'>Chemotherapy Status</label>
              <h3
                className={`dod-tabs-inner-heading-for-titles dod-class-for-diff-status-${medicalHistory?.chemoTherapyStatus}`}
              >
                {medicalHistory?.chemoTherapyStatus ? 'Yes' : 'No'}
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
              <label className='dod-tabs-label-text'>Ordering Provider</label>
              <h3 className='dod-tabs-inner-heading-for-titles'>
                {medicalHistory?.orderingProvider}
              </h3>
            </Col>

            <Col
              className='dod-tabs-for-each-row-gap'
              xs={{ span: 24 }}
              sm={{ span: 8 }}
              md={{ span: 6 }}
              lg={{ span: 6 }}
            >
              <label className='dod-tabs-label-text'>Referring Provider</label>
              <h3 className='dod-tabs-inner-heading-for-titles'>
                {medicalHistory?.referringProvider}
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
                {medicalHistory?.pcpName || medicalHistory?.referringProvider}
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
              <label className='dod-tabs-label-text'>Radiology Status</label>
              <h3 className='dod-tabs-inner-heading-for-titles'>
                {medicalRecord?.isRadiologyStatus ? 'Yes' : 'No'}
              </h3>
            </Col>
            <Col
              className='dod-tabs-for-each-row-gap'
              xs={{ span: 24 }}
              sm={{ span: 8 }}
              md={{ span: 6 }}
              lg={{ span: 6 }}
            >
              <label className='dod-tabs-label-text'>Radiology Facility</label>
              <h3 className='dod-tabs-inner-heading-for-titles'>
                {medicalRecord?.radiologyFacility || NA}
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
              <label className='dod-tabs-label-text'>Pathology Status</label>
              <h3 className='dod-tabs-inner-heading-for-titles'>
                {medicalRecord?.isPathologyStatus ? 'Yes' : 'No'}
              </h3>
            </Col>
            <Col
              className='dod-tabs-for-each-row-gap'
              xs={{ span: 24 }}
              sm={{ span: 8 }}
              md={{ span: 6 }}
              lg={{ span: 6 }}
            >
              <label className='dod-tabs-label-text'>Pathology Facility</label>
              <h3 className='dod-tabs-inner-heading-for-titles'>
                {medicalRecord?.pathologyFacility || NA}
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
                {medicalRecord?.isLabStatus ? 'Yes' : 'No'}
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
                {medicalRecord?.labFacility || NA}
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
                {medicalRecord?.isPreviousAuthorizationStatus ? 'Yes' : 'No'}
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
        </div>
      )}

      {selectedTab === 3 && (
        <div>
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

          <Row span={24} gutter={24}>
            <Col span={24} className='upload-documents-container-at-tab-2'>
              <label className='dod-tabs-label-text'>MD Notes</label>
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
        </div>
      )}
    </div>
  );
};

export default DisplayOrderDetails;
