import React, { useEffect, useState } from "react";
import "../../styles/orders/displayOrderDetails.css";
import { Col, Row, Tabs } from "antd";
import { DisplayFilesContainer } from "./createOrder/UploadedImageContainer";
import { useDispatch, useSelector } from "react-redux";
import { getOrderDetailsById } from "@/store/orderSlice";
import { DISPLAY_DIFFERENT_TABS_OF_ORDER_MANAGEMENT } from "@/utils/options";
import { formatPhoneNumberToUSFormat } from "@/utils/commonFunctions";
import dayjs from "dayjs";
import {
  DATE_FORMAT_STARTING_FROM_MONTH,
  DUMMAY_ARR_FOR_ORDER_DETAILS,
} from "@/utils/constant.util";

const DisplayOrderDetails = ({ columnId }) => {
  const dispatch = useDispatch();
  const getOrderDetails = useSelector(
    (state) => state.allOrdersData.getOrderDetails
  );

  const [selectedTab, setSelectedTab] = useState(1);

  const {
    patient: patientDemographics,
    medicalHistory,
    medicalRecord,
    insuranceInfo,
  } = getOrderDetails || {};

  const handleChangeOfCategoryTab = (key) => {
    setSelectedTab(key);
  };

  useEffect(() => {
    if (columnId) {
      dispatch(getOrderDetailsById(columnId));
    }
  }, [columnId]);

  return (
    <div className="display-order-details-parent-container">
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
            className="dod-tabs-for-each-row-gap"
            xs={{ span: 24 }}
            sm={{ span: 12 }}
            md={{ span: 8 }}
            lg={{ span: 6 }}
          >
            <label className="dod-tabs-label-text">First Name</label>
            <h3 className="dod-tabs-inner-heading-for-titles">
              {patientDemographics?.firstName}
            </h3>
          </Col>
          <Col
            className="dod-tabs-for-each-row-gap"
            xs={{ span: 24 }}
            sm={{ span: 12 }}
            md={{ span: 8 }}
            lg={{ span: 6 }}
          >
            <label className="dod-tabs-label-text">Last Name</label>
            <h3 className="dod-tabs-inner-heading-for-titles">
              {patientDemographics?.lastName}
            </h3>
          </Col>
          <Col
            className="dod-tabs-for-each-row-gap"
            xs={{ span: 24 }}
            sm={{ span: 12 }}
            md={{ span: 8 }}
            lg={{ span: 6 }}
          >
            <label className="dod-tabs-label-text">Gender</label>
            <h3 className="dod-tabs-inner-heading-for-titles">
              {patientDemographics?.gender}
            </h3>
          </Col>
          <Col
            className="dod-tabs-for-each-row-gap"
            xs={{ span: 24 }}
            sm={{ span: 12 }}
            md={{ span: 8 }}
            lg={{ span: 6 }}
          >
            <label className="dod-tabs-label-text">Date Of Birth</label>
            <h3 className="dod-tabs-inner-heading-for-titles">
              {dayjs(patientDemographics?.dob).format(
                DATE_FORMAT_STARTING_FROM_MONTH
              )}
            </h3>
          </Col>
          <Col
            className="dod-tabs-for-each-row-gap"
            xs={{ span: 24 }}
            sm={{ span: 12 }}
            md={{ span: 8 }}
            lg={{ span: 6 }}
          >
            <label className="dod-tabs-label-text">Primary Phone Number</label>
            <h3 className="dod-tabs-inner-heading-for-titles">
              {formatPhoneNumberToUSFormat(
                patientDemographics?.primaryPhoneNumber
              ) || "N/A"}
            </h3>
          </Col>
          <Col
            className="dod-tabs-for-each-row-gap"
            xs={{ span: 24 }}
            sm={{ span: 12 }}
            md={{ span: 8 }}
            lg={{ span: 6 }}
          >
            <label className="dod-tabs-label-text">
              Secondary Phone Number
            </label>
            <h3 className="dod-tabs-inner-heading-for-titles">
              {formatPhoneNumberToUSFormat(
                patientDemographics?.secondaryPhoneNumber
              ) || "N/A"}
            </h3>
          </Col>
          <Col
            className="dod-tabs-for-each-row-gap"
            xs={{ span: 24 }}
            sm={{ span: 12 }}
            md={{ span: 8 }}
            lg={{ span: 6 }}
          >
            <label className="dod-tabs-label-text">Email</label>
            <h3 className="dod-tabs-inner-email-field">
              {patientDemographics?.email || "N/A"}
            </h3>
          </Col>
          <Col
            className="dod-tabs-for-each-row-gap"
            xs={{ span: 24 }}
            sm={{ span: 12 }}
            md={{ span: 8 }}
            lg={{ span: 6 }}
          >
            <label className="dod-tabs-label-text">Preferred Language</label>
            <h3 className="dod-tabs-inner-heading-for-titles">
              {patientDemographics?.preferredLanguage || "N/A"}
            </h3>
          </Col>
          <Col
            className="dod-tabs-for-each-row-gap"
            xs={{ span: 24 }}
            sm={{ span: 12 }}
            md={{ span: 8 }}
            lg={{ span: 6 }}
          >
            <label className="dod-tabs-label-text">Race</label>
            <h3 className="dod-tabs-inner-heading-for-titles">
              {patientDemographics?.race || "N/A"}
            </h3>
          </Col>
          <Col
            className="dod-tabs-for-each-row-gap"
            xs={{ span: 24 }}
            sm={{ span: 12 }}
            md={{ span: 8 }}
            lg={{ span: 6 }}
          >
            <label className="dod-tabs-label-text">MRN Number</label>
            <h3 className="dod-tabs-inner-heading-for-titles">
              {patientDemographics?.mrnNumber || "N/A"}
            </h3>
          </Col>
          <Col
            className="dod-tabs-for-each-row-gap"
            xs={{ span: 24 }}
            sm={{ span: 12 }}
            md={{ span: 8 }}
            lg={{ span: 6 }}
          >
            <label className="dod-tabs-label-text">Address</label>
            <h3 className="dod-tabs-inner-heading-for-titles">
              {patientDemographics?.address || "N/A"}
            </h3>
          </Col>
        </Row>
      )}

      {selectedTab === 2 && (
        <div>
          <Row span={24} gutter={24}>
            <Col
              className="dod-tabs-for-each-row-gap"
              xs={{ span: 24 }}
              sm={{ span: 8 }}
              md={{ span: 6 }}
              lg={{ span: 6 }}
            >
              <label className="dod-tabs-label-text">Diagnosis</label>
              <h3 className="dod-tabs-inner-heading-for-titles">
                {medicalHistory?.diagnosis}
              </h3>
            </Col>
            <Col
              className="dod-tabs-for-each-row-gap"
              xs={{ span: 24 }}
              sm={{ span: 8 }}
              md={{ span: 6 }}
              lg={{ span: 6 }}
            >
              <label className="dod-tabs-label-text">Chemotherapy Status</label>
              <h3
                className={`dod-tabs-inner-heading-for-titles dod-class-for-diff-status-${medicalHistory?.chemotherapyStatus}`}
              >
                {medicalHistory?.chemotherapyStatus ? "Yes" : "No"}
              </h3>
            </Col>
          </Row>

          <Row span={24} gutter={24}>
            <Col
              className="dod-tabs-for-each-row-gap"
              xs={{ span: 24 }}
              sm={{ span: 8 }}
              md={{ span: 6 }}
              lg={{ span: 6 }}
            >
              <label className="dod-tabs-label-text">Ordering Provider</label>
              <h3 className="dod-tabs-inner-heading-for-titles">
                {medicalHistory?.orderingProvider}
              </h3>
            </Col>

            <Col
              className="dod-tabs-for-each-row-gap"
              xs={{ span: 24 }}
              sm={{ span: 8 }}
              md={{ span: 6 }}
              lg={{ span: 6 }}
            >
              <label className="dod-tabs-label-text">Referring Provider</label>
              <h3 className="dod-tabs-inner-heading-for-titles">
                {medicalHistory?.referringProvider}
              </h3>
            </Col>

            <Col
              className="dod-tabs-for-each-row-gap"
              xs={{ span: 24 }}
              sm={{ span: 8 }}
              md={{ span: 6 }}
              lg={{ span: 6 }}
            >
              <label className="dod-tabs-label-text">PCP Number</label>
              <h3 className="dod-tabs-inner-heading-for-titles">
                {medicalHistory?.pcpName || medicalHistory?.referringProvider}
              </h3>
            </Col>
          </Row>

          <Row span={24} gutter={24}>
            <Col
              className="dod-tabs-for-each-row-gap"
              xs={{ span: 24 }}
              sm={{ span: 8 }}
              md={{ span: 6 }}
              lg={{ span: 6 }}
            >
              <label className="dod-tabs-label-text">Radiology Status</label>
              <h3 className="dod-tabs-inner-heading-for-titles">
                {medicalRecord?.isRadiologyStatus ? "Yes" : "No"}
              </h3>
            </Col>
            <Col
              className="dod-tabs-for-each-row-gap"
              xs={{ span: 24 }}
              sm={{ span: 8 }}
              md={{ span: 6 }}
              lg={{ span: 6 }}
            >
              <label className="dod-tabs-label-text">Radiology Facility</label>
              <h3 className="dod-tabs-inner-heading-for-titles">
                {medicalRecord?.radiologyFacility || "N/A"}
              </h3>
            </Col>
          </Row>

          <Row span={24} gutter={24}>
            <Col span={24} className="upload-documents-container-at-tab-2">
              <label className="dod-tabs-label-text">
                Uploaded Radiology Documents
              </label>
            </Col>

            {DUMMAY_ARR_FOR_ORDER_DETAILS.map((elem, index) => (
              <Col
                className="dod-tabs-for-each-row-gap"
                xs={{ span: 24 }}
                sm={{ span: 12 }}
                md={{ span: 8 }}
                lg={{ span: 6 }}
                key={index}
              >
                <div>
                  <DisplayFilesContainer />
                </div>
              </Col>
            ))}
          </Row>

          <Row span={24} gutter={24}>
            <Col
              className="dod-tabs-for-each-row-gap"
              xs={{ span: 24 }}
              sm={{ span: 8 }}
              md={{ span: 6 }}
              lg={{ span: 6 }}
            >
              <label className="dod-tabs-label-text">Pathology Status</label>
              <h3 className="dod-tabs-inner-heading-for-titles">
                {medicalRecord?.isPathologyStatus ? "Yes" : "No"}
              </h3>
            </Col>
            <Col
              className="dod-tabs-for-each-row-gap"
              xs={{ span: 24 }}
              sm={{ span: 8 }}
              md={{ span: 6 }}
              lg={{ span: 6 }}
            >
              <label className="dod-tabs-label-text">Pathology Facility</label>
              <h3 className="dod-tabs-inner-heading-for-titles">
                {medicalRecord?.pathologyFacility || "N/A"}
              </h3>
            </Col>
          </Row>

          <Row span={24} gutter={24}>
            <Col span={24} className="upload-documents-container-at-tab-2">
              <label className="dod-tabs-label-text">
                Uploaded Pathology Documents
              </label>
            </Col>

            {DUMMAY_ARR_FOR_ORDER_DETAILS.map((elem, index) => (
              <Col
                className="dod-tabs-for-each-row-gap"
                xs={{ span: 24 }}
                sm={{ span: 12 }}
                md={{ span: 8 }}
                lg={{ span: 6 }}
                key={index}
              >
                <div>
                  <DisplayFilesContainer />
                </div>
              </Col>
            ))}
          </Row>

          <Row span={24} gutter={24}>
            <Col
              className="dod-tabs-for-each-row-gap"
              xs={{ span: 24 }}
              sm={{ span: 8 }}
              md={{ span: 6 }}
              lg={{ span: 6 }}
            >
              <label className="dod-tabs-label-text">Lab Status</label>
              <h3 className="dod-tabs-inner-heading-for-titles">
                {medicalRecord?.isLabStatus ? "Yes" : "No"}
              </h3>
            </Col>
            <Col
              className="dod-tabs-for-each-row-gap"
              xs={{ span: 24 }}
              sm={{ span: 8 }}
              md={{ span: 6 }}
              lg={{ span: 6 }}
            >
              <label className="dod-tabs-label-text">Lab Facility</label>
              <h3 className="dod-tabs-inner-heading-for-titles">
                {medicalRecord?.labFacility || "N/A"}
              </h3>
            </Col>
          </Row>

          <Row span={24} gutter={24}>
            <Col span={24} className="upload-documents-container-at-tab-2">
              <label className="dod-tabs-label-text">
                Uploaded Lab Documents
              </label>
            </Col>

            {DUMMAY_ARR_FOR_ORDER_DETAILS.map((elem, index) => (
              <Col
                className="dod-tabs-for-each-row-gap"
                xs={{ span: 24 }}
                sm={{ span: 12 }}
                md={{ span: 8 }}
                lg={{ span: 6 }}
                key={index}
              >
                <div>
                  <DisplayFilesContainer />
                </div>
              </Col>
            ))}
          </Row>

          <Row span={24} gutter={24}>
            <Col
              className="dod-tabs-for-each-row-gap"
              xs={{ span: 24 }}
              sm={{ span: 8 }}
              md={{ span: 6 }}
              lg={{ span: 6 }}
            >
              <label className="dod-tabs-label-text">
                Previous Authorization
              </label>
              <h3 className="dod-tabs-inner-heading-for-titles">
                {medicalRecord?.isPreviousAuthorizationStatus ? "Yes" : "No"}
              </h3>
            </Col>
          </Row>

          <Row span={24} gutter={24}>
            <Col span={24} className="upload-documents-container-at-tab-2">
              <label className="dod-tabs-label-text">
                Previous Authorization Uploaded Documents
              </label>
            </Col>

            {DUMMAY_ARR_FOR_ORDER_DETAILS.map((elem, index) => (
              <Col
                className="dod-tabs-for-each-row-gap"
                xs={{ span: 24 }}
                sm={{ span: 12 }}
                md={{ span: 8 }}
                lg={{ span: 6 }}
                key={index}
              >
                <div>
                  <DisplayFilesContainer />
                </div>
              </Col>
            ))}
          </Row>

          <Row span={24} gutter={24}>
            <Col span={24} className="upload-documents-container-at-tab-2">
              <label className="dod-tabs-label-text">
                Single Medical Release Form
              </label>
            </Col>

            {DUMMAY_ARR_FOR_ORDER_DETAILS.map((elem, index) => (
              <Col
                className="dod-tabs-for-each-row-gap"
                xs={{ span: 24 }}
                sm={{ span: 12 }}
                md={{ span: 8 }}
                lg={{ span: 6 }}
                key={index}
              >
                <div>
                  <DisplayFilesContainer />
                </div>
              </Col>
            ))}
          </Row>
        </div>
      )}

      {selectedTab === 3 && (
        <div>
          <Row span={24} gutter={24}>
            <Col
              className="dod-tabs-for-each-row-gap"
              xs={{ span: 24 }}
              sm={{ span: 8 }}
              md={{ span: 6 }}
              lg={{ span: 6 }}
            >
              <label className="dod-tabs-label-text">Health Plan</label>
              <h3 className="dod-tabs-inner-heading-for-titles">
                {insuranceInfo?.healthPlan}
              </h3>
            </Col>
            <Col
              className="dod-tabs-for-each-row-gap"
              xs={{ span: 24 }}
              sm={{ span: 8 }}
              md={{ span: 6 }}
              lg={{ span: 6 }}
            >
              <label className="dod-tabs-label-text">LoB</label>
              <h3 className="dod-tabs-inner-heading-for-titles">
                {insuranceInfo?.lob}
              </h3>
            </Col>

            <Col
              className="dod-tabs-for-each-row-gap"
              xs={{ span: 24 }}
              sm={{ span: 8 }}
              md={{ span: 6 }}
              lg={{ span: 6 }}
            >
              <label className="dod-tabs-label-text">Medicare</label>
              <h3 className="dod-tabs-inner-heading-for-titles">
                {insuranceInfo?.medicareId}
              </h3>
            </Col>
          </Row>

          <Row span={24} gutter={24}>
            <Col
              className="dod-tabs-for-each-row-gap"
              xs={{ span: 24 }}
              sm={{ span: 8 }}
              md={{ span: 6 }}
              lg={{ span: 6 }}
            >
              <label className="dod-tabs-label-text">
                Primary Subscriber Number
              </label>
              <h3 className="dod-tabs-inner-heading-for-titles">
                {insuranceInfo?.primarySubscriberNumber}
              </h3>
            </Col>
            <Col
              className="dod-tabs-for-each-row-gap"
              xs={{ span: 24 }}
              sm={{ span: 8 }}
              md={{ span: 6 }}
              lg={{ span: 6 }}
            >
              <label className="dod-tabs-label-text">
                Primary Group Number
              </label>
              <h3 className="dod-tabs-inner-heading-for-titles">
                {insuranceInfo?.primaryGroupNumber}
              </h3>
            </Col>
          </Row>

          <Row span={24} gutter={24}>
            <Col
              className="dod-tabs-for-each-row-gap"
              xs={{ span: 24 }}
              sm={{ span: 8 }}
              md={{ span: 6 }}
              lg={{ span: 6 }}
            >
              <label className="dod-tabs-label-text">
                Secondary Subscriber Number
              </label>
              <h3 className="dod-tabs-inner-heading-for-titles">
                {insuranceInfo?.secondarySubscriberNumber || "N/A"}
              </h3>
            </Col>
            <Col
              className="dod-tabs-for-each-row-gap"
              xs={{ span: 24 }}
              sm={{ span: 8 }}
              md={{ span: 6 }}
              lg={{ span: 6 }}
            >
              <label className="dod-tabs-label-text">
                Secondary Group Number
              </label>
              <h3 className="dod-tabs-inner-heading-for-titles">
                {insuranceInfo?.secondaryGroupNumber || "N/A"}
              </h3>
            </Col>
          </Row>

          <Row span={24} gutter={24}>
            <Col
              className="dod-tabs-for-each-row-gap"
              xs={{ span: 24 }}
              sm={{ span: 8 }}
              md={{ span: 6 }}
              lg={{ span: 6 }}
            >
              <label className="dod-tabs-label-text">Primary Insurance</label>
              <h3 className="dod-tabs-inner-heading-for-titles">{"Yes"}</h3>
            </Col>
            <Col
              className="dod-tabs-for-each-row-gap"
              xs={{ span: 24 }}
              sm={{ span: 8 }}
              md={{ span: 6 }}
              lg={{ span: 6 }}
            >
              <label className="dod-tabs-label-text">Primary Start Date</label>
              <h3 className="dod-tabs-inner-heading-for-titles">
                {insuranceInfo?.primaryStartDate}
              </h3>
            </Col>
            <Col
              className="dod-tabs-for-each-row-gap"
              xs={{ span: 24 }}
              sm={{ span: 8 }}
              md={{ span: 6 }}
              lg={{ span: 6 }}
            >
              <label className="dod-tabs-label-text">Primary End Date</label>
              <h3 className="dod-tabs-inner-heading-for-titles">
                {insuranceInfo?.primaryEndDate}
              </h3>
            </Col>
          </Row>

          <Row span={24} gutter={24}>
            <Col span={24} className="upload-documents-container-at-tab-2">
              <label className="dod-tabs-label-text">
                Copy Of Insurance Card
              </label>
            </Col>

            {DUMMAY_ARR_FOR_ORDER_DETAILS.map((elem, index) => (
              <Col
                className="dod-tabs-for-each-row-gap"
                xs={{ span: 24 }}
                sm={{ span: 12 }}
                md={{ span: 8 }}
                lg={{ span: 6 }}
                key={index}
              >
                <div>
                  <DisplayFilesContainer />
                </div>
              </Col>
            ))}
          </Row>

          <Row span={24} gutter={24}>
            <Col
              className="dod-tabs-for-each-row-gap"
              xs={{ span: 24 }}
              sm={{ span: 8 }}
              md={{ span: 6 }}
              lg={{ span: 6 }}
            >
              <label className="dod-tabs-label-text">Secondary Insurance</label>
              <h3 className="dod-tabs-inner-heading-for-titles">
                {insuranceInfo?.secondaryInsurance ? "Yes" : "No"}
              </h3>
            </Col>

            {insuranceInfo?.secondaryInsurance && (
              <>
                <Col
                  className="dod-tabs-for-each-row-gap"
                  xs={{ span: 24 }}
                  sm={{ span: 8 }}
                  md={{ span: 6 }}
                  lg={{ span: 6 }}
                >
                  <label className="dod-tabs-label-text">
                    Secondary Start Date
                  </label>
                  <h3 className="dod-tabs-inner-heading-for-titles">
                    {insuranceInfo?.secondaryStartDate || "N/A"}
                  </h3>
                </Col>

                <Col
                  className="dod-tabs-for-each-row-gap"
                  xs={{ span: 24 }}
                  sm={{ span: 8 }}
                  md={{ span: 6 }}
                  lg={{ span: 6 }}
                >
                  <label className="dod-tabs-label-text">
                    Secondary End Date
                  </label>
                  <h3 className="dod-tabs-inner-heading-for-titles">
                    {insuranceInfo?.secondaryEndDate || "N/A"}
                  </h3>
                </Col>
              </>
            )}
          </Row>

          <Row span={24} gutter={24}>
            <Col span={24} className="upload-documents-container-at-tab-2">
              <label className="dod-tabs-label-text">
                Secondary Insurance Documents
              </label>
            </Col>

            {DUMMAY_ARR_FOR_ORDER_DETAILS.map((elem, index) => (
              <Col
                className="dod-tabs-for-each-row-gap"
                xs={{ span: 24 }}
                sm={{ span: 12 }}
                md={{ span: 8 }}
                lg={{ span: 6 }}
                key={index}
              >
                <div>
                  <DisplayFilesContainer />
                </div>
              </Col>
            ))}
          </Row>
        </div>
      )}

      {selectedTab === 4 && (
        <div>
          <Row span={24} gutter={24}>
            <Col span={24} className="upload-documents-container-at-tab-2">
              <label className="dod-tabs-label-text">
                Written Orders For Treatment
              </label>
            </Col>

            {DUMMAY_ARR_FOR_ORDER_DETAILS.map((elem, index) => (
              <Col
                className="dod-tabs-for-each-row-gap"
                xs={{ span: 24 }}
                sm={{ span: 12 }}
                md={{ span: 8 }}
                lg={{ span: 6 }}
                key={index}
              >
                <div>
                  <DisplayFilesContainer />
                </div>
              </Col>
            ))}
          </Row>

          <Row span={24} gutter={24}>
            <Col span={24} className="upload-documents-container-at-tab-2">
              <label className="dod-tabs-label-text">MD Notes</label>
            </Col>

            {DUMMAY_ARR_FOR_ORDER_DETAILS.map((elem, index) => (
              <Col
                className="dod-tabs-for-each-row-gap"
                xs={{ span: 24 }}
                sm={{ span: 12 }}
                md={{ span: 8 }}
                lg={{ span: 6 }}
                key={index}
              >
                <div>
                  <DisplayFilesContainer />
                </div>
              </Col>
            ))}
          </Row>

          <Row span={24} gutter={24}>
            <Col span={24} className="upload-documents-container-at-tab-2">
              <label className="dod-tabs-label-text">Most Recent Labs</label>
            </Col>

            {DUMMAY_ARR_FOR_ORDER_DETAILS.map((elem, index) => (
              <Col
                className="dod-tabs-for-each-row-gap"
                xs={{ span: 24 }}
                sm={{ span: 12 }}
                md={{ span: 8 }}
                lg={{ span: 6 }}
                key={index}
              >
                <div>
                  <DisplayFilesContainer />
                </div>
              </Col>
            ))}
          </Row>

          <Row span={24} gutter={24}>
            <Col span={24} className="upload-documents-container-at-tab-2">
              <label className="dod-tabs-label-text">
                Most Recent Pathology
              </label>
            </Col>

            {DUMMAY_ARR_FOR_ORDER_DETAILS.map((elem, index) => (
              <Col
                className="dod-tabs-for-each-row-gap"
                xs={{ span: 24 }}
                sm={{ span: 12 }}
                md={{ span: 8 }}
                lg={{ span: 6 }}
                key={index}
              >
                <div>
                  <DisplayFilesContainer />
                </div>
              </Col>
            ))}
          </Row>
          <Row span={24} gutter={24}>
            <Col span={24} className="upload-documents-container-at-tab-2">
              <label className="dod-tabs-label-text">Imaging Details</label>
            </Col>

            {DUMMAY_ARR_FOR_ORDER_DETAILS.map((elem, index) => (
              <Col
                className="dod-tabs-for-each-row-gap"
                xs={{ span: 24 }}
                sm={{ span: 12 }}
                md={{ span: 8 }}
                lg={{ span: 6 }}
                key={index}
              >
                <div>
                  <DisplayFilesContainer />
                </div>
              </Col>
            ))}
          </Row>
        </div>
      )}
    </div>
  );
};

export default DisplayOrderDetails;
