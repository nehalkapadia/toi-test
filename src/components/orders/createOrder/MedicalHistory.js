import React, { useEffect, useState } from 'react';
import '../../../styles/orders/createOrder/medicalHistory.css';
import '../../../styles/orders/createOrder.css';
import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Switch,
  Tooltip,
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
  SELECT_AT_LIST_RADIOLOGY_FILE,
  SELECT_AT_LIST_PATHOLOGY_FILE,
  SELECT_AT_LIST_LAB_FILE,
  SELECT_AT_LIST_PREV_AUTH_FILE,
  MEDICAL_HISTORY_AND_RECORD_UPDATED_MESSAGE,
  PCP_AND_REFERRING_PROVIDER_NOT_SAME_WARNING,
  FIRST_VALIDATE_REFERRING_NUMBER,
  FIRST_VALIDATE_PCP_NUMBER,
  TOGGLER_KEYS_FOR_MEDICAL_TAB,
  YES,
  NO,
  DEFAULT_ORDER_TYPE,
  CHEMO_ORDER_TYPE,
  OFFICE_VISIT_ORDER_TYPE,
  RADIATION_ORDER_TYPE,
  DATE_FORMAT_STARTING_FROM_MONTH,
  DATE_FORMAT_STARTING_FROM_YEAR,
  MEDICAL_HISTORY_PROVIDER_TYPES,
  ALL_DATE_RELATED_FIELDS_FOR_CREATE_ORDER,
} from '@/utils/constant.util';
import { FiInfo, FiUpload } from 'react-icons/fi';
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
  orderSaveAsDraft,
  setIsTab2DataChanges,
  updateOrderData,
  setTab1FormData,
  setHistoryCreated,
  resetSearchPatientData,
  resetOrderStateToInitialState,
  getDiagnosisDropDownValues,
  setDiagnosisId,
  setValidatePCPNumberDataToNull,
} from '@/store/orderSlice';
import ProviderDetailsModal from './ProviderDetailsModal';
import {
  resetCreateOrderDataBacktoInitialState,
  setCurrentSelectedTab,
  setDiagnosisSearchedValue,
  setDisplayPcpNumberSuccessTick,
  setDisplayReferringSuccessTick,
  setDisplayorderingSuccessTick,
  setInsuranceInfoTab,
  setMedicalHistoryTab,
  setOrderDetailsTab,
  setPateintDocsTab,
  setPatientDemographicsTab,
  setTab2FormData,
} from '@/store/createOrderFormSlice';
import {
  AiFillExclamationCircle,
  AiOutlineUnorderedList,
} from 'react-icons/ai';
import { useRouter } from 'next/router';
import OrderModal from './OrderModal';
import UploadedImageContainer from './UploadedImageContainer';
import {
  beforeFileUpload,
  commonFuncForTracingChanges,
  commonReferringAndPCPFunc,
  compareTwoObjectsForMedicalTab,
  fileLengthCheck,
  filterObjectByKeys,
  formatDatesByDateKeysArr,
  replaceNullWithEmptyString,
  validateNPINumberLength,
} from '@/utils/commonFunctions';
import DisplayFileSize from './DisplayFileSize';
import CustomSpinner from '@/components/CustomSpinner';
import dayjs from 'dayjs';

