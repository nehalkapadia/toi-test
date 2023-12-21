import React, { useEffect, useState } from "react";
import "../../../styles/orders/createOrder/medicalHistory.css";
import "../../../styles/orders/createOrder.css";
import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Spin,
  Switch,
  Upload,
  message,
} from "antd";
import {
  CREATE_ORDER_FORM_FIELD_RULES,
  CREATE_ORDER_FORM_KEY_NAMES,
  NPI_NUMBER_VALIDATION_ERROR_MESSAGE,
} from "@/utils/constant.util";
import { FiInfo, FiUpload } from "react-icons/fi";
import { BiTrash } from "react-icons/bi";
import { MEDICAL_HISTORY_DIAGNOSIS_OPTIONS } from "@/utils/options";
import { useDispatch, useSelector } from "react-redux";
import {
  getValidateOrderingProvider,
  getValidatePCPNumber,
  getValidateReferringProvider,
  postMedicalHostoryData,
  postMedicalRecordData,
  setDisplayOrderingModal,
  setDisplayPCPNumberModal,
  setDisplayReferringModal,
  setValidationCancelForOrdering,
  setValidationCancelForPCPNumber,
  setValidationCancelForReferring,
} from "@/store/orderSlice";
import CretaeOrderModal from "./CretaeOrderModal";
import {
  setCurrentSelectedTab,
  setDisplayPcpNumberSuccessTick,
  setDisplayReferringSuccessTick,
  setDisplayorderingSuccessTick,
  setInsuranceInfoTab,
  setTab2FormData,
} from "@/store/createOrderFormSlice";
import { AiOutlineClose } from "react-icons/ai";

