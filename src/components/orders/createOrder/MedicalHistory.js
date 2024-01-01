import React, { useEffect, useState } from 'react';
import '../../../styles/orders/createOrder/medicalHistory.css';
import '../../../styles/orders/createOrder.css';
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
} from 'antd';
import {
  ARE_YOU_SURE_WANT_DRAFT_ORDER,
  ARE_YOU_SURE_WANT_TO_CANCEL_ORDER,
  CASE_ID,
  MEDICAL_AND_INSURANCE_FILE_UPLOAD_CATEGORIES,
  CREATE_ORDER_FORM_FIELD_RULES,
  CREATE_ORDER_FORM_KEY_NAMES,
  DOCUMENTS_UPLOAD_IN_LAB_STATUS_CATEGORY,
  DOCUMENTS_UPLOAD_IN_MEDICAL_RELEASE_CATEGORY,
  DOCUMENTS_UPLOAD_IN_PATHOLOGY_CATEGORY,
  DOCUMENTS_UPLOAD_IN_PREV_AUTH_CATEGORY,
  DOCUMENTS_UPLOAD_IN_RADIOLOGY_CATEGORY,
  ERROR_MESSAGE_FOR_MAX_UPLOAD_DOCS,
  MAX_UPLOAD_DOCUMENTS_PER_CATEGORY,
  NPI_NUMBER_VALIDATION_ERROR_MESSAGE,
  ORDER_MODAL_CANCEL_TEXT,
  ORDER_MODAL_OK_TEXT,
  ORDER_STATUS,
  SMALL_SUCCESS,
  MEDICAL_HISTORY_FIELDS_ONLY,
  MEDICAL_RECORD__FIELDS_ONLY,
  ALL_PROVIDERS_MAX_LENGTH_COUNT,
  MEDICAL_HISTORY_AND_RECORD_CREATED_MESSAGE,
} from '@/utils/constant.util';
import { FiInfo, FiUpload } from 'react-icons/fi';
import { BiTrash } from 'react-icons/bi';
import { MEDICAL_HISTORY_DIAGNOSIS_OPTIONS } from '@/utils/options';
import { useDispatch, useSelector } from 'react-redux';
import {
  getValidateOrderingProvider,
  getValidatePCPNumber,
  getValidateReferringProvider,
  postMedicalHistoryData,
  postMedicalRecordData,
  postUploadFile,
  setDisplayOrderingModal,
  setDisplayPCPNumberModal,
  setDisplayReferringModal,
  setValidationCancelForOrdering,
  setValidationCancelForPCPNumber,
  setValidationCancelForReferring,
  orderSaveAsDraft,
  setMedicalUploadedFilesById,
  setPatientDocsFilesById,
  setIsTab2DataChanges,
  setMedicalFilesAtEditById,
  setPatientFilesAtEditById,
  updateOrderData,
  setTab1FormData,
  setHistoryCreated,
  resetSearchPatientData,
} from '@/store/orderSlice';
import CretaeOrderModal from './CretaeOrderModal';
import {
  resetCreateOrderDataBacktoInitialState,
  setCurrentSelectedTab,
  setDisplayPcpNumberSuccessTick,
  setDisplayReferringSuccessTick,
  setDisplayorderingSuccessTick,
  setInsuranceInfoTab,
  setTab2FormData,
} from '@/store/createOrderFormSlice';
import {
  AiFillExclamationCircle,
  AiOutlineClose,
  AiOutlineUnorderedList,
} from 'react-icons/ai';
import { useRouter } from 'next/router';
import OrderModal from './OrderModal';
import UploadedImageContainer from './UploadedImageContainer';
import {
  beforeFileUpload,
  extractIdsFromNestedObjects,
  fileLengthCheck,
  filterObjectByKeys,
  replaceNullWithEmptyString,
} from '@/utils/commonFunctions';