const MedicalHIstory = () => {
  const router = useRouter();
  const { orderId, type: orderType } = router.query;
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
  const patientDocsFilesById = useSelector(
    (state) => state.allOrdersData.patientDocsFilesById
  );
  const createNewHistory = useSelector(
    (state) => state.allOrdersData.createNewHistory
  );
  const diagnosisDropDownValues = useSelector(
    (state) => state.allOrdersData.diagnosisDropDownValues || []
  );
  const diagnosisSearchedValue = useSelector(
    (state) => state.createOrderTabs.diagnosisSearchedValue
  );
  const patientSearchData = useSelector(
    (state) => state.allOrdersData.patientRecordSearchData
  );
  const searchResponse = useSelector(
    (state) => state.allOrdersData.patientSearchResponse
  );
  const medicalHistoryOnly =
    useSelector((state) => state.allOrdersData.medicalHistoryOnly) || {};
  const medicalRecordOnly =
    useSelector((state) => state.allOrdersData.medicalRecordOnly) || {};

  const patientId = useSelector((state) => state.allOrdersData.patientId);

  const medicalHistoryId = useSelector(
    (state) => state.allOrdersData.medicalHistoryId
  );
  const medicalRecordId = useSelector(
    (state) => state.allOrdersData.medicalRecordId
  );
  const insuranceInfoId = useSelector(
    (state) => state.allOrdersData.insuranceInfoId
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
  const diagnosisId = useSelector((state) => state.allOrdersData.diagnosisId);

  const [chemoStatus, setChemoStatus] = useState(
    tab2FormData?.chemoTherapyStatus || false
  );
  const [refPhysicianChecked, setRefPhysicianChecked] = useState(
    tab2FormData?.isReferringPhysician ?? true
  );
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

  const orderTypeList = useSelector(
    (state) => state.allOrdersData.orderTypeList
  );

  const orderDetailsData =
    useSelector((state) => state.allOrdersData.orderDetailsData) || {};

  const [disableOrderingBtn, setDisableOrderingBtn] = useState(true);
  const [disableProviderBtn, setDisableProviderBtn] = useState(true);
  const [disbalePCPBtn, setDisbalePCPBtn] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isValuesChanged, setIsValuesChanged] = useState(false);
  const [pcpNumberTick, setPcpNumberTick] = useState(pcpNumberSuccessTick);
  const [orderingTick, setOrderingTick] = useState(orderingSuccessTick);
  const [referringTick, setReferringTick] = useState(referringSuccessTick);
  const [customHistoryAndRecordResData, setCustomHistoryAndRecordResData] =
    useState({});

  // When we have data in response.
  const singleMedicalHistoryAndRecordObj = () => {
    const medicalHistoryData = filterObjectByKeys(
      { ...medicalHistoryOnly },
      MEDICAL_HISTORY_FIELDS_ONLY?.[orderType]
    );
    const medicalRecordData = filterObjectByKeys(
      { ...medicalRecordOnly },
      MEDICAL_RECORD__FIELDS_ONLY?.[orderType]
    );

    const historyAndRecordObject = {
      ...medicalHistoryData,
      ...medicalRecordData,
    };

    return historyAndRecordObject;
  };

  const commonConditionalValueFunc = (data) => {
    let conditionalFormData = { ...data };

    if (!data?.chemoTherapyStatus) {
      conditionalFormData = {
        ...conditionalFormData,
        ...{ chemotherapyOrdered: null },
      };
    }
    if (!data?.isRadiologyStatus) {
      conditionalFormData = {
        ...conditionalFormData,
        ...{ radiologyFacility: null },
      };
    }
    if (!data?.isPathologyStatus) {
      conditionalFormData = {
        ...conditionalFormData,
        ...{ pathologyFacility: null },
      };
    }
    if (!data?.isLabStatus) {
      conditionalFormData = {
        ...conditionalFormData,
        ...{ labFacility: null },
      };
    }
    if (data?.isReferringPhysician) {
      conditionalFormData = {
        ...conditionalFormData,
        ...{ pcpName: null },
      };
    }

    return conditionalFormData;
  };

  const handleSearchValueForDiagnosis = (value) => {
    dispatch(setDiagnosisSearchedValue(value));
  };

  const renderOption = (option) => (
    <Tooltip title={option.label} key={option.value}>
      {option.label}
    </Tooltip>
  );

  const onDropDownValueChange = async (value, obj) => {
    const payload = { ...tab2FormData, diagnosisId: obj?.id };
    dispatch(setDiagnosisId(obj?.id));
    dispatch(setTab2FormData(payload));
  };

  const filterOrderTypeId = () => {
    const orderTypeData = orderTypeList.find(
      (item) => item?.label.toLowerCase() === orderType.toLowerCase()
    );
    return orderTypeData?.id;
  };

  const checkForReferringPhysician = (refPhysician) => {
    switch (true) {
      case refPhysician: {
        return setSubmittable(true);
      }
      case !refPhysician && pcpNumberSuccessTick: {
        return setSubmittable(true);
      }
      default: {
        return setSubmittable(false);
      }
    }
  };

  const onValuesChange = (changedValues) => {
    const tab2Data = { ...tab2FormData, ...changedValues };

    ALL_DATE_RELATED_FIELDS_FOR_CREATE_ORDER?.length > 0 &&
      ALL_DATE_RELATED_FIELDS_FOR_CREATE_ORDER?.forEach((key) => {
        if (tab2Data?.[key]) {
          tab2Data[key] = dayjs(tab2Data?.[key]).format(
            DATE_FORMAT_STARTING_FROM_YEAR
          );
        }
      });
    const conditionalFormData = commonConditionalValueFunc({ ...tab2Data });
    const historyAndRecordObject = singleMedicalHistoryAndRecordObj();

    const traceChanges = commonFuncForTracingChanges({
      initialFormData: conditionalFormData,
      originalResData: historyAndRecordObject,
      customResData: customHistoryAndRecordResData,
    });
    setIsValuesChanged(traceChanges);
  };

  const handleChangeForToggler = (value, setValue, keyName) => {
    setValue(value);
    formData.setFieldValue(keyName, value);
    const tab2Data = { ...tab2FormData, [keyName]: value };
    dispatch(setTab2FormData(tab2Data));

    let conditionalFormData = {};

    const formattedDatesInTab2Data = formatDatesByDateKeysArr(
      { ...tab2Data },
      ALL_DATE_RELATED_FIELDS_FOR_CREATE_ORDER
    );

    if (value) {
      conditionalFormData = { ...formattedDatesInTab2Data };
    } else {
      conditionalFormData = commonConditionalValueFunc({
        ...formattedDatesInTab2Data,
      });
    }

    const historyAndRecordObject = singleMedicalHistoryAndRecordObj();

    const traceChanges = commonFuncForTracingChanges({
      initialFormData: conditionalFormData,
      originalResData: historyAndRecordObject,
      customResData: customHistoryAndRecordResData,
    });
    setIsValuesChanged(traceChanges);
  };

  const handleChangeForRefPhysician = (e) => {
    const value = e.target.checked;
    setRefPhysicianChecked(e.target.checked);
    const tab2Data = { ...tab2FormData, isReferringPhysician: value };
    dispatch(setTab2FormData(tab2Data));

    const traceChanges =
      medicalHistoryOnly?.isReferringPhysician !== e.target.checked;
    setIsValuesChanged(traceChanges);

    if (
      e.target.checked === false &&
      pcpNumberData?.npiNumber &&
      pcpNumberData?.npiNumber != referringProviderData?.npiNumber
    ) {
      formData.setFieldValue(
        CREATE_ORDER_FORM_KEY_NAMES.pcpNumber,
        pcpNumberData?.npiNumber
      );
      dispatch(setDisplayPcpNumberSuccessTick(true));
    } else if (
      e.target.checked === false &&
      pcpNumberData?.npiNumber &&
      pcpNumberData?.npiNumber == referringProviderData?.npiNumber
    ) {
      dispatch(setValidatePCPNumberDataToNull());
      dispatch(setDisplayPcpNumberSuccessTick(false));
      formData.setFieldValue(CREATE_ORDER_FORM_KEY_NAMES.pcpNumber, null);
    }
  };

  const handleProviderInputChange = (
    value,
    setStateFunc,
    ProviderResStatus,
    providerSuccessTick,
    providerData,
    dispatchActionForSuccessTick
  ) => {
    if (value?.toString()?.trim()?.length === ALL_PROVIDERS_MAX_LENGTH_COUNT) {
      setStateFunc(false);
    } else {
      setStateFunc(true);
    }

    if (
      ProviderResStatus &&
      providerSuccessTick &&
      providerData?.npiNumber != value
    ) {
      dispatch(dispatchActionForSuccessTick(false));
    } else if (
      ProviderResStatus &&
      !providerSuccessTick &&
      providerData?.npiNumber == value
    ) {
      dispatch(dispatchActionForSuccessTick(true));
    }
  };

  const validateOrderingProvider = () => {
    const npiNumber = formData.getFieldValue(
      CREATE_ORDER_FORM_KEY_NAMES.orderingProvider
    );
    if (!validateNPINumberLength(npiNumber)) {
      message.error(NPI_NUMBER_VALIDATION_ERROR_MESSAGE);
      return;
    }
    dispatch(
      getValidateOrderingProvider({ npiNumber, event: 'atCreate' })
    ).then((res) => {
      if (!res?.payload?.status) {
        message.error(res?.payload?.message);
      }
    });
  };

  const validateReferringProvider = () => {
    const npiNumber = formData.getFieldValue(
      CREATE_ORDER_FORM_KEY_NAMES.referringProvider
    );
    const pcpNPINumber = formData.getFieldValue(
      CREATE_ORDER_FORM_KEY_NAMES.pcpNumber
    );

    if (!validateNPINumberLength(npiNumber)) {
      message.error(NPI_NUMBER_VALIDATION_ERROR_MESSAGE);
      return;
    }

    if (refPhysicianChecked) {
      dispatch(
        getValidateReferringProvider({ npiNumber, event: 'atCreate' })
      ).then((res) => {
        if (!res?.payload?.status) {
          message.error(res?.payload?.message);
        }
      });
    } else {
      commonReferringAndPCPFunc(
        npiNumber,
        pcpNPINumber,
        pcpNumberData,
        PCP_AND_REFERRING_PROVIDER_NOT_SAME_WARNING,
        FIRST_VALIDATE_PCP_NUMBER,
        dispatch,
        getValidateReferringProvider
      );
    }
  };

  const validatePCPNumber = () => {
    const npiNumber = formData.getFieldValue(
      CREATE_ORDER_FORM_KEY_NAMES.pcpNumber
    );
    const referringNPINumber = formData.getFieldValue(
      CREATE_ORDER_FORM_KEY_NAMES.referringProvider
    );

    if (!validateNPINumberLength(npiNumber)) {
      message.error(NPI_NUMBER_VALIDATION_ERROR_MESSAGE);
      return;
    }

    commonReferringAndPCPFunc(
      npiNumber,
      referringNPINumber,
      referringProviderData,
      PCP_AND_REFERRING_PROVIDER_NOT_SAME_WARNING,
      FIRST_VALIDATE_REFERRING_NUMBER,
      dispatch,
      getValidatePCPNumber
    );
  };

  const customRequest = (file, category) => {
    setLoading(true);
    const matchingCategory = MEDICAL_AND_INSURANCE_FILE_UPLOAD_CATEGORIES.find(
      (cat) => cat.value === category
    );
    if (
      matchingCategory &&
      fileLengthCheck(patientAllUploadedFilesData[matchingCategory.key])
    ) {
      dispatch(
        postUploadFile({
          file: file.file,
          type: category,
          patientId: patientId,
        })
      ).then((res) => {
        message[res?.payload?.status ? 'success' : 'error'](
          res?.payload?.message
        );
        setLoading(false);
      });
    } else {
      message.error(ERROR_MESSAGE_FOR_MAX_UPLOAD_DOCS);
      setLoading(false);
    }
  };

  const handleAllFileUploaded = () => {
    switch (true) {
      case radiologyStatus &&
        patientAllUploadedFilesData?.radiologyFiles?.length < 1:
        return SELECT_AT_LIST_RADIOLOGY_FILE;
      case pathologyStatus &&
        patientAllUploadedFilesData?.pathologyFiles?.length < 1:
        return SELECT_AT_LIST_PATHOLOGY_FILE;
      case labStatus && patientAllUploadedFilesData?.labStatusFiles?.length < 1:
        return SELECT_AT_LIST_LAB_FILE;
      case previousAuthorization &&
        patientAllUploadedFilesData?.prevAuthorizationFiles?.length < 1:
        return SELECT_AT_LIST_PREV_AUTH_FILE;
      default:
        return false;
    }
  };

  const setProviderValuesForSubmit = (data) => {
    data.orderingProvider = orderingSuccessTick
      ? data.orderingProvider?.toString()
      : null;

    data.referringProvider = referringSuccessTick
      ? data.referringProvider?.toString()
      : null;

    data.isReferringPhysician
      ? (data.pcpName = null)
      : (data.pcpName = pcpNumberSuccessTick ? data.pcpName?.toString() : null);

    return data;
  };

  const setPayloadForTab2DataFunc = (data) => {
    const historyPayload = filterObjectByKeys(
      data,
      MEDICAL_HISTORY_FIELDS_ONLY?.[orderType]
    );
    if (medicalHistoryId) {
      historyPayload.historyId = medicalHistoryId;
    }
    historyPayload.patientId = patientId;
    historyPayload.orderType = orderType;
    historyPayload.diagnosisId = diagnosisId
      ? diagnosisId
      : medicalHistoryOnly?.diagnosisId;

    const recordPayload = filterObjectByKeys(
      data,
      MEDICAL_RECORD__FIELDS_ONLY?.[orderType]
    );
    if (medicalRecordId) {
      recordPayload.recordId = medicalRecordId;
    }
    if (orderId) {
      historyPayload.orderId = orderId;
      recordPayload.orderId = orderId;
    }
    recordPayload.orderType = orderType;
    recordPayload.patientId = patientId;

    return { historyPayload, recordPayload };
    // Add here replaceNullToEmptyString in payload if required
  };

  const handleSubmitTab2Data = async (values) => {
    const isAllFileUploaded = handleAllFileUploaded();
    if (isAllFileUploaded) {
      message.error(isAllFileUploaded);
      return;
    }
    const payload = { ...tab2FormData, ...values };

    const dateFormattedpayload = formatDatesByDateKeysArr(
      payload,
      ALL_DATE_RELATED_FIELDS_FOR_CREATE_ORDER
    );

    const data = await setProviderValuesForSubmit({ ...dateFormattedpayload });

    const conditionalData = commonConditionalValueFunc({ ...data });
    const historyAndRecordObject = singleMedicalHistoryAndRecordObj();

    const traceChanges = commonFuncForTracingChanges({
      initialFormData: conditionalData,
      originalResData: historyAndRecordObject,
      customResData: customHistoryAndRecordResData,
    });

    const commonPayload = setPayloadForTab2DataFunc({ ...conditionalData });
    const { historyPayload, recordPayload } = commonPayload;

    const tab2Data = { ...tab2FormData };

    if (!orderingSuccessTick) {
      formData.setFieldValue(
        CREATE_ORDER_FORM_KEY_NAMES.orderingProvider,
        null
      );
      dispatch(setTab2FormData({ ...tab2Data, orderingProvider: null }));
    }
    if (!referringSuccessTick) {
      formData.setFieldValue(
        CREATE_ORDER_FORM_KEY_NAMES.referringProvider,
        null
      );
      dispatch(setTab2FormData({ ...tab2Data, referringProvider: null }));
    }

    if (
      createNewHistory ||
      traceChanges ||
      (Object.keys(medicalHistoryOnly)?.length === 0 &&
        Object.keys(medicalRecordOnly)?.length === 0)
    ) {
      try {
        const [medicalHistoryResponse, medicalRecordResponse] =
          await Promise.all([
            dispatch(postMedicalHistoryData(historyPayload)),
            dispatch(postMedicalRecordData(recordPayload)),
          ]);

        const medicalHistorySuccess = medicalHistoryResponse?.payload?.status;
        const medicalRecordSuccess = medicalRecordResponse?.payload?.status;

        if (medicalHistorySuccess && medicalRecordSuccess) {
          if (medicalHistoryResponse?.payload?.message.includes('Update')) {
            message.success(MEDICAL_HISTORY_AND_RECORD_UPDATED_MESSAGE);
          } else {
            message.success(MEDICAL_HISTORY_AND_RECORD_CREATED_MESSAGE);
          }
          dispatch(setPatientDemographicsTab(false));
          dispatch(setMedicalHistoryTab(false));
          dispatch(setInsuranceInfoTab(false));
          dispatch(setOrderDetailsTab(false));
          dispatch(setPateintDocsTab(false));
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
      dispatch(setInsuranceInfoTab(false));
      dispatch(setCurrentSelectedTab('insuranceInfo'));
    }
  };

  const saveOrderAsDraft = async () => {
    const isAllFileUploaded = handleAllFileUploaded();
    if (isAllFileUploaded) {
      return message.error(isAllFileUploaded);
    }
    setLoading(true);

    const payload = { ...tab2FormData };

    const dateFormattedpayload = formatDatesByDateKeysArr(
      payload,
      ALL_DATE_RELATED_FIELDS_FOR_CREATE_ORDER
    );

    const data = await setProviderValuesForSubmit({ ...dateFormattedpayload });

    const conditionalData = commonConditionalValueFunc({ ...data });
    const historyAndRecordObject = singleMedicalHistoryAndRecordObj();

    const traceChanges = commonFuncForTracingChanges({
      initialFormData: conditionalData,
      originalResData: historyAndRecordObject,
      customResData: customHistoryAndRecordResData,
    });

    const commonPayload = setPayloadForTab2DataFunc({ ...conditionalData });
    const { historyPayload, recordPayload } = commonPayload;

    let historyId;
    let recordId;
    const orderDetailsId = orderDetailsData?.id;

    if (
      createNewHistory ||
      traceChanges ||
      (Object.keys(medicalHistoryOnly)?.length === 0 &&
        Object.keys(medicalRecordOnly)?.length === 0)
    ) {
      const historyRes = await dispatch(postMedicalHistoryData(historyPayload));
      if (historyRes) {
        historyId = historyRes?.payload?.data?.id;
      }
      if (!historyRes?.payload?.status) {
        setLoading(false);
        return message.error(historyRes?.payload?.message);
      }
      const createdRecord = await dispatch(
        postMedicalRecordData(recordPayload)
      );
      if (createdRecord) {
        recordId = createdRecord?.payload?.data?.id;
      }
      if (!createdRecord?.payload?.status) {
        setLoading(false);
        return message.error(createdRecord?.payload?.message);
      }
    }

    let order;
    const finalPayload = {
      patientId,
      historyId: historyId ? historyId : medicalHistoryId,
      recordId: recordId ? recordId : medicalRecordId,
      insuranceId: insuranceInfoId ? insuranceInfoId : null,
      orderDetailsId: orderDetailsId ? orderDetailsId : null,
      uploadFiles: medicalUploadedFilesById,
      orderAuthDocuments: patientDocsFilesById,
      orderTypeId: filterOrderTypeId(),
    };
    if (orderId) {
      order = await dispatch(
        updateOrderData({ orderId, payload: finalPayload })
      );
    } else {
      finalPayload.caseId = CASE_ID;
      finalPayload.currentStatus = ORDER_STATUS.draft;
      order = await dispatch(orderSaveAsDraft(finalPayload));
    }

    if (order?.payload?.status) {
      dispatch(setTab1FormData({}));
      dispatch(resetCreateOrderDataBacktoInitialState());
      dispatch(resetSearchPatientData());
      dispatch(resetOrderStateToInitialState());
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
    dispatch(setTab1FormData({}));
    dispatch(resetSearchPatientData());
    dispatch(resetCreateOrderDataBacktoInitialState());
    dispatch(resetOrderStateToInitialState());
    dispatch(setTab2FormData({}));
    router.push('/order-management');
  };

  // This useEffect is for tracing if any value is changed from the original response
  // if changes are made will disable the other tabs
  useEffect(() => {
    if (isValuesChanged) {
      dispatch(setPatientDemographicsTab(true));
      dispatch(setInsuranceInfoTab(true));
      dispatch(setOrderDetailsTab(true));
      dispatch(setPateintDocsTab(true));
    } else if (!isValuesChanged) {
      if (searchResponse) {
        dispatch(setPatientDemographicsTab(false));
        dispatch(setOrderDetailsTab(false));
        dispatch(setPateintDocsTab(false));
      }
      dispatch(setInsuranceInfoTab(false));
    }
  }, [isValuesChanged]);

  useEffect(() => {
    setPcpNumberTick(pcpNumberSuccessTick);
    setOrderingTick(orderingSuccessTick);
    setReferringTick(referringSuccessTick);
  }, [pcpNumberSuccessTick, orderingSuccessTick, referringSuccessTick]);

  useEffect(() => {
    formData.validateFields({ validateOnly: true }).then(
      () => {
        if (
          orderingSuccessTick &&
          // referringSuccessTick &&
          orderType === CHEMO_ORDER_TYPE
        ) {
          checkForReferringPhysician(refPhysicianChecked);
        } else if (
          orderType === OFFICE_VISIT_ORDER_TYPE ||
          orderType === RADIATION_ORDER_TYPE
        ) {
          checkForReferringPhysician(refPhysicianChecked);
        } else {
          setSubmittable(false);
        }
      },
      (a) => {
        if (a?.errorFields?.length === 0) {
          return;
        }
        setSubmittable(false);
      }
    );
    const initialValues = formData.getFieldsValue();
    const payload = {
      ...tab2FormData,
      ...initialValues,
    };
    dispatch(setTab2FormData(payload));
  }, [
    formValues,
    orderingResStatus,
    referringResStatus,
    pcpNumberResStatus,
    refPhysicianChecked,
    patientAllUploadedFilesData,
    orderingTick,
    referringTick,
    patientSearchData,
    pcpNumberTick,
  ]);

  // This useEffect is for adding initial values in to the tab2FormData and to states
  // Run Only once when page is loaded for the very first time.
  useEffect(() => {
    if (
      medicalHistoryOnly &&
      medicalRecordOnly &&
      Object.keys(medicalHistoryOnly)?.length > 0 &&
      Object.keys(medicalRecordOnly)?.length > 0 &&
      Object.keys(tab2FormData)?.length === 0
    ) {
      const updatedMedicalHistoryData = filterObjectByKeys(
        medicalHistoryOnly,
        MEDICAL_HISTORY_FIELDS_ONLY?.[orderType]
      );
      const updatedMedicalRecordData = filterObjectByKeys(
        medicalRecordOnly,
        MEDICAL_RECORD__FIELDS_ONLY?.[orderType]
      );
      if (orderingResStatus) {
        dispatch(setDisplayorderingSuccessTick(true));
      }
      if (referringResStatus) {
        dispatch(setDisplayReferringSuccessTick(true));
      }
      if (pcpNumberResStatus) {
        dispatch(setDisplayPcpNumberSuccessTick(true));
      }
      const { referringProvider, pcpName } = medicalHistoryOnly;
      if (referringProvider && pcpName && referringProvider == pcpName) {
        updatedMedicalHistoryData.pcpName = null;
      }

      if (orderType === CHEMO_ORDER_TYPE) {
        updatedMedicalHistoryData.isReferringPhysician =
          updatedMedicalHistoryData?.isReferringPhysician ?? true;

        updatedMedicalHistoryData.chemotherapyOrdered =
          updatedMedicalHistoryData?.chemotherapyOrdered
            ? dayjs(updatedMedicalHistoryData?.chemotherapyOrdered)
            : null;
      }

      updatedMedicalHistoryData.dateOfVisit =
        updatedMedicalHistoryData?.dateOfVisit
          ? dayjs(updatedMedicalHistoryData?.dateOfVisit)
          : null;

      formData.setFieldsValue({
        ...updatedMedicalHistoryData,
        ...updatedMedicalRecordData,
      });
      const updatedValues = {
        ...tab2FormData,
        ...updatedMedicalHistoryData,
        ...updatedMedicalRecordData,
      };
      setChemoStatus(medicalHistoryOnly?.chemoTherapyStatus ?? false);
      setRefPhysicianChecked(medicalHistoryOnly?.isReferringPhysician ?? true);
      setRadiologyStatus(medicalRecordOnly?.isRadiologyStatus ?? false);
      setPathologyStatus(medicalRecordOnly?.isPathologyStatus ?? false);
      setLabStatus(medicalRecordOnly?.isLabStatus ?? false);
      setPreviousAuthorization(
        medicalRecordOnly?.isPreviousAuthorizationStatus ?? false
      );
      dispatch(setTab2FormData(updatedValues));
      dispatch(
        setIsTab2DataChanges({
          ...updatedMedicalHistoryData,
          ...updatedMedicalRecordData,
        })
      );
    } else if (
      medicalHistoryOnly &&
      medicalRecordOnly &&
      Object.keys(medicalHistoryOnly)?.length === 0 &&
      Object.keys(medicalRecordOnly)?.length === 0
    ) {
      const makeEmptyValueObj = {};
      const historyAndRecordArr = [
        ...MEDICAL_HISTORY_FIELDS_ONLY?.[orderType],
        ...MEDICAL_RECORD__FIELDS_ONLY?.[orderType],
      ];
      historyAndRecordArr?.forEach((key) => {
        makeEmptyValueObj[key] = '';
      });
      setCustomHistoryAndRecordResData(makeEmptyValueObj);
      if (orderType === CHEMO_ORDER_TYPE) {
        const payload = {
          chemoTherapyStatus: false,
          isReferringPhysician: true,
          isRadiologyStatus: false,
          isPathologyStatus: false,
          isLabStatus: false,
          isPreviousAuthorizationStatus: false,
        };
        dispatch(setTab2FormData({ ...tab2FormData, ...payload }));
      }
    }
  }, [patientSearchData, searchResponse]);

  useEffect(() => {
    if (diagnosisSearchedValue?.trim()?.length > 2) {
      dispatch(getDiagnosisDropDownValues(diagnosisSearchedValue));
    }
  }, [diagnosisSearchedValue]);

  return (
    <div className='create-order-medical-history-tab-2-container'>
      {loading && <CustomSpinner />}
      <Col>
        <h3 className='co-medical-history-order-type'>{orderType}</h3>
      </Col>
      <Form
        form={formData}
        name='create-order-medecal-history'
        layout='vertical'
        autoComplete='off'
        preserve={true}
        onFinish={handleSubmitTab2Data}
        onValuesChange={onValuesChange}
        initialValues={tab2FormData}
      >
        <Row span={24} gutter={24}>
          <Col
            xs={{ span: 24 }}
            sm={{ span: 12 }}
            md={{ span: 12 }}
            lg={{ span: 8 }}
          >
            <Form.Item
              label='Diagnosis'
              name={CREATE_ORDER_FORM_KEY_NAMES.diagnosis}
              rules={CREATE_ORDER_FORM_FIELD_RULES.diagnosis}
            >
              <Select
                size='large'
                placeholder='Search & Select Diagnosis Status'
                showSearch
                value={diagnosisSearchedValue}
                defaultActiveFirstOption={false}
                filterOption={false}
                suffixIcon={null}
                onSearch={handleSearchValueForDiagnosis}
                onChange={onDropDownValueChange}
                notFoundContent={null}
                options={diagnosisDropDownValues}
                dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
                optionRender={renderOption}
              />
            </Form.Item>
          </Col>

          {(orderType === OFFICE_VISIT_ORDER_TYPE ||
            orderType === RADIATION_ORDER_TYPE) && (
            <Form.Item
              label='Date Of Visit'
              name={CREATE_ORDER_FORM_KEY_NAMES.dateOfVisit}
              rules={CREATE_ORDER_FORM_FIELD_RULES.dateOfVisit}
            >
              <DatePicker
                className='co-tab1-form-item-width-manually'
                size='large'
                placeholder='Date Of Visit'
                format={DATE_FORMAT_STARTING_FROM_MONTH}
                // disabledDate={handleDisabledDate}
              />
            </Form.Item>
          )}

          {orderType === CHEMO_ORDER_TYPE && (
            <>
              <Col
                xs={{ span: 24 }}
                sm={{ span: 12 }}
                md={{ span: 12 }}
                lg={{ span: 8 }}
              >
                <Form.Item label='Chemotherapy Status'>
                  <Switch
                    checked={chemoStatus}
                    onChange={(value) =>
                      handleChangeForToggler(
                        value,
                        setChemoStatus,
                        CREATE_ORDER_FORM_KEY_NAMES.chemoStatus
                      )
                    }
                  />
                  <div>
                    Received Prior Treatment? -{' '}
                    <span className='chemo-font-weight-bold'>
                      {chemoStatus ? YES : NO}
                    </span>
                  </div>
                </Form.Item>
              </Col>
              <Col
                xs={{ span: 24 }}
                sm={{ span: 12 }}
                md={{ span: 12 }}
                lg={{ span: 8 }}
              >
                {chemoStatus && (
                  <Form.Item
                    label='Chemotherapy Ordered'
                    name={CREATE_ORDER_FORM_KEY_NAMES.chemotherapyOrdered}
                    rules={CREATE_ORDER_FORM_FIELD_RULES.chemotherapyOrdered}
                  >
                    <DatePicker
                      className='co-tab1-form-item-width-manually'
                      size='large'
                      placeholder='Chemotherapy Ordered'
                      format={DATE_FORMAT_STARTING_FROM_MONTH}
                      // disabledDate={handleDisabledDate}
                    />
                  </Form.Item>
                )}
              </Col>
            </>
          )}
        </Row>

        <Row span={24} gutter={24}>
          <Col
            className='co-tab-2-ordering-container'
            xs={{ span: 24 }}
            sm={{ span: 12 }}
            md={{ span: 12 }}
            lg={{ span: 8 }}
          >
            <Form.Item
              label={
                <div className='tab2-ordering-provider-lable-conatiner'>
                  <label>Ordering Provider</label>
                </div>
              }
              name={CREATE_ORDER_FORM_KEY_NAMES.orderingProvider}
              rules={
                orderType === CHEMO_ORDER_TYPE
                  ? CREATE_ORDER_FORM_FIELD_RULES.orderingProvider
                  : CREATE_ORDER_FORM_FIELD_RULES.orderingProviderOptional
              }
            >
              <InputNumber
                className='co-tab-2-medical-history-number-input'
                size='large'
                placeholder='Enter NPI Number'
                onChange={(value) =>
                  handleProviderInputChange(
                    value,
                    setDisableOrderingBtn,
                    orderingResStatus,
                    orderingSuccessTick,
                    orderingProviderData,
                    setDisplayorderingSuccessTick
                  )
                }
                maxLength={ALL_PROVIDERS_MAX_LENGTH_COUNT}
              />
            </Form.Item>
            {!orderingSuccessTick && (
              <Col>
                <Button
                  size='large'
                  disabled={disableOrderingBtn}
                  className='co-tab-2-ordering-btn'
                  onClick={validateOrderingProvider}
                >
                  Validate
                </Button>
              </Col>
            )}
            {orderingSuccessTick && (
              <Form.Item
                label={
                  <div className='tab2-ordering-provider-lable-conatiner'>
                    <label>Ordering Provider Name</label>
                    <FiInfo
                      className='info-icon-for-displaying-info'
                      onClick={() => dispatch(setDisplayOrderingModal(true))}
                    />
                  </div>
                }
                validateStatus={orderingSuccessTick && SMALL_SUCCESS}
                hasFeedback
              >
                <Input
                  className='co-tab-2-medical-history-number-input'
                  size='large'
                  placeholder='Enter NPI Number'
                  value={
                    orderingProviderData && orderingProviderData?.first_name
                      ? `${orderingProviderData?.first_name} ${orderingProviderData?.last_name}`
                      : ''
                  }
                  readOnly
                />
              </Form.Item>
            )}
            {orderType === CHEMO_ORDER_TYPE && (
              <Form.Item label='Referring Physician Is PCP'>
                <Checkbox
                  checked={refPhysicianChecked}
                  onChange={handleChangeForRefPhysician}
                />
              </Form.Item>
            )}
            {isLoadingOrdering && <CustomSpinner />}
          </Col>
          {orderType === CHEMO_ORDER_TYPE && (
            <Col
              className='co-tab-2-referring-container'
              xs={{ span: 24 }}
              sm={{ span: 12 }}
              md={{ span: 12 }}
              lg={{ span: 8 }}
            >
              <Form.Item
                label={
                  <div className='tab2-ordering-provider-lable-conatiner'>
                    <label>Referring Provider</label>
                  </div>
                }
                name={CREATE_ORDER_FORM_KEY_NAMES.referringProvider}
                rules={
                  orderType === CHEMO_ORDER_TYPE
                    ? CREATE_ORDER_FORM_FIELD_RULES.referringProvider
                    : CREATE_ORDER_FORM_FIELD_RULES.referringProviderOptional
                }
              >
                <InputNumber
                  className='co-tab-2-medical-history-number-input'
                  size='large'
                  placeholder='Enter NPI Number'
                  onChange={(value) =>
                    handleProviderInputChange(
                      value,
                      setDisableProviderBtn,
                      referringResStatus,
                      referringSuccessTick,
                      referringProviderData,
                      setDisplayReferringSuccessTick
                    )
                  }
                  maxLength={ALL_PROVIDERS_MAX_LENGTH_COUNT}
                />
              </Form.Item>
              {!referringSuccessTick && (
                <Col>
                  <Button
                    size='large'
                    disabled={disableProviderBtn}
                    className='co-tab-2-ordering-btn'
                    onClick={validateReferringProvider}
                  >
                    Validate
                  </Button>
                </Col>
              )}
              {referringSuccessTick && (
                <Form.Item
                  label={
                    <div className='tab2-ordering-provider-lable-conatiner'>
                      <label>Referring Provider Name </label>
                      <FiInfo
                        className='info-icon-for-displaying-info'
                        onClick={() => dispatch(setDisplayReferringModal(true))}
                      />
                    </div>
                  }
                  validateStatus={referringSuccessTick && SMALL_SUCCESS}
                  hasFeedback
                >
                  <Input
                    className='co-tab-2-medical-history-number-input'
                    size='large'
                    placeholder='Enter NPI Number'
                    value={
                      referringProviderData && referringProviderData?.first_name
                        ? `${referringProviderData?.first_name} ${referringProviderData?.last_name}`
                        : ''
                    }
                    readOnly
                  />
                </Form.Item>
              )}
              <Form.Item
                label='Date Of Visit'
                name={CREATE_ORDER_FORM_KEY_NAMES.dateOfVisit}
                rules={CREATE_ORDER_FORM_FIELD_RULES.dateOfVisit}
              >
                <DatePicker
                  className='co-tab1-form-item-width-manually'
                  size='large'
                  placeholder='Date Of Visit'
                  format={DATE_FORMAT_STARTING_FROM_MONTH}
                  // disabledDate={handleDisabledDate}
                />
              </Form.Item>
              {isLoadingReferring && <CustomSpinner />}
            </Col>
          )}

          {!refPhysicianChecked && orderType === CHEMO_ORDER_TYPE && (
            <Col
              xs={{ span: 24 }}
              sm={{ span: 12 }}
              md={{ span: 12 }}
              lg={{ span: 8 }}
            >
              <Form.Item
                label={
                  <div className='tab2-ordering-provider-lable-conatiner'>
                    <label>PCP Provider</label>
                  </div>
                }
                name={CREATE_ORDER_FORM_KEY_NAMES.pcpNumber}
                rules={CREATE_ORDER_FORM_FIELD_RULES.pcpNumber}
              >
                <InputNumber
                  className='co-tab-2-medical-history-number-input'
                  size='large'
                  placeholder='Enter PCP Number'
                  onChange={(value) =>
                    handleProviderInputChange(
                      value,
                      setDisbalePCPBtn,
                      pcpNumberResStatus,
                      pcpNumberSuccessTick,
                      pcpNumberData,
                      setDisplayPcpNumberSuccessTick
                    )
                  }
                  maxLength={ALL_PROVIDERS_MAX_LENGTH_COUNT}
                />
              </Form.Item>
              {!pcpNumberSuccessTick && (
                <Col>
                  <Button
                    size='large'
                    disabled={disbalePCPBtn}
                    className='co-tab-2-ordering-btn'
                    onClick={validatePCPNumber}
                  >
                    Validate
                  </Button>
                </Col>
              )}
              {pcpNumberSuccessTick && (
                <Form.Item
                  label={
                    <div className='tab2-ordering-provider-lable-conatiner'>
                      <label>PCP Provider Name</label>
                      <FiInfo
                        className='info-icon-for-displaying-info'
                        onClick={() => dispatch(setDisplayPCPNumberModal(true))}
                      />
                    </div>
                  }
                  validateStatus={pcpNumberSuccessTick && SMALL_SUCCESS}
                  hasFeedback
                >
                  <Input
                    className='co-tab-2-medical-history-number-input'
                    size='large'
                    placeholder='Enter NPI Number'
                    value={
                      pcpNumberData && pcpNumberData?.first_name
                        ? `${pcpNumberData?.first_name} ${pcpNumberData?.last_name}`
                        : ''
                    }
                    readOnly
                  />
                </Form.Item>
              )}
              {loadingPcpNumber && <CustomSpinner />}
            </Col>
          )}
        </Row>

        {orderType === CHEMO_ORDER_TYPE && (
          <Col className='tab-2-child-component-container-second'>
            <Divider className='tab-2-child-component-container' />
            <Row span={24} gutter={24}>
              <Col
                xs={{ span: 24 }}
                sm={{ span: 12 }}
                md={{ span: 12 }}
                lg={{ span: 8 }}
              >
                <Form.Item label='Radiology Status'>
                  <Switch
                    checked={
                      radiologyStatus ||
                      patientAllUploadedFilesData?.radiologyFiles?.length > 0
                    }
                    onChange={(value) =>
                      handleChangeForToggler(
                        value,
                        setRadiologyStatus,
                        CREATE_ORDER_FORM_KEY_NAMES.radiologyStatus
                      )
                    }
                    disabled={
                      patientAllUploadedFilesData?.radiologyFiles?.length > 0
                    }
                  />
                </Form.Item>
              </Col>

              {(radiologyStatus ||
                patientAllUploadedFilesData?.radiologyFiles?.length > 0) && (
                <Col
                  xs={{ span: 24 }}
                  sm={{ span: 12 }}
                  md={{ span: 12 }}
                  lg={{ span: 8 }}
                >
                  <Form.Item
                    label='Radiology Facility'
                    name={CREATE_ORDER_FORM_KEY_NAMES.radiologyFacility}
                  >
                    <Input size='large' placeholder='Radiology Facility' />
                  </Form.Item>
                </Col>
              )}

              {(radiologyStatus ||
                patientAllUploadedFilesData?.radiologyFiles?.length > 0) && (
                <Col
                  xs={{ span: 24 }}
                  sm={{ span: 12 }}
                  md={{ span: 12 }}
                  lg={{ span: 8 }}
                >
                  <Form.Item label='Radiology Status File'>
                    <Upload
                      beforeUpload={beforeFileUpload}
                      customRequest={(file) =>
                        customRequest(
                          file,
                          DOCUMENTS_UPLOAD_IN_RADIOLOGY_CATEGORY
                        )
                      }
                      listType='picture'
                      maxCount={MAX_UPLOAD_DOCUMENTS_PER_CATEGORY}
                      showUploadList={false}
                      disabled={
                        patientAllUploadedFilesData?.radiologyFiles?.length ===
                        MAX_UPLOAD_DOCUMENTS_PER_CATEGORY
                      }
                    >
                      <Button
                        size='large'
                        className='co-tab-2-upload-btn'
                        icon={<FiUpload />}
                        disabled={
                          patientAllUploadedFilesData?.radiologyFiles
                            ?.length === MAX_UPLOAD_DOCUMENTS_PER_CATEGORY
                        }
                      >
                        Upload File
                      </Button>
                    </Upload>
                    <DisplayFileSize className='upload-m-fs-10' />
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
                  className='co-tab-2-upload-image-container-at-radiology'
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
                <Form.Item label='Pathology Status'>
                  <Switch
                    checked={
                      pathologyStatus ||
                      patientAllUploadedFilesData?.pathologyFiles?.length > 0
                    }
                    onChange={(value) =>
                      handleChangeForToggler(
                        value,
                        setPathologyStatus,
                        CREATE_ORDER_FORM_KEY_NAMES.pathologyStatus
                      )
                    }
                    disabled={
                      patientAllUploadedFilesData?.pathologyFiles?.length > 0
                    }
                  />
                </Form.Item>
              </Col>

              {(pathologyStatus ||
                patientAllUploadedFilesData?.pathologyFiles?.length > 0) && (
                <Col
                  xs={{ span: 24 }}
                  sm={{ span: 12 }}
                  md={{ span: 12 }}
                  lg={{ span: 8 }}
                >
                  <Form.Item
                    label='Pathology Facility'
                    name={CREATE_ORDER_FORM_KEY_NAMES.pathologyFacility}
                  >
                    <Input size='large' placeholder='Pathology Facility' />
                  </Form.Item>
                </Col>
              )}

              {(pathologyStatus ||
                patientAllUploadedFilesData?.pathologyFiles?.length > 0) && (
                <Col
                  xs={{ span: 24 }}
                  sm={{ span: 12 }}
                  md={{ span: 12 }}
                  lg={{ span: 8 }}
                >
                  <Form.Item label='Pathology Status File'>
                    <Upload
                      beforeUpload={beforeFileUpload}
                      customRequest={(file) =>
                        customRequest(
                          file,
                          DOCUMENTS_UPLOAD_IN_PATHOLOGY_CATEGORY
                        )
                      }
                      listType='picture'
                      maxCount={MAX_UPLOAD_DOCUMENTS_PER_CATEGORY}
                      showUploadList={false}
                      disabled={
                        patientAllUploadedFilesData?.pathologyFiles?.length ===
                        MAX_UPLOAD_DOCUMENTS_PER_CATEGORY
                      }
                    >
                      <Button
                        size='large'
                        className='co-tab-2-upload-btn'
                        icon={<FiUpload />}
                        disabled={
                          patientAllUploadedFilesData?.pathologyFiles
                            ?.length === MAX_UPLOAD_DOCUMENTS_PER_CATEGORY
                        }
                      >
                        Upload File
                      </Button>
                    </Upload>
                    <DisplayFileSize className='upload-m-fs-10' />
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
                  className='co-tab-2-upload-image-container-at-radiology'
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
                <Form.Item label='Lab Status'>
                  <Switch
                    checked={
                      labStatus ||
                      patientAllUploadedFilesData?.labStatusFiles?.length > 0
                    }
                    onChange={(value) =>
                      handleChangeForToggler(
                        value,
                        setLabStatus,
                        CREATE_ORDER_FORM_KEY_NAMES.labStatus
                      )
                    }
                    disabled={
                      patientAllUploadedFilesData?.labStatusFiles?.length > 0
                    }
                  />
                </Form.Item>
              </Col>

              {(labStatus ||
                patientAllUploadedFilesData?.labStatusFiles?.length > 0) && (
                <Col
                  xs={{ span: 24 }}
                  sm={{ span: 12 }}
                  md={{ span: 12 }}
                  lg={{ span: 8 }}
                >
                  <Form.Item
                    label='Lab Facility'
                    name={CREATE_ORDER_FORM_KEY_NAMES.labFacility}
                  >
                    <Input size='large' placeholder='Lab Facility' />
                  </Form.Item>
                </Col>
              )}

              {(labStatus ||
                patientAllUploadedFilesData?.labStatusFiles?.length > 0) && (
                <Col
                  xs={{ span: 24 }}
                  sm={{ span: 12 }}
                  md={{ span: 12 }}
                  lg={{ span: 8 }}
                >
                  <Form.Item label='Lab Status File'>
                    <Upload
                      beforeUpload={beforeFileUpload}
                      customRequest={(file) =>
                        customRequest(
                          file,
                          DOCUMENTS_UPLOAD_IN_LAB_STATUS_CATEGORY
                        )
                      }
                      listType='picture'
                      maxCount={MAX_UPLOAD_DOCUMENTS_PER_CATEGORY}
                      showUploadList={false}
                      disabled={
                        patientAllUploadedFilesData?.labStatusFiles?.length ===
                        MAX_UPLOAD_DOCUMENTS_PER_CATEGORY
                      }
                    >
                      <Button
                        size='large'
                        className='co-tab-2-upload-btn'
                        icon={<FiUpload />}
                        disabled={
                          patientAllUploadedFilesData?.labStatusFiles
                            ?.length === MAX_UPLOAD_DOCUMENTS_PER_CATEGORY
                        }
                      >
                        Upload File
                      </Button>
                    </Upload>
                    <DisplayFileSize className='upload-m-fs-10' />
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
                  className='co-tab-2-upload-image-container-at-radiology'
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
                <Form.Item label='Previous Authorization'>
                  <Switch
                    checked={
                      previousAuthorization ||
                      patientAllUploadedFilesData?.prevAuthorizationFiles
                        ?.length > 0
                    }
                    onChange={(value) =>
                      handleChangeForToggler(
                        value,
                        setPreviousAuthorization,
                        CREATE_ORDER_FORM_KEY_NAMES.prevAuthorization
                      )
                    }
                    disabled={
                      patientAllUploadedFilesData?.prevAuthorizationFiles
                        ?.length > 0
                    }
                  />
                </Form.Item>
              </Col>

              {(previousAuthorization ||
                patientAllUploadedFilesData?.prevAuthorizationFiles?.length >
                  0) && (
                <Col
                  xs={{ span: 24 }}
                  sm={{ span: 12 }}
                  md={{ span: 12 }}
                  lg={{ span: 12 }}
                >
                  <Form.Item label='Previous Authorization File'>
                    <Upload
                      beforeUpload={beforeFileUpload}
                      customRequest={(file) =>
                        customRequest(
                          file,
                          DOCUMENTS_UPLOAD_IN_PREV_AUTH_CATEGORY
                        )
                      }
                      listType='picture'
                      maxCount={MAX_UPLOAD_DOCUMENTS_PER_CATEGORY}
                      showUploadList={false}
                      disabled={
                        patientAllUploadedFilesData?.prevAuthorizationFiles
                          ?.length === MAX_UPLOAD_DOCUMENTS_PER_CATEGORY
                      }
                    >
                      <Button
                        size='large'
                        className='co-tab-2-upload-btn'
                        icon={<FiUpload />}
                        disabled={
                          patientAllUploadedFilesData?.prevAuthorizationFiles
                            ?.length === MAX_UPLOAD_DOCUMENTS_PER_CATEGORY
                        }
                      >
                        Upload File
                      </Button>
                    </Upload>
                    <DisplayFileSize className='upload-m-fs-10' />
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
                    className='co-tab-2-upload-image-container-at-radiology'
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
                <Form.Item label='Single Medical Release Form'>
                  <Upload
                    beforeUpload={beforeFileUpload}
                    customRequest={(file) =>
                      customRequest(
                        file,
                        DOCUMENTS_UPLOAD_IN_MEDICAL_RELEASE_CATEGORY
                      )
                    }
                    listType='picture'
                    maxCount={MAX_UPLOAD_DOCUMENTS_PER_CATEGORY}
                    showUploadList={false}
                    disabled={
                      patientAllUploadedFilesData?.medicalReleaseFiles
                        ?.length === MAX_UPLOAD_DOCUMENTS_PER_CATEGORY
                    }
                  >
                    <Button
                      size='large'
                      className='co-tab-2-upload-btn'
                      icon={<FiUpload />}
                      disabled={
                        patientAllUploadedFilesData?.medicalReleaseFiles
                          ?.length === MAX_UPLOAD_DOCUMENTS_PER_CATEGORY
                      }
                    >
                      Upload File
                    </Button>
                  </Upload>
                  <DisplayFileSize className='upload-m-fs-10' />
                </Form.Item>
              </Col>
            </Row>
            <Row span={24} gutter={24}>
              {patientAllUploadedFilesData?.medicalReleaseFiles?.map((elem) => (
                <Col
                  xs={{ span: 24 }}
                  sm={{ span: 12 }}
                  md={{ span: 12 }}
                  lg={{ span: 8 }}
                  className='co-tab-2-upload-image-container-at-radiology'
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
        )}

        <Form.Item>
          <Row className='co-all-tabs-btn-container'>
            <Col>
              <Button
                className='co-all-tabs-cancel-btn'
                size='large'
                onClick={() => showModal(ORDER_STATUS.cancel)}
              >
                Cancel
              </Button>
            </Col>

            <Col>
              <Button
                className='co-all-tabs-save-as-draft-btn'
                size='large'
                disabled={!submittable}
                onClick={() => showModal(ORDER_STATUS.draft)}
              >
                Save As Draft
              </Button>
            </Col>

            <Col>
              <Button
                className='co-all-tabs-next-btn'
                size='large'
                htmlType='submit'
                disabled={!submittable}
              >
                Next
              </Button>
            </Col>
          </Row>
        </Form.Item>
      </Form>

      {/* Provider Data Modal Start from Here */}

      {/* Ordering Provider Modal Start Here */}
      <ProviderDetailsModal
        dataObj={orderingProviderData}
        isSuccessTick={orderingSuccessTick}
        providerType={MEDICAL_HISTORY_PROVIDER_TYPES.orderingProvider}
        shouldDisplayModal={displayOrderingModal}
      />

      {/* Referring Provider Modal Start Here */}
      <ProviderDetailsModal
        dataObj={referringProviderData}
        isSuccessTick={referringSuccessTick}
        providerType={MEDICAL_HISTORY_PROVIDER_TYPES.referringProvider}
        shouldDisplayModal={displayReferringModal}
      />

      {/* PCP Number Modal Start Here */}
      <ProviderDetailsModal
        dataObj={pcpNumberData}
        isSuccessTick={pcpNumberSuccessTick}
        providerType={MEDICAL_HISTORY_PROVIDER_TYPES.pcpName}
        shouldDisplayModal={displayPCPNumberModal}
      />

      <OrderModal
        title={
          isDraftModal ? (
            <AiOutlineUnorderedList size={40} color='grey' />
          ) : (
            <AiFillExclamationCircle color='red' size={45} />
          )
        }
        open={open}
        handleOk={handleOk}
        confirmLoading={confirmLoading}
        handleCancel={() => setOpen(false)}
        modalText={modalText}
        okText={ORDER_MODAL_OK_TEXT}
        cancelText={ORDER_MODAL_CANCEL_TEXT}
      />
    </div>
  );
};

export default MedicalHIstory;