const MedicalHIstory = () => {
  const [formData] = Form.useForm();
  const formValues = Form.useWatch([], formData);
  const [submittable, setSubmittable] = useState(false);

  const dispatch = useDispatch();
  // Managing Ordering Provider State
  const isLoadingOrdering = useSelector(
    (state) => state.allOrdersData.loadingOrderingProvider
  );
  const orderingResStatus = useSelector(
    (state) => state.allOrdersData.orderingResStatus
  );
  const displayOrderingModal = useSelector(
    (state) => state.allOrdersData.displayOrderingModal
  );
  const orderingProviderData = useSelector(
    (state) => state.allOrdersData.orderingProviderData
  );

  // Managing Referring Provider State
  const isLoadingReferring = useSelector(
    (state) => state.allOrdersData.loadingReferringProvider
  );
  const referringResStatus = useSelector(
    (state) => state.allOrdersData.referringResStatus
  );
  const displayReferringModal = useSelector(
    (state) => state.allOrdersData.displayReferringModal
  );
  const referringProviderData = useSelector(
    (state) => state.allOrdersData.referringProviderData
  );

  // Managing PCP Number State
  const loadingPcpNumber = useSelector(
    (state) => state.allOrdersData.loadingPcpNumber
  );
  const pcpNumberResStatus = useSelector(
    (state) => state.allOrdersData.pcpNumberResStatus
  );
  const displayPCPNumberModal = useSelector(
    (state) => state.allOrdersData.displayPCPNumberModal
  );
  const pcpNumberData = useSelector(
    (state) => state.allOrdersData.pcpNumberData
  );

  // Whole Tab Data
  const medicalHistoryOnly = useSelector(
    (state) => state.allOrdersData.medicalHistoryOnly
  );
  const medicalRecordOnly = useSelector(
    (state) => state.allOrdersData.medicalRecordOnly
  );
  const medicalHostoryAllData = useSelector(
    (state) => state.allOrdersData.medicalHostoryAllData
  );

  const patientDemographicsData = useSelector(
    (state) => state.allOrdersData.patientDemographicsData
  );

  // State for Display Success Tick
  const orderingSuccessTick = useSelector(
    (state) => state.createOrderTabs.displayOrderingSuccessTick
  );
  const referringSuccessTick = useSelector(
    (state) => state.createOrderTabs.displayReferringSuccessTick
  );
  const pcpNumberSuccessTick = useSelector(
    (state) => state.createOrderTabs.displayPcpNumberSuccessTick
  );
  // Handling Internal State for FormData
  const tab2FormData = useSelector(
    (state) => state.createOrderTabs.tab2FormData
  );

  const [chemoStaus, setChemoStatus] = useState(false);
  const [refPhysicianChecked, setRefPhysicianChecked] = useState(true);
  const [radilogyStatus, setRadilogyStatus] = useState(false);
  const [pathologyStatus, setPathologyStatus] = useState(false);
  const [labStatus, setLabStatus] = useState(false);
  const [previousAuthorization, setPreviousAuthorization] = useState(false);

  const [disableOrderingBtn, setDisableOrderingBtn] = useState(true);
  const [disableProviderBtn, setDisableProviderBtn] = useState(true);
  const [disbalePCPBtn, setDisbalePCPBtn] = useState(true);

  const handleOrderingProvider = (value) => {
    if (value?.toString()?.trim()?.length === 10) {
      setDisableOrderingBtn(false);
    } else {
      setDisableOrderingBtn(true);
    }

    if (
      orderingResStatus &&
      orderingSuccessTick &&
      orderingProviderData?.npiNumber !== value
    ) {
      dispatch(setDisplayorderingSuccessTick(false));
    } else if (
      orderingResStatus &&
      !orderingSuccessTick &&
      orderingProviderData?.npiNumber === value
    ) {
      dispatch(setDisplayorderingSuccessTick(true));
    }
  };

  const handleReferringProvider = (value) => {
    if (value?.toString()?.trim()?.length === 10) {
      setDisableProviderBtn(false);
    } else {
      setDisableProviderBtn(true);
    }

    if (
      referringResStatus &&
      referringSuccessTick &&
      referringProviderData?.npiNumber !== value
    ) {
      dispatch(setDisplayReferringSuccessTick(false));
    } else if (
      referringResStatus &&
      !referringSuccessTick &&
      referringProviderData?.npiNumber === value
    ) {
      dispatch(setDisplayReferringSuccessTick(true));
    }
  };

  const handlePCPNumber = (value) => {
    if (value?.toString()?.trim()?.length === 10) {
      setDisbalePCPBtn(false);
    } else {
      setDisbalePCPBtn(true);
    }

    if (
      pcpNumberResStatus &&
      pcpNumberSuccessTick &&
      pcpNumberData.npiNumber !== value
    ) {
      dispatch(setDisplayPCPNumberModal(false));
    } else if (
      pcpNumberResStatus &&
      !pcpNumberSuccessTick &&
      pcpNumberData.npiNumber === value
    ) {
      dispatch(setDisplayPCPNumberModal(true));
    }
  };

  const validateOrderingProvider = () => {
    const npiNumber = formData.getFieldValue(
      CREATE_ORDER_FORM_KEY_NAMES.orderingProvider
    );
    if (npiNumber?.toString()?.trim()?.length === 10) {
      dispatch(getValidateOrderingProvider(npiNumber)).then((res) => {
        if (!res?.payload?.status) {
          message.error(res?.payload?.message);
        }
      });
    } else {
      message.error(NPI_NUMBER_VALIDATION_ERROR_MESSAGE);
    }
  };

  const validateReferringProvider = () => {
    const npiNumber = formData.getFieldValue(
      CREATE_ORDER_FORM_KEY_NAMES.referringProvider
    );
    if (npiNumber?.toString()?.trim()?.length === 10) {
      dispatch(getValidateReferringProvider(npiNumber)).then((res) => {
        if (!res?.payload?.status) {
          message.error(res?.payload?.message);
        }
      });
    } else {
      message.error(NPI_NUMBER_VALIDATION_ERROR_MESSAGE);
    }
  };

  const validatePCPNumber = () => {
    const npiNumber = formData.getFieldValue(
      CREATE_ORDER_FORM_KEY_NAMES.pcpNumber
    );
    if (npiNumber?.toString()?.trim()?.length === 10) {
      dispatch(getValidatePCPNumber(npiNumber)).then((res) => {
        if (!res?.payload?.status) {
          message.error(res?.payload?.message);
        }
      });
    } else {
      message.error(NPI_NUMBER_VALIDATION_ERROR_MESSAGE);
    }
  };
  // When cliked on cancel button of modals these event will trigger.
  const handleCancelForOrderingModal = () => {
    dispatch(setDisplayOrderingModal(false));
    dispatch(setValidationCancelForOrdering());
  };

  const handleCancelForReferringModal = () => {
    dispatch(setDisplayReferringModal(false));
    dispatch(setValidationCancelForReferring());
  };
  const handleCancelForPCPNumberModal = () => {
    dispatch(setDisplayPCPNumberModal(false));
    dispatch(setValidationCancelForPCPNumber());
  };

  // When cliked on close icon of modals these event will trigger.
  const handleHideOrderingModal = () => {
    dispatch(setDisplayOrderingModal(false));
  };

  const handleHideReferringModal = () => {
    dispatch(setDisplayReferringModal(false));
  };
  const handleHidePCPNumberModal = () => {
    dispatch(setDisplayPCPNumberModal(false));
  };

  // When Click on Verify Button in Modals these event will trigger.
  const handleConfirmForOrderingModal = () => {
    dispatch(setDisplayOrderingModal(false));
    dispatch(setDisplayorderingSuccessTick(true));
  };

  const handleConfirmForReferringModal = () => {
    dispatch(setDisplayReferringModal(false));
    dispatch(setDisplayReferringSuccessTick(true));
  };

  const handleConfirmForPCPNumberModal = () => {
    dispatch(setDisplayPCPNumberModal(false));
    dispatch(setDisplayPcpNumberSuccessTick(true));
  };

  // When We click on Info Icon form Form Label This event Will trigger.
  const handleDisplayOrderingModal = () => {
    dispatch(setDisplayOrderingModal(true));
  };

  const handleDisplayReferringModal = () => {
    dispatch(setDisplayReferringModal(true));
  };

  const handleDisplayPCPNumberModal = () => {
    dispatch(setDisplayPCPNumberModal(true));
  };

  const handleSubmitTab2Data = (values) => {
    const { id } = patientDemographicsData;
    const payload = { ...tab2FormData, ...values };
    payload.orderingProvider = payload.orderingProvider?.toString();
    payload.referringProvider = payload.referringProvider?.toString();
    payload.pcpName = payload.pcpName?.toString();

    const {
      diagnosis,
      chemoTherapyStatus,
      orderingProvider,
      referringProvider,
      isReferringPhysician,
      pcpName = "",
      ...payload2
    } = payload;

    const payload1 = {
      patientId: id,
      diagnosis,
      chemoTherapyStatus,
      orderingProvider,
      referringProvider,
      isReferringPhysician,
      pcpName,
    };
    payload2.patientId = id;
    dispatch(postMedicalHostoryData(payload1)).then((res) => {
      if (res?.payload?.status) {
        message.success(res?.payload?.message);
        dispatch(setInsuranceInfoTab());
        dispatch(setCurrentSelectedTab("insuranceInfo"));
      } else {
        message.error(res?.payload?.message);
      }
    });
    dispatch(postMedicalRecordData(payload2)).then((res) => {
      if (res?.payload?.status) {
        message.success(res?.payload?.message);
      } else {
        message.error(res?.payload?.message);
      }
    });
  };

  useEffect(() => {
    formData.validateFields({ validateOnly: true }).then(
      () => {
        if (orderingResStatus && referringResStatus) {
          if (refPhysicianChecked) {
            setSubmittable(true);
          } else if (!refPhysicianChecked && pcpNumberResStatus) {
            setSubmittable(true);
          }
        }
      },
      () => {
        setSubmittable(false);
      }
    );
    const initialValues = formData.getFieldsValue();
    const payload = { ...tab2FormData, ...initialValues };
    dispatch(setTab2FormData(payload));
  }, [
    formValues,
    orderingResStatus,
    referringResStatus,
    refPhysicianChecked,
    pcpNumberResStatus,
  ]);

  useEffect(() => {
    const initialValues = { ...tab2FormData };
    initialValues.chemoTherapyStatus = chemoStaus;
    initialValues.isReferringPhysician = refPhysicianChecked;
    initialValues.isRadiologyStatus = radilogyStatus;
    initialValues.isPathologyStatus = pathologyStatus;
    initialValues.isLabStatus = labStatus;
    initialValues.isPreviousAuthorizationStatus = previousAuthorization;
    dispatch(setTab2FormData(initialValues));
  }, [
    chemoStaus,
    refPhysicianChecked,
    radilogyStatus,
    pathologyStatus,
    labStatus,
    previousAuthorization,
  ]);
  return (
    <div className="create-order-medical-history-tab-2-container">
      <Form
        form={formData}
        name="create-order-medecal-history"
        layout="vertical"
        autoComplete="off"
        preserve={true}
        onFinish={handleSubmitTab2Data}
        initialValues={tab2FormData}
      >
        <Col className="tab-2-child-component-container">
          <Row span={24} gutter={24}>
            <Col
              xs={{ span: 24 }}
              sm={{ span: 12 }}
              md={{ span: 12 }}
              lg={{ span: 8 }}
            >
              <Form.Item
                label="Diagnosis"
                name={CREATE_ORDER_FORM_KEY_NAMES.diagnosis}
                rules={CREATE_ORDER_FORM_FIELD_RULES.diagnosis}
              >
                <Select
                  options={MEDICAL_HISTORY_DIAGNOSIS_OPTIONS}
                  size="large"
                  placeholder="Select Diagnosis Status"
                />
              </Form.Item>
            </Col>

            <Col
              xs={{ span: 24 }}
              sm={{ span: 12 }}
              md={{ span: 12 }}
              lg={{ span: 8 }}
            >
              <Form.Item label="Chemotherapy Status">
                <Switch
                  checked={chemoStaus}
                  onChange={() => setChemoStatus(!chemoStaus)}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row span={24} gutter={24}>
            <Col
              className="co-tab-2-ordering-container"
              xs={{ span: 24 }}
              sm={{ span: 12 }}
              md={{ span: 12 }}
              lg={{ span: 8 }}
            >
              <Form.Item
                label={
                  <div className="tab2-ordering-provider-lable-conatiner">
                    <label>Ordering Provider</label>
                    {orderingSuccessTick && (
                      <FiInfo
                        className="info-icon-for-displaying-info"
                        onClick={handleDisplayOrderingModal}
                      />
                    )}
                  </div>
                }
                name={CREATE_ORDER_FORM_KEY_NAMES.orderingProvider}
                rules={CREATE_ORDER_FORM_FIELD_RULES.orderingProvider}
                validateStatus={orderingSuccessTick && "success"}
                hasFeedback
              >
                <InputNumber
                  className="co-tab-2-medical-history-number-input"
                  size="large"
                  placeholder="Enter NPI Number"
                  onChange={handleOrderingProvider}
                  minLength={10}
                />
              </Form.Item>
              {!orderingSuccessTick && (
                <Col>
                  <Button
                    size="large"
                    disabled={disableOrderingBtn}
                    className="co-tab-2-ordering-btn"
                    onClick={validateOrderingProvider}
                  >
                    Validate
                  </Button>
                </Col>
              )}
              {isLoadingOrdering && (
                <div>
                  <Spin fullscreen />
                </div>
              )}
            </Col>

            <Col
              className="co-tab-2-referring-container"
              xs={{ span: 24 }}
              sm={{ span: 12 }}
              md={{ span: 12 }}
              lg={{ span: 8 }}
            >
              <Form.Item
                label={
                  <div className="tab2-ordering-provider-lable-conatiner">
                    <label>Referring Provider</label>
                    {referringSuccessTick && (
                      <FiInfo
                        className="info-icon-for-displaying-info"
                        onClick={handleDisplayReferringModal}
                      />
                    )}
                  </div>
                }
                name={CREATE_ORDER_FORM_KEY_NAMES.referringProvider}
                rules={CREATE_ORDER_FORM_FIELD_RULES.referringProvider}
                validateStatus={referringSuccessTick && "success"}
                hasFeedback
              >
                <InputNumber
                  className="co-tab-2-medical-history-number-input"
                  size="large"
                  placeholder="Enter NPI Number"
                  onChange={handleReferringProvider}
                  minLength={10}
                />
              </Form.Item>
              {!referringSuccessTick && (
                <Col>
                  <Button
                    size="large"
                    disabled={disableProviderBtn}
                    className="co-tab-2-ordering-btn"
                    onClick={validateReferringProvider}
                  >
                    Validate
                  </Button>
                </Col>
              )}
              {isLoadingReferring && (
                <div>
                  <Spin fullscreen />
                </div>
              )}
            </Col>

            <Col
              className="co-tab-2-pcp-number-container"
              xs={{ span: 24 }}
              sm={{ span: 12 }}
              md={{ span: 12 }}
              lg={{ span: 8 }}
            >
              <Form.Item label="Referring Physician Is PCP">
                <Checkbox
                  checked={refPhysicianChecked}
                  onChange={() => setRefPhysicianChecked(!refPhysicianChecked)}
                />
              </Form.Item>
            </Col>
            {!refPhysicianChecked && (
              <Col
                xs={{ span: 24 }}
                sm={{ span: 12 }}
                md={{ span: 12 }}
                lg={{ span: 8 }}
              >
                <Form.Item
                  label={
                    <div className="tab2-ordering-provider-lable-conatiner">
                      <label>PCP Number</label>
                      {pcpNumberSuccessTick && (
                        <FiInfo
                          className="info-icon-for-displaying-info"
                          onClick={handleDisplayPCPNumberModal}
                        />
                      )}
                    </div>
                  }
                  name={CREATE_ORDER_FORM_KEY_NAMES.pcpNumber}
                  rules={CREATE_ORDER_FORM_FIELD_RULES.pcpNumber}
                  validateStatus={referringSuccessTick && "success"}
                  hasFeedback
                >
                  <InputNumber
                    className="co-tab-2-medical-history-number-input"
                    size="large"
                    placeholder="Enter PCP Number"
                    onChange={handlePCPNumber}
                    minLength={10}
                  />
                </Form.Item>
                {!pcpNumberSuccessTick && (
                  <Col>
                    <Button
                      size="large"
                      disabled={disbalePCPBtn}
                      className="co-tab-2-ordering-btn"
                      onClick={validatePCPNumber}
                    >
                      Validate
                    </Button>
                  </Col>
                )}
                {loadingPcpNumber && (
                  <div>
                    <Spin fullscreen />
                  </div>
                )}
              </Col>
            )}
          </Row>
        </Col>

        <Col className="tab-2-child-component-container-second">
          <Row span={24} gutter={24}>
            <Col
              xs={{ span: 24 }}
              sm={{ span: 12 }}
              md={{ span: 12 }}
              lg={{ span: 8 }}
            >
              <Form.Item label="Radiology Status">
                <Switch
                  checked={radilogyStatus}
                  onChange={() => setRadilogyStatus(!radilogyStatus)}
                />
              </Form.Item>
            </Col>

            <Col
              xs={{ span: 24 }}
              sm={{ span: 12 }}
              md={{ span: 12 }}
              lg={{ span: 8 }}
            >
              <Form.Item
                label="Radiology Facility"
                name={CREATE_ORDER_FORM_KEY_NAMES.radiologyFacility}
              >
                <Input size="large" placeholder="Radiology Facility" />
              </Form.Item>
            </Col>

            {radilogyStatus && (
              <Col
                xs={{ span: 24 }}
                sm={{ span: 12 }}
                md={{ span: 12 }}
                lg={{ span: 8 }}
              >
                <Form.Item label="Radiology Status File">
                  <Upload
                    action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                    listType="picture"
                    maxCount={1}
                    showUploadList={{
                      removeIcon: (
                        <BiTrash className="trash-icon-for-uploaded-img" />
                      ),
                    }}
                  >
                    <Button
                      size="large"
                      className="co-tab-2-upload-btn"
                      icon={<FiUpload />}
                    >
                      Upload File
                    </Button>
                  </Upload>
                </Form.Item>
              </Col>
            )}
          </Row>

          <Row span={24} gutter={24}>
            <Col
              xs={{ span: 24 }}
              sm={{ span: 12 }}
              md={{ span: 12 }}
              lg={{ span: 8 }}
            >
              <Form.Item label="Pathology Status">
                <Switch
                  checked={pathologyStatus}
                  onChange={() => setPathologyStatus(!pathologyStatus)}
                />
              </Form.Item>
            </Col>

            <Col
              xs={{ span: 24 }}
              sm={{ span: 12 }}
              md={{ span: 12 }}
              lg={{ span: 8 }}
            >
              <Form.Item
                label="Pathology Facility"
                name={CREATE_ORDER_FORM_KEY_NAMES.pathologyFacility}
              >
                <Input size="large" placeholder="Pathology Facility" />
              </Form.Item>
            </Col>

            {pathologyStatus && (
              <Col
                xs={{ span: 24 }}
                sm={{ span: 12 }}
                md={{ span: 12 }}
                lg={{ span: 8 }}
              >
                <Form.Item label="Pathology Status File">
                  <Upload
                    action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                    listType="picture"
                    maxCount={1}
                    showUploadList={{
                      removeIcon: (
                        <BiTrash className="trash-icon-for-uploaded-img" />
                      ),
                    }}
                  >
                    <Button
                      size="large"
                      className="co-tab-2-upload-btn"
                      icon={<FiUpload />}
                    >
                      Upload File
                    </Button>
                  </Upload>
                </Form.Item>
              </Col>
            )}
          </Row>

          <Row span={24} gutter={24}>
            <Col
              xs={{ span: 24 }}
              sm={{ span: 12 }}
              md={{ span: 12 }}
              lg={{ span: 8 }}
            >
              <Form.Item label="Lab Status">
                <Switch
                  checked={labStatus}
                  onChange={() => setLabStatus(!labStatus)}
                />
              </Form.Item>
            </Col>

            <Col
              xs={{ span: 24 }}
              sm={{ span: 12 }}
              md={{ span: 12 }}
              lg={{ span: 8 }}
            >
              <Form.Item
                label="Lab Facility"
                name={CREATE_ORDER_FORM_KEY_NAMES.labFacility}
              >
                <Input size="large" placeholder="Lab Facility" />
              </Form.Item>
            </Col>

            {labStatus && (
              <Col
                xs={{ span: 24 }}
                sm={{ span: 12 }}
                md={{ span: 12 }}
                lg={{ span: 8 }}
              >
                <Form.Item label="Lab Status File">
                  <Upload
                    action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                    listType="picture"
                    maxCount={1}
                    showUploadList={{
                      removeIcon: (
                        <BiTrash className="trash-icon-for-uploaded-img" />
                      ),
                    }}
                  >
                    <Button
                      size="large"
                      className="co-tab-2-upload-btn"
                      icon={<FiUpload />}
                    >
                      Upload File
                    </Button>
                  </Upload>
                </Form.Item>
              </Col>
            )}
          </Row>

          <Row span={24} gutter={24}>
            <Col
              xs={{ span: 24 }}
              sm={{ span: 12 }}
              md={{ span: 12 }}
              lg={{ span: 8 }}
            >
              <Form.Item label="Previous Authorization Status">
                <Switch
                  checked={previousAuthorization}
                  onChange={() =>
                    setPreviousAuthorization(!previousAuthorization)
                  }
                />
              </Form.Item>
            </Col>

            {previousAuthorization && (
              <Col
                xs={{ span: 24 }}
                sm={{ span: 12 }}
                md={{ span: 12 }}
                lg={{ span: 12 }}
              >
                <Form.Item label="Previous Authorization Status File">
                  <Upload
                    action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                    listType="picture"
                    maxCount={1}
                    showUploadList={{
                      removeIcon: (
                        <BiTrash className="trash-icon-for-uploaded-img" />
                      ),
                    }}
                  >
                    <Button
                      size="large"
                      className="co-tab-2-upload-btn"
                      icon={<FiUpload />}
                    >
                      Upload File
                    </Button>
                  </Upload>
                </Form.Item>
              </Col>
            )}
          </Row>

          <Row span={24} gutter={24}>
            <Col
              xs={{ span: 24 }}
              sm={{ span: 24 }}
              md={{ span: 24 }}
              lg={{ span: 24 }}
            >
              <Form.Item label="Single Medical Release Form">
                <Upload
                  action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                  listType="picture"
                  maxCount={1}
                  showUploadList={{
                    removeIcon: (
                      <BiTrash className="trash-icon-for-uploaded-img" />
                    ),
                  }}
                >
                  <Button
                    size="large"
                    className="co-tab-2-upload-btn"
                    icon={<FiUpload />}
                  >
                    Upload File
                  </Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
        </Col>

        <Form.Item>
          <Row className="co-all-tabs-btn-container">
            <Col>
              <Button className="co-all-tabs-cancel-btn" size="large">
                Cancel
              </Button>
            </Col>

            <Col>
              <Button className="co-all-tabs-save-as-draft-btn" size="large">
                Save As Draft
              </Button>
            </Col>

            <Col>
              <Button
                className="co-all-tabs-next-btn"
                size="large"
                htmlType="submit"
                disabled={!submittable}
              >
                Next
              </Button>
            </Col>
          </Row>
        </Form.Item>
      </Form>

      {/* Modal Start from Here */}

      {/* Ordering Provider Modal Start Here */}
      <Modal
        title={
          <div className="modal-title-container-with-close-icon">
            <h3 className="tab-2-modal-title-heading-text">Validate Record</h3>
            {orderingSuccessTick && (
              <AiOutlineClose
                onClick={handleHideOrderingModal}
                className="close-icon-for-modal"
              />
            )}
          </div>
        }
        open={displayOrderingModal}
        className="medical-history-modal-customized"
        transitionName=""
        closable={false}
        footer={
          !orderingSuccessTick
            ? [
                <Button size="large" onClick={handleCancelForOrderingModal}>
                  Cancel
                </Button>,
                <Button
                  size="large"
                  className="co-tab-2-modal-validate-btn"
                  onClick={handleConfirmForOrderingModal}
                >
                  Verify
                </Button>,
              ]
            : null
        }
      >
        <CretaeOrderModal dataObj={orderingProviderData} />
      </Modal>

      {/* Referring Provider Modal Start Here */}
      <Modal
        title={
          <div className="modal-title-container-with-close-icon">
            <h3 className="tab-2-modal-title-heading-text">Validate Record</h3>
            {referringSuccessTick && (
              <AiOutlineClose
                onClick={handleHideReferringModal}
                className="close-icon-for-modal"
              />
            )}
          </div>
        }
        open={displayReferringModal}
        className="medical-history-modal-customized"
        transitionName=""
        closable={false}
        footer={
          !referringSuccessTick
            ? [
                <Button size="large" onClick={handleCancelForReferringModal}>
                  Cancel
                </Button>,
                <Button
                  size="large"
                  className="co-tab-2-modal-validate-btn"
                  onClick={handleConfirmForReferringModal}
                >
                  Verify
                </Button>,
              ]
            : null
        }
      >
        <CretaeOrderModal dataObj={referringProviderData} />
      </Modal>

      {/* PCP Number Modal Start Here */}
      <Modal
        title={
          <div className="modal-title-container-with-close-icon">
            <h3 className="tab-2-modal-title-heading-text">Validate Record</h3>
            {pcpNumberSuccessTick && (
              <AiOutlineClose
                onClick={handleHidePCPNumberModal}
                className="close-icon-for-modal"
              />
            )}
          </div>
        }
        open={displayPCPNumberModal}
        className="medical-history-modal-customized"
        transitionName=""
        closable={false}
        footer={
          !pcpNumberSuccessTick
            ? [
                <Button size="large" onClick={handleCancelForPCPNumberModal}>
                  Cancel
                </Button>,
                <Button
                  size="large"
                  className="co-tab-2-modal-validate-btn"
                  onClick={handleConfirmForPCPNumberModal}
                >
                  Verify
                </Button>,
              ]
            : null
        }
      >
        <CretaeOrderModal dataObj={pcpNumberData} />
      </Modal>
    </div>
  );
};

export default MedicalHIstory;