const MedicalHIstory = () => {
  const router = useRouter();
  const { orderId } = router.query;
  const [formData] = Form.useForm();
  const formValues = Form.useWatch([], formData);
  const [submittable, setSubmittable] = useState(false);
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState(ARE_YOU_SURE_WANT_TO_CANCEL_ORDER);
  const [isDraftModal, setIsDraftModal] = useState(false);

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
  const medicalUploadedFilesById = useSelector(
    (state) => state.allOrdersData.medicalUploadedFilesById
  );

  const createNewHistory = useSelector(
    (state) => state.allOrdersData.createNewHistory
  );

  const patientSearchData = useSelector(
    (state) => state.allOrdersData.patientRecordSearchData
  );
  const medicalHistoryOnly = useSelector(
    (state) => state.allOrdersData.medicalHistoryOnly
  );
  const medicalRecordOnly = useSelector(
    (state) => state.allOrdersData.medicalRecordOnly
  );
  const searchResponse = useSelector(
    (state) => state.allOrdersData.patientSearchResponse
  );
  const displaySearchModal = useSelector(
    (state) => state.allOrdersData.displaySearchModal
  );
  const patientDemographicsData = useSelector(
    (state) => state.allOrdersData.patientDemographicsData
  );
  const isNewPatientCreated = useSelector(
    (state) => state.allOrdersData.isNewPatientCreated
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
  const tab2DataForTraceEdit = useSelector(
    (state) => state.allOrdersData.medicalHistoryAndRecordDataForEdit
  );
  // Handling Documents Uploads state
  const patientAllUploadedFilesData = useSelector(
    (state) => state.allOrdersData.patientAllUploadedFilesData
  );
  const patientUploadedDocsData = useSelector(
    (state) => state.allOrdersData.patientUploadedDocsData
  );

  const [chemoStatus, setChemoStatus] = useState(
    tab2FormData?.chemoTherapyStatus || false
  );
  const [refPhysicianChecked, setRefPhysicianChecked] = useState(true);
  const [radiologyStatus, setRadiologyStatus] = useState(
    tab2FormData?.isRadiologyStatus || false
  );
  const [pathologyStatus, setPathologyStatus] = useState(
    tab2FormData?.isPathologyStatus || false
  );
  const [labStatus, setLabStatus] = useState(
    tab2FormData?.isLabStatus || false
  );
  const [previousAuthorization, setPreviousAuthorization] = useState(
    tab2FormData?.isPreviousAuthorizationStatus || false
  );

  const [disableOrderingBtn, setDisableOrderingBtn] = useState(true);
  const [disableProviderBtn, setDisableProviderBtn] = useState(true);
  const [disbalePCPBtn, setDisbalePCPBtn] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleOrderingProvider = (value) => {
    if (value?.toString()?.trim()?.length === ALL_PROVIDERS_MAX_LENGTH_COUNT) {
      setDisableOrderingBtn(false);
    } else {
      setDisableOrderingBtn(true);
    }

    if (
      orderingResStatus &&
      orderingSuccessTick &&
      orderingProviderData?.npiNumber != value
    ) {
      dispatch(setDisplayorderingSuccessTick(false));
    } else if (
      orderingResStatus &&
      !orderingSuccessTick &&
      orderingProviderData?.npiNumber == value
    ) {
      dispatch(setDisplayorderingSuccessTick(true));
    }
  };

  const handleReferringProvider = (value) => {
    if (value?.toString()?.trim()?.length === ALL_PROVIDERS_MAX_LENGTH_COUNT) {
      setDisableProviderBtn(false);
    } else {
      setDisableProviderBtn(true);
    }

    if (
      referringResStatus &&
      referringSuccessTick &&
      referringProviderData?.npiNumber != value
    ) {
      dispatch(setDisplayReferringSuccessTick(false));
    } else if (
      referringResStatus &&
      !referringSuccessTick &&
      referringProviderData?.npiNumber == value
    ) {
      dispatch(setDisplayReferringSuccessTick(true));
    }
  };

  const handlePCPNumber = (value) => {
    if (value?.toString()?.trim()?.length === ALL_PROVIDERS_MAX_LENGTH_COUNT) {
      setDisbalePCPBtn(false);
    } else {
      setDisbalePCPBtn(true);
    }

    if (
      pcpNumberResStatus &&
      pcpNumberSuccessTick &&
      pcpNumberData.npiNumber != value
    ) {
      dispatch(setDisplayPCPNumberModal(false));
    } else if (
      pcpNumberResStatus &&
      !pcpNumberSuccessTick &&
      pcpNumberData.npiNumber == value
    ) {
      dispatch(setDisplayPCPNumberModal(true));
    }
  };

  const validateOrderingProvider = () => {
    const npiNumber = formData.getFieldValue(
      CREATE_ORDER_FORM_KEY_NAMES.orderingProvider
    );
    if (
      npiNumber?.toString()?.trim()?.length === ALL_PROVIDERS_MAX_LENGTH_COUNT
    ) {
      dispatch(
        getValidateOrderingProvider({ npiNumber, event: 'atCreate' })
      ).then((res) => {
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
    if (
      npiNumber?.toString()?.trim()?.length === ALL_PROVIDERS_MAX_LENGTH_COUNT
    ) {
      dispatch(
        getValidateReferringProvider({ npiNumber, event: 'atCreate' })
      ).then((res) => {
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
    if (
      npiNumber?.toString()?.trim()?.length === ALL_PROVIDERS_MAX_LENGTH_COUNT
    ) {
      dispatch(getValidatePCPNumber({ npiNumber, event: 'atCreate' })).then(
        (res) => {
          if (!res?.payload?.status) {
            message.error(res?.payload?.message);
          }
        }
      );
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

  const customRequest = (file, category) => {
    const { id = 1 } = patientDemographicsData;
    const matchingCategory = MEDICAL_AND_INSURANCE_FILE_UPLOAD_CATEGORIES.find(
      (cat) => cat.value === category
    );
    if (
      matchingCategory &&
      fileLengthCheck(patientAllUploadedFilesData[matchingCategory.key])
    ) {
      dispatch(
        postUploadFile({ file: file.file, type: category, patientId: id })
      ).then((res) => {
        message[res?.payload?.status ? 'success' : 'error'](
          res?.payload?.message
        );
      });
    } else {
      message.error(ERROR_MESSAGE_FOR_MAX_UPLOAD_DOCS);
    }
  };

  const handleSubmitTab2Data = async (values) => {
    let traceChanges = false;
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
      pcpName = '',
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

    if (searchResponse) {
      const commonKeys =
        tab2DataForTraceEdit &&
        Object.keys(tab2DataForTraceEdit).filter((key) =>
          payload.hasOwnProperty(key)
        );
      const updatedTab2Data = replaceNullWithEmptyString(payload);
      const updatedEditChangeValue =
        replaceNullWithEmptyString(tab2DataForTraceEdit);

      traceChanges = commonKeys.some(
        (key) => updatedTab2Data[key] != updatedEditChangeValue[key]
      );
    }

    if (createNewHistory || traceChanges) {
      try {
        const [medicalHistoryResponse, medicalRecordResponse] =
          await Promise.all([
            dispatch(postMedicalHistoryData(payload1)),
            dispatch(postMedicalRecordData(payload2)),
          ]);
        const medicalHistorySuccess = medicalHistoryResponse?.payload?.status;
        const medicalRecordSuccess = medicalRecordResponse?.payload?.status;

        if (medicalHistorySuccess && medicalRecordSuccess) {
          message.success(MEDICAL_HISTORY_AND_RECORD_CREATED_MESSAGE);
          dispatch(setInsuranceInfoTab(false));
          dispatch(setHistoryCreated(false));
          dispatch(setCurrentSelectedTab('insuranceInfo'));
        } else {
          if (!medicalHistorySuccess) {
            message.error(medicalHistoryResponse?.payload?.message);
          }
          if (!medicalRecordSuccess) {
            message.error(medicalRecordResponse?.payload?.message);
          }
        }
      } catch (error) {
        message.error(error?.message);
      }
    } else {
      dispatch(setCurrentSelectedTab('insuranceInfo'));
    }
  };

  const saveOrderAsDraft = async () => {
    let traceChanges = false;
    setLoading(true);
    const { id } = patientDemographicsData;
    const newValues = {
      ...tab2FormData,
    };

    const medicalHistory = {
      patientId: id,
      diagnosis: newValues.diagnosis,
      chemoTherapyStatus: newValues.chemoTherapyStatus || false,
      orderingProvider: newValues.orderingProvider.toString(),
      referringProvider: newValues.referringProvider.toString(),
      isReferringPhysician: newValues.isReferringPhysician,
      pcpName: newValues.isReferringPhysician
        ? newValues.referringProvider.toString()
        : newValues.pcpName.toString(),
    };

    const medicalRecord = {
      patientId: id,
      isRadiologyStatus: newValues.isRadiologyStatus || false,
      radiologyFacility: newValues.radiologyFacility || '',
      isPathologyStatus: newValues.isPathologyStatus || false,
      pathologyFacility: newValues.pathologyFacility || '',
      isLabStatus: newValues.isLabStatus || false,
      labFacility: newValues.labFacility || '',
      isPreviousAuthorizationStatus:
        newValues.isPreviousAuthorizationStatus || false,
      singleMedicalReleaseForm: newValues.singleMedicalReleaseForm,
    };
    // here we will identify that if the user has changed any value in the form
    if (searchResponse) {
      const commonKeys =
        tab2DataForTraceEdit &&
        Object.keys(tab2DataForTraceEdit).filter((key) =>
        medicalHistory.hasOwnProperty(key)
        );
      const updatedTab2Data = replaceNullWithEmptyString(medicalHistory);
      const updatedEditChangeValue =
        replaceNullWithEmptyString(tab2DataForTraceEdit);

      traceChanges = commonKeys.some(
        (key) => updatedTab2Data[key] != updatedEditChangeValue[key]
      );
    }
    let historyId = medicalHistoryOnly?.id;
    let recordId = medicalRecordOnly?.id;
    if (createNewHistory || traceChanges) {
      const createdHistory = await dispatch(
        postMedicalHistoryData(medicalHistory)
      );
      if (createdHistory) {
        historyId = createdHistory?.payload?.data?.id;
      }
      if (!createdHistory?.payload?.status) {
        message.error(createdHistory?.payload?.message);
        return;
      }
      const createdRecord = await dispatch(
        postMedicalRecordData(medicalRecord)
      );
      if (createdRecord) {
        recordId = createdRecord?.payload?.data?.id;
      }
      if (!createdRecord?.payload?.status) {
        message.error(createdRecord?.payload?.message);
        return;
      }
    }
    let order;
    if (orderId) {
      const payload = {
        patientId: id,
        historyId: historyId,
        recordId: recordId,
        uploadFiles: medicalUploadedFilesById,
      };
      order = await dispatch(updateOrderData({ orderId, payload }));
    } else {
      order = await dispatch(
        orderSaveAsDraft({
          caseId: CASE_ID,
          patientId: id,
          historyId: historyId,
          recordId: recordId,
          currentStatus: ORDER_STATUS.draft,
          uploadFiles: medicalUploadedFilesById,
        })
      );
    }
    if (order?.payload?.status) {
      dispatch(setTab1FormData({}));
      dispatch(resetCreateOrderDataBacktoInitialState());
      dispatch(resetSearchPatientData());
      message.success(order?.payload?.message);
      router.push('/order-management');
      setLoading(false);
    } else {
      message.info(order?.payload?.message);
      setLoading(false);
    }
  };

  const showModal = (type) => {
    if (type === ORDER_STATUS.draft) {
      setIsDraftModal(true);
      setModalText(ARE_YOU_SURE_WANT_DRAFT_ORDER);
    } else {
      setIsDraftModal(false);
      setModalText(ARE_YOU_SURE_WANT_TO_CANCEL_ORDER);
    }
    setOpen(true);
  };
  const handleOk = () => {
    setConfirmLoading(true);
    if (isDraftModal) {
      setOpen(false);
      setConfirmLoading(false);
      saveOrderAsDraft();
      return;
    }
    setOpen(false);
    setConfirmLoading(false);
    dispatch(resetCreateOrderDataBacktoInitialState());
    dispatch(setTab1FormData({}));
    dispatch(resetSearchPatientData());
    router.push('/order-management');
  };
  const handleCancel = () => {
    setOpen(false);
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
    const laterValues = {
      chemoTherapyStatus: chemoStatus,
      isReferringPhysician: refPhysicianChecked,
      isRadiologyStatus: radiologyStatus,
      isPathologyStatus: pathologyStatus,
      isLabStatus: labStatus,
      isPreviousAuthorizationStatus: previousAuthorization,
    };
    const updatedValues = { ...initialValues, ...laterValues };
    dispatch(setTab2FormData(updatedValues));
  }, [
    chemoStatus,
    refPhysicianChecked,
    radiologyStatus,
    pathologyStatus,
    labStatus,
    previousAuthorization,
  ]);

  useEffect(() => {
    if (
      searchResponse &&
      medicalHistoryOnly &&
      medicalRecordOnly &&
      Object.keys(medicalHistoryOnly)?.length > 0 &&
      Object.keys(medicalRecordOnly)?.length > 0
    ) {
      const updatedMedicalHistoryData = filterObjectByKeys(
        medicalHistoryOnly,
        MEDICAL_HISTORY_FIELDS_ONLY
      );
      const updatedMedicalRecordData = filterObjectByKeys(
        medicalRecordOnly,
        MEDICAL_RECORD__FIELDS_ONLY
      );
      formData.setFieldsValue({
        ...updatedMedicalHistoryData,
        ...updatedMedicalRecordData,
      });
      const updatedValues = {
        ...tab2FormData,
        ...updatedMedicalHistoryData,
        ...updatedMedicalRecordData,
      };
      setChemoStatus(medicalHistoryOnly?.chemoTherapyStatus);
      setRefPhysicianChecked(medicalHistoryOnly?.isReferringPhysician);
      setRadiologyStatus(medicalRecordOnly?.isRadiologyStatus);
      setPathologyStatus(medicalRecordOnly?.isPathologyStatus);
      setLabStatus(medicalRecordOnly?.isLabStatus);
      setPreviousAuthorization(
        medicalRecordOnly?.isPreviousAuthorizationStatus
      );
      dispatch(setTab2FormData(updatedValues));
      dispatch(
        setIsTab2DataChanges({
          ...updatedMedicalHistoryData,
          ...updatedMedicalRecordData,
        })
      );
      const idsArrForMedicalAndInsurance = extractIdsFromNestedObjects(
        patientAllUploadedFilesData
      );
      dispatch(setMedicalUploadedFilesById(idsArrForMedicalAndInsurance));
      dispatch(setMedicalFilesAtEditById(idsArrForMedicalAndInsurance));
      const idsArrForPatientDocumentsTab = extractIdsFromNestedObjects(
        patientUploadedDocsData
      );
      dispatch(setPatientDocsFilesById(idsArrForPatientDocumentsTab));
      const validateProvider = (
        providerType,
        validateAction,
        successAction
      ) => {
        const npiNumber = medicalHistoryOnly?.[providerType];
        if (npiNumber) {
          dispatch(validateAction({ npiNumber })).then((res) => {
            if (res?.payload?.status) {
              dispatch(successAction(true));
            }
          });
        }
      };

      validateProvider(
        'orderingProvider',
        getValidateOrderingProvider,
        setDisplayorderingSuccessTick
      );
      validateProvider(
        'referringProvider',
        getValidateReferringProvider,
        setDisplayReferringSuccessTick
      );
      validateProvider(
        'pcpName',
        getValidatePCPNumber,
        setDisplayPcpNumberSuccessTick
      );
    }
  }, [displaySearchModal, patientSearchData]);

  return (
    <div className="create-order-medical-history-tab-2-container">
      {loading && <Spin fullscreen />}
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
                  checked={chemoStatus}
                  onChange={() => setChemoStatus(!chemoStatus)}
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
                validateStatus={orderingSuccessTick && SMALL_SUCCESS}
                hasFeedback
              >
                <InputNumber
                  className="co-tab-2-medical-history-number-input"
                  size="large"
                  placeholder="Enter NPI Number"
                  onChange={handleOrderingProvider}
                  minLength={ALL_PROVIDERS_MAX_LENGTH_COUNT}
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
                validateStatus={referringSuccessTick && SMALL_SUCCESS}
                hasFeedback
              >
                <InputNumber
                  className="co-tab-2-medical-history-number-input"
                  size="large"
                  placeholder="Enter NPI Number"
                  onChange={handleReferringProvider}
                  minLength={ALL_PROVIDERS_MAX_LENGTH_COUNT}
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
                  validateStatus={referringSuccessTick && SMALL_SUCCESS}
                  hasFeedback
                >
                  <InputNumber
                    className="co-tab-2-medical-history-number-input"
                    size="large"
                    placeholder="Enter PCP Number"
                    onChange={handlePCPNumber}
                    minLength={ALL_PROVIDERS_MAX_LENGTH_COUNT}
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
                  checked={radiologyStatus}
                  onChange={() => setRadiologyStatus(!radiologyStatus)}
                  disabled={
                    patientAllUploadedFilesData?.radiologyFiles?.length > 0
                  }
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

            {radiologyStatus &&
              patientAllUploadedFilesData?.radiologyFiles?.length <= 4 && (
                <Col
                  xs={{ span: 24 }}
                  sm={{ span: 12 }}
                  md={{ span: 12 }}
                  lg={{ span: 8 }}
                >
                  <Form.Item label="Radiology Status File">
                    <Upload
                      beforeUpload={beforeFileUpload}
                      customRequest={(file) =>
                        customRequest(
                          file,
                          DOCUMENTS_UPLOAD_IN_RADIOLOGY_CATEGORY
                        )
                      }
                      listType="picture"
                      maxCount={MAX_UPLOAD_DOCUMENTS_PER_CATEGORY}
                      showUploadList={false}
                      disabled={
                        patientAllUploadedFilesData?.radiologyFiles?.length ===
                        MAX_UPLOAD_DOCUMENTS_PER_CATEGORY
                      }
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
            {patientAllUploadedFilesData?.radiologyFiles?.map((elem) => (
              <Col
                xs={{ span: 24 }}
                sm={{ span: 12 }}
                md={{ span: 12 }}
                lg={{ span: 8 }}
                className="co-tab-2-upload-image-container-at-radiology"
                key={elem?.id}
              >
                <UploadedImageContainer
                  data={{
                    ...elem,
                    category: DOCUMENTS_UPLOAD_IN_RADIOLOGY_CATEGORY,
                  }}
                />
              </Col>
            ))}
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
                  disabled={
                    patientAllUploadedFilesData?.pathologyFiles?.length > 0
                  }
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

            {pathologyStatus &&
              patientAllUploadedFilesData?.pathologyFiles?.length <= 4 && (
                <Col
                  xs={{ span: 24 }}
                  sm={{ span: 12 }}
                  md={{ span: 12 }}
                  lg={{ span: 8 }}
                >
                  <Form.Item label="Pathology Status File">
                    <Upload
                      beforeUpload={beforeFileUpload}
                      customRequest={(file) =>
                        customRequest(
                          file,
                          DOCUMENTS_UPLOAD_IN_PATHOLOGY_CATEGORY
                        )
                      }
                      listType="picture"
                      maxCount={MAX_UPLOAD_DOCUMENTS_PER_CATEGORY}
                      showUploadList={false}
                      disabled={
                        patientAllUploadedFilesData?.pathologyFiles?.length ===
                        MAX_UPLOAD_DOCUMENTS_PER_CATEGORY
                      }
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
            {patientAllUploadedFilesData?.pathologyFiles?.map((elem) => (
              <Col
                xs={{ span: 24 }}
                sm={{ span: 12 }}
                md={{ span: 12 }}
                lg={{ span: 8 }}
                className="co-tab-2-upload-image-container-at-radiology"
                key={elem?.id}
              >
                <UploadedImageContainer
                  data={{
                    ...elem,
                    category: DOCUMENTS_UPLOAD_IN_PATHOLOGY_CATEGORY,
                  }}
                />
              </Col>
            ))}
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
                  disabled={
                    patientAllUploadedFilesData?.labStatusFiles?.length > 0
                  }
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

            {labStatus &&
              patientAllUploadedFilesData?.labStatusFiles?.length <= 4 && (
                <Col
                  xs={{ span: 24 }}
                  sm={{ span: 12 }}
                  md={{ span: 12 }}
                  lg={{ span: 8 }}
                >
                  <Form.Item label="Lab Status File">
                    <Upload
                      beforeUpload={beforeFileUpload}
                      customRequest={(file) =>
                        customRequest(
                          file,
                          DOCUMENTS_UPLOAD_IN_LAB_STATUS_CATEGORY
                        )
                      }
                      listType="picture"
                      maxCount={MAX_UPLOAD_DOCUMENTS_PER_CATEGORY}
                      showUploadList={false}
                      disabled={
                        patientAllUploadedFilesData?.labStatusFiles?.length ===
                        MAX_UPLOAD_DOCUMENTS_PER_CATEGORY
                      }
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
            {patientAllUploadedFilesData?.labStatusFiles?.map((elem) => (
              <Col
                xs={{ span: 24 }}
                sm={{ span: 12 }}
                md={{ span: 12 }}
                lg={{ span: 8 }}
                className="co-tab-2-upload-image-container-at-radiology"
                key={elem?.id}
              >
                <UploadedImageContainer
                  data={{
                    ...elem,
                    category: DOCUMENTS_UPLOAD_IN_LAB_STATUS_CATEGORY,
                  }}
                />
              </Col>
            ))}
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
                  disabled={
                    patientAllUploadedFilesData?.prevAuthorizationFiles
                      ?.length > 0
                  }
                />
              </Form.Item>
            </Col>

            {previousAuthorization &&
              patientAllUploadedFilesData?.prevAuthorizationFiles?.length <=
                4 && (
                <Col
                  xs={{ span: 24 }}
                  sm={{ span: 12 }}
                  md={{ span: 12 }}
                  lg={{ span: 12 }}
                >
                  <Form.Item label="Previous Authorization Status File">
                    <Upload
                      beforeUpload={beforeFileUpload}
                      customRequest={(file) =>
                        customRequest(
                          file,
                          DOCUMENTS_UPLOAD_IN_PREV_AUTH_CATEGORY
                        )
                      }
                      listType="picture"
                      maxCount={MAX_UPLOAD_DOCUMENTS_PER_CATEGORY}
                      showUploadList={false}
                      disabled={
                        patientAllUploadedFilesData?.prevAuthorizationFiles
                          ?.length === MAX_UPLOAD_DOCUMENTS_PER_CATEGORY
                      }
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
            {patientAllUploadedFilesData?.prevAuthorizationFiles?.map(
              (elem) => (
                <Col
                  xs={{ span: 24 }}
                  sm={{ span: 12 }}
                  md={{ span: 12 }}
                  lg={{ span: 8 }}
                  className="co-tab-2-upload-image-container-at-radiology"
                  key={elem?.id}
                >
                  <UploadedImageContainer
                    data={{
                      ...elem,
                      category: DOCUMENTS_UPLOAD_IN_PREV_AUTH_CATEGORY,
                    }}
                  />
                </Col>
              )
            )}
          </Row>

          <Row span={24} gutter={24}>
            <Col
              xs={{ span: 24 }}
              sm={{ span: 24 }}
              md={{ span: 24 }}
              lg={{ span: 24 }}
            >
              {patientAllUploadedFilesData?.medicalReleaseFiles?.length ===
                MAX_UPLOAD_DOCUMENTS_PER_CATEGORY && (
                <p className="co-tab-2-p-tag-customize">
                  Single Medical Release Form
                </p>
              )}
              {patientAllUploadedFilesData?.medicalReleaseFiles?.length <=
                4 && (
                <Form.Item label="Single Medical Release Form">
                  <Upload
                    beforeUpload={beforeFileUpload}
                    customRequest={(file) =>
                      customRequest(
                        file,
                        DOCUMENTS_UPLOAD_IN_MEDICAL_RELEASE_CATEGORY
                      )
                    }
                    listType="picture"
                    maxCount={MAX_UPLOAD_DOCUMENTS_PER_CATEGORY}
                    showUploadList={false}
                    disabled={
                      patientAllUploadedFilesData?.medicalReleaseFiles
                        ?.length === MAX_UPLOAD_DOCUMENTS_PER_CATEGORY
                    }
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
              )}
            </Col>
          </Row>
          <Row span={24} gutter={24}>
            {patientAllUploadedFilesData?.medicalReleaseFiles?.map((elem) => (
              <Col
                xs={{ span: 24 }}
                sm={{ span: 12 }}
                md={{ span: 12 }}
                lg={{ span: 8 }}
                className="co-tab-2-upload-image-container-at-radiology"
                key={elem?.id}
              >
                <UploadedImageContainer
                  data={{
                    ...elem,
                    category: DOCUMENTS_UPLOAD_IN_MEDICAL_RELEASE_CATEGORY,
                  }}
                />
              </Col>
            ))}
          </Row>
        </Col>

        <Form.Item>
          <Row className="co-all-tabs-btn-container">
            <Col>
              <Button
                className="co-all-tabs-cancel-btn"
                size="large"
                onClick={() => showModal(ORDER_STATUS.cancel)}
              >
                Cancel
              </Button>
            </Col>

            <Col>
              <Button
                className="co-all-tabs-save-as-draft-btn"
                size="large"
                disabled={!submittable}
                onClick={() => showModal(ORDER_STATUS.draft)}
              >
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
      <OrderModal
        title={
          isDraftModal ? (
            <AiOutlineUnorderedList size={40} color="grey" />
          ) : (
            <AiFillExclamationCircle color="red" size={45} />
          )
        }
        open={open}
        handleOk={handleOk}
        confirmLoading={confirmLoading}
        handleCancel={handleCancel}
        modalText={modalText}
        okText={ORDER_MODAL_OK_TEXT}
        cancelText={ORDER_MODAL_CANCEL_TEXT}
      />
    </div>
  );
};

export default MedicalHIstory;
