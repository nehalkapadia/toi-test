import React, { useEffect, useState } from 'react';
import '../../../styles/orders/createOrder/insuranceInfo.css';
import '../../../styles/orders/createOrder.css';
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  Switch,
  Upload,
  message,
} from 'antd';
import {
  ARE_YOU_SURE_WANT_DRAFT_ORDER,
  ARE_YOU_SURE_WANT_TO_CANCEL_ORDER,
  CASE_ID,
  CREATE_ORDER_FORM_FIELD_RULES,
  CREATE_ORDER_FORM_KEY_NAMES,
  DATE_FORMAT_STARTING_FROM_MONTH,
  DATE_FORMAT_STARTING_FROM_YEAR,
  MEDICARE_CONDITIONAL_VALIDATION,
  ORDER_MODAL_CANCEL_TEXT,
  ORDER_MODAL_OK_TEXT,
  ORDER_STATUS,
  MEDICAL_AND_INSURANCE_FILE_UPLOAD_CATEGORIES,
  DOCUMENTS_UPLOAD_IN_INSURANCE_COPY_CATEGORY,
  DOCUMENTS_UPLOAD_IN_SECONDARY_INSURANCE_CATEGORY,
  ERROR_MESSAGE_FOR_MAX_UPLOAD_DOCS,
  MAX_UPLOAD_DOCUMENTS_PER_CATEGORY,
  SUCCESS_TEXT_ONLY,
  ERROR_TEXT_ONLY,
  SELECT_AT_LIST_INSURANCE_CARD_FILE,
  SELECT_AT_LIST_SECONDARY_INSURANCE_FILE,
  INSURANCE_INFO_ALL_FIELDS_ARRAY,
  ALL_DATE_RELATED_FIELDS_FOR_CREATE_ORDER,
  PLEASE_FILL_MEDICAL_HISTORY_AND_RECORD_TAB,
  DEFAULT_ORDER_TYPE,
  HEALTH_PLAN_DEFAULT_VALUE,
  SECONDARY_DATES_OBJECT_ONLY,
  YES,
  NO,
} from '@/utils/constant.util';
import { FiUpload } from 'react-icons/fi';
import {
  INSURANCE_INFO_HEALTH_PLAN_OPTIONS,
  INSURANCE_INFO_LOB_OPTIONS,
} from '@/utils/options';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';

import {
  resetCreateOrderDataBacktoInitialState,
  setCurrentSelectedTab,
  setInsuranceInfoDateValues,
  setInsuranceInfoTab,
  setMedicalHistoryTab,
  setOrderDetailsTab,
  setPateintDocsTab,
  setPatientDemographicsTab,
  setTab3FormData,
} from '@/store/createOrderFormSlice';
import {
  postInsuranceInfoData,
  orderSaveAsDraft,
  postUploadFile,
  updateOrderData,
  setTab1FormData,
  setInsuranceInfoCreated,
  resetSearchPatientData,
  resetOrderStateToInitialState,
} from '@/store/orderSlice';
import { useRouter } from 'next/router';
import OrderModal from './OrderModal';
import {
  AiFillExclamationCircle,
  AiOutlineUnorderedList,
} from 'react-icons/ai';

import UploadedImageContainer from './UploadedImageContainer';
import {
  beforeFileUpload,
  commonFuncForTracingChanges,
  fileLengthCheck,
  filterObjectByKeys,
  formatDatesByDateKeysArr,
} from '@/utils/commonFunctions';
import DisplayFileSize from './DisplayFileSize';
import CustomSpinner from '@/components/CustomSpinner';

const InsuranceInfo = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { orderId, type: orderType } = router.query;

  const searchResponse = useSelector(
    (state) => state.allOrdersData.patientSearchResponse
  );
  const patientId = useSelector((state) => state.allOrdersData.patientId);

  const medicalHistoryOnly =
    useSelector((state) => state.allOrdersData.medicalHistoryOnly) || {};

  const medicalRecordOnly =
    useSelector((state) => state.allOrdersData.medicalRecordOnly) || {};

  const insuranceInfoData =
    useSelector((state) => state.allOrdersData.insuranceInfoData) || {};

  const insuranceInfoId = useSelector(
    (state) => state.allOrdersData.insuranceInfoId
  );

  const createNewInsuranceInfo = useSelector(
    (state) => state.allOrdersData.createNewInsuranceInfo
  );

  // Documents for post on Save As Draft req made
  const medicalUploadedFilesById = useSelector(
    (state) => state.allOrdersData.medicalUploadedFilesById
  );
  const patientDocsFilesById = useSelector(
    (state) => state.allOrdersData.patientDocsFilesById
  );

  // Handling Internal State for FormData
  const tab3FormData = useSelector(
    (state) => state.createOrderTabs.tab3FormData
  );
  const insuranceInfoDateValues =
    useSelector((state) => state.createOrderTabs.insuranceInfoDateValues) || {};

  // Handling Documents Uploads state
  const patientAllUploadedFilesData = useSelector(
    (state) => state.allOrdersData.patientAllUploadedFilesData
  );

  const orderTypeList = useSelector(
    (state) => state.allOrdersData.orderTypeList
  );

  const orderDetailsData =
    useSelector((state) => state.allOrdersData.orderDetailsData) || {};

  const [formData] = Form.useForm();
  const formValues = Form.useWatch([], formData);
  const [submittable, setSubmittable] = useState(false);
  const [selectedLoB, setSelectedLoB] = useState(tab3FormData?.lob || '');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState(ARE_YOU_SURE_WANT_TO_CANCEL_ORDER);
  const [isDraftModal, setIsDraftModal] = useState(false);
  const [isValuesChanged, setIsValuesChanged] = useState(false);
  const [insuranceResData, setInsuranceResData] = useState({});
  const [isSecondaryInsurance, setIsSecondaryInsurance] = useState(
    tab3FormData?.secondaryInsurance || false
  );

  const setPayloadForPostReq = (values) => {
    values.patientId = patientId;
    values.secondaryInsurance = isSecondaryInsurance ? YES : NO;
    values.medicareId = values?.medicareId ? values?.medicareId : '';

    values = formatDatesByDateKeysArr(
      values,
      ALL_DATE_RELATED_FIELDS_FOR_CREATE_ORDER
    );
    if (!isSecondaryInsurance) {
      values.secondaryStartDate = null;
      values.secondaryEndDate = null;
    }
    return values;
  };

  const handleLoBChange = (value) => {
    if (!value || value?.trim() === '') {
      setSelectedLoB('');
      return;
    } else {
      setSelectedLoB(value);
    }
  };

  const handleSecondaryInsuranceChecked = (checked) => {
    setIsSecondaryInsurance(checked);
    const value = checked ? YES : NO;
    formData.setFieldValue('secondaryInsurance', value);
    if (searchResponse || Object.keys(insuranceInfoData)?.length > 0) {
      const traceChanges = insuranceInfoData?.secondaryInsurance != value;
      if (checked) {
        const updatedTab3Data = formatDatesByDateKeysArr(
          { ...tab3FormData, secondaryInsurance: value },
          ALL_DATE_RELATED_FIELDS_FOR_CREATE_ORDER
        );
        const isTrue = commonFuncForTracingChanges({
          initialFormData: updatedTab3Data,
          originalResData: insuranceInfoData,
          customResData: insuranceResData,
        });
        return setIsValuesChanged(isTrue);
      }
      setIsValuesChanged(traceChanges);
    }
  };

  const handleDateChangeFunc = (dateObj, _, keyName) => {
    const newDateObj = { ...insuranceInfoDateValues, [keyName]: dateObj };
    dispatch(setInsuranceInfoDateValues(newDateObj));
  };

  const commonDateDisablingFunc = (keyName, forStart) => {
    // for Start Dates forStart should be true and for End Dates should be false
    return (current) => {
      let date =
        insuranceInfoDateValues?.[keyName] &&
        insuranceInfoDateValues?.[keyName]?.[forStart ? 'startOf' : 'endOf'](
          'day'
        );
      if (forStart) {
        return date
          ? current && current > date?.[forStart ? 'startOf' : 'endOf']('day')
          : false;
      } else {
        return date
          ? current && current < date?.[forStart ? 'startOf' : 'endOf']('day')
          : false;
      }
    };
  };

  const disabledPrimaryStartDate = commonDateDisablingFunc(
    CREATE_ORDER_FORM_KEY_NAMES.primaryEndDate,
    true
  );
  const disabledPrimaryEndDate = commonDateDisablingFunc(
    CREATE_ORDER_FORM_KEY_NAMES.primaryStartDate,
    false
  );

  const disabledSecondaryStartDate = commonDateDisablingFunc(
    CREATE_ORDER_FORM_KEY_NAMES.secondaryEndDate,
    true
  );
  const disabledSecondaryEndDate = commonDateDisablingFunc(
    CREATE_ORDER_FORM_KEY_NAMES.secondaryStartDate,
    false
  );

  const getOrderType = () => {
    return orderType ? orderType : DEFAULT_ORDER_TYPE;
  };

  const filterOrderTypeId = () => {
    const orderTypeData = orderTypeList?.find(
      (item) => item?.label.toLowerCase() === orderType.toLowerCase()
    );
    return orderTypeData?.id;
  };

  const handleAllTabCreated = () => {
    switch (true) {
      case !medicalHistoryOnly?.id:
        return PLEASE_FILL_MEDICAL_HISTORY_AND_RECORD_TAB;
      default:
        return false;
    }
  };

  const handleAllFileUploaded = () => {
    switch (true) {
      case patientAllUploadedFilesData?.insuranceCardCopyFiles?.length < 1:
        return SELECT_AT_LIST_INSURANCE_CARD_FILE;
      case isSecondaryInsurance &&
        patientAllUploadedFilesData?.secondaryInsuranceFiles?.length < 1:
        return SELECT_AT_LIST_SECONDARY_INSURANCE_FILE;
      default:
        return false;
    }
  };

  const onValuesChange = async (changedValue) => {
    const tab3Data = { ...tab3FormData, ...changedValue };

    ALL_DATE_RELATED_FIELDS_FOR_CREATE_ORDER?.length > 0 &&
      ALL_DATE_RELATED_FIELDS_FOR_CREATE_ORDER?.forEach((key) => {
        if (tab3Data?.[key]) {
          tab3Data[key] = dayjs(tab3Data?.[key]).format(
            DATE_FORMAT_STARTING_FROM_YEAR
          );
        }
      });

    const traceChanges = commonFuncForTracingChanges({
      initialFormData: tab3Data,
      originalResData: insuranceInfoData,
      customResData: insuranceResData,
    });
    setIsValuesChanged(traceChanges);
  };

  const handleSubmitTab3Data = async (values) => {
    // TODO: This code will be removed once QA is completed
    // const isAllFileUploaded = handleAllFileUploaded();
    // if (isAllFileUploaded) {
    //   message.error(isAllFileUploaded);
    //   return;
    // }

    const payload = await setPayloadForPostReq(values);
    const traceChanges = await commonFuncForTracingChanges({
      initialFormData: payload,
      originalResData: insuranceInfoData,
      customResData: insuranceResData,
    });

    if (
      createNewInsuranceInfo ||
      traceChanges ||
      Object.keys(insuranceInfoData)?.length === 0
    ) {
      if (insuranceInfoId) {
        payload.insuranceId = insuranceInfoId;
      }
      if (orderId) {
        payload.orderId = orderId;
      }
      payload.orderType = getOrderType();
      await dispatch(postInsuranceInfoData(payload)).then((res) => {
        if (res?.payload?.status) {
          message.success(res?.payload?.message);
          dispatch(setPatientDemographicsTab(false));
          dispatch(setMedicalHistoryTab(false));
          dispatch(setInsuranceInfoTab(false));
          dispatch(setOrderDetailsTab(false));
          dispatch(setInsuranceInfoCreated(false));
          dispatch(setCurrentSelectedTab('orderDetails'));
        } else {
          message.error(res?.payload?.message);
        }
      });
    } else {
      dispatch(setOrderDetailsTab(false));
      dispatch(setCurrentSelectedTab('orderDetails'));
    }
  };

  const saveOrderAsDraft = async () => {
    //  TODO: This code will be removed once QA is completed

    // const isAllFileUploaded = handleAllFileUploaded();
    // if (isAllFileUploaded) {
    //   message.error(isAllFileUploaded);
    //   return;
    // }

    const isAllTabCreated = handleAllTabCreated();
    if (isAllTabCreated) {
      message.error(isAllTabCreated);
      return;
    }

    const values = { ...tab3FormData };
    const payload = await setPayloadForPostReq(values);

    const { id: historyId } = medicalHistoryOnly;
    const { id: recordId } = medicalRecordOnly;
    setLoading(true);

    // here we will identify that if the user has changed any value in the form
    const traceChanges = await commonFuncForTracingChanges({
      initialFormData: payload,
      originalResData: insuranceInfoData,
      customResData: insuranceResData,
    });
    let insuranceId = insuranceInfoData?.id;
    if (insuranceInfoId) {
      payload.insuranceId = insuranceInfoId;
    }
    if (orderId) {
      payload.orderId = orderId;
    }
    payload.orderType = getOrderType();

    if (createNewInsuranceInfo || traceChanges) {
      const response = await dispatch(postInsuranceInfoData(payload));
      if (response?.payload?.status) {
        insuranceId = response?.payload?.data?.insuranceInfo
          ? response?.payload?.data?.insuranceInfo?.id
          : response?.payload?.data?.id;
      } else {
        message.error(response?.payload?.message);
        setLoading(false);
        return;
      }
    }
    let orderRes;
    const orderPayload = {
      patientId,
      historyId,
      recordId,
      insuranceId,
      uploadFiles: medicalUploadedFilesById,
      orderAuthDocuments: patientDocsFilesById,
      orderTypeId: filterOrderTypeId(),
      orderDetailsId: orderDetailsData?.id,
    };

    if (orderId) {
      orderRes = await dispatch(
        updateOrderData({ orderId, payload: orderPayload })
      );
    } else {
      orderPayload.currentStatus = ORDER_STATUS.draft;
      orderPayload.caseId = CASE_ID;
      orderRes = await dispatch(orderSaveAsDraft(orderPayload));
    }

    if (orderRes?.payload?.status) {
      message.success(orderRes?.payload?.message);
      dispatch(resetCreateOrderDataBacktoInitialState());
      dispatch(resetOrderStateToInitialState());
      router.push('/order-management');
      setLoading(false);
    } else {
      message.info(orderRes?.payload?.message);
      setLoading(false);
    }
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
        postUploadFile({ file: file.file, type: category, patientId })
      ).then((res) => {
        message[res?.payload?.status ? SUCCESS_TEXT_ONLY : ERROR_TEXT_ONLY](
          res?.payload?.message
        );
        setLoading(false);
      });
    } else {
      message.error(ERROR_MESSAGE_FOR_MAX_UPLOAD_DOCS);
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
    dispatch(resetOrderStateToInitialState());
    router.push('/order-management');
  };

  useEffect(() => {
    formData.validateFields({ validateOnly: true }).then(
      () => {
        setSubmittable(true);
      },
      (e) => {
        if (e.outOfDate === true) {
          setSubmittable(true);
        } else {
          setSubmittable(false);
        }
      }
    );
    const initialValues = formData.getFieldValue();
    const payload = { ...tab3FormData, ...initialValues };
    if (
      tab3FormData &&
      Object.keys(tab3FormData)?.length === 0 &&
      insuranceInfoData &&
      Object.keys(insuranceInfoData)?.length === 0
    ) {
      payload.healthPlan = 'healthsun';
      formData.setFieldValue('healthPlan', 'healthsun');
      setIsValuesChanged(true);
    }
    dispatch(setTab3FormData(payload));
  }, [formValues, isSecondaryInsurance]);

  useEffect(() => {
    if (isValuesChanged) {
      dispatch(setPatientDemographicsTab(true));
      dispatch(setMedicalHistoryTab(true));
      dispatch(setOrderDetailsTab(true));
      dispatch(setPateintDocsTab(true));
    } else if (!isValuesChanged) {
      if (searchResponse) {
        dispatch(setPatientDemographicsTab(false));
        dispatch(setMedicalHistoryTab(false));
        dispatch(setPateintDocsTab(false));
      }
      dispatch(setOrderDetailsTab(false));
    }
  }, [isValuesChanged]);

  useEffect(() => {
    const insuranceInfo = { ...insuranceInfoData } || {};
    if (
      insuranceInfo &&
      Object.keys(insuranceInfo)?.length > 0 &&
      Object.keys(tab3FormData)?.length <= 1
    ) {
      const formattedInsuranceInfo = formatDatesByDateKeysArr(
        insuranceInfo,
        ALL_DATE_RELATED_FIELDS_FOR_CREATE_ORDER,
        false
      );
      const onlyDatesObj = filterObjectByKeys(
        formattedInsuranceInfo,
        ALL_DATE_RELATED_FIELDS_FOR_CREATE_ORDER
      );
      dispatch(setInsuranceInfoDateValues(onlyDatesObj));
      setSelectedLoB(insuranceInfo?.lob);
      setIsSecondaryInsurance(
        insuranceInfo?.secondaryInsurance === YES ? true : false
      );

      const updatedInsuranceData = filterObjectByKeys(
        formattedInsuranceInfo,
        INSURANCE_INFO_ALL_FIELDS_ARRAY
      );
      formData.setFieldsValue(updatedInsuranceData);
      dispatch(setTab3FormData(updatedInsuranceData));
    } else if (insuranceInfo && Object.keys(insuranceInfo)?.length === 0) {
      const makeEmptyValueObj = {};
      INSURANCE_INFO_ALL_FIELDS_ARRAY?.forEach((key) => {
        makeEmptyValueObj[key] = '';
      });
      setInsuranceResData(makeEmptyValueObj);
    }
  }, [searchResponse]);

  return (
    <div className='co-insurance-info-tab-3-parent-container'>
      {loading && <CustomSpinner />}
      <Col>
        <h3 className='co-insurance-info-order-type'>{orderType}</h3>
      </Col>
      <Form
        form={formData}
        name='create-order-insurance-info'
        layout='vertical'
        autoComplete='off'
        preserve={true}
        onFinish={handleSubmitTab3Data}
        initialValues={tab3FormData}
        onValuesChange={onValuesChange}
      >
        <Row span={24} gutter={24}>
          <Col
            xs={{ span: 24 }}
            sm={{ span: 12 }}
            md={{ span: 8 }}
            lg={{ span: 8 }}
          >
            <Form.Item
              label='Health Plan'
              name={CREATE_ORDER_FORM_KEY_NAMES.healthPlan}
              rules={CREATE_ORDER_FORM_FIELD_RULES.healthPlan}
            >
              <Select
                size='large'
                options={INSURANCE_INFO_HEALTH_PLAN_OPTIONS}
                placeholder='Select Health Plan'
                disabled
              />
            </Form.Item>
          </Col>

          <Col
            xs={{ span: 24 }}
            sm={{ span: 12 }}
            md={{ span: 8 }}
            lg={{ span: 8 }}
          >
            <Form.Item
              label='LoB'
              name={CREATE_ORDER_FORM_KEY_NAMES.lob}
              rules={CREATE_ORDER_FORM_FIELD_RULES.lob}
            >
              <Select
                allowClear
                size='large'
                options={INSURANCE_INFO_LOB_OPTIONS}
                placeholder='Select LoB'
                onChange={handleLoBChange}
              />
            </Form.Item>
          </Col>
          {selectedLoB === MEDICARE_CONDITIONAL_VALIDATION && (
            <Col
              xs={{ span: 24 }}
              sm={{ span: 12 }}
              md={{ span: 12 }}
              lg={{ span: 8 }}
            >
              <Form.Item
                label='Medicare ID'
                name={CREATE_ORDER_FORM_KEY_NAMES.medicareId}
                rules={CREATE_ORDER_FORM_FIELD_RULES.medicareId}
              >
                <Input
                  size='large'
                  className='co-insurance-info-tab-3-input-number'
                  placeholder='Enter Medicare ID'
                />
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
            <Form.Item
              label='Primary Subscriber Number'
              name={CREATE_ORDER_FORM_KEY_NAMES.primarySubscriberNumber}
              rules={CREATE_ORDER_FORM_FIELD_RULES.primarySubscriberNumber}
            >
              <Input
                size='large'
                className='co-insurance-info-tab-3-input-number'
                placeholder='Enter Primary Subscriber Number'
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
              label='Primary Group Number'
              name={CREATE_ORDER_FORM_KEY_NAMES.primaryGroupNumber}
              rules={CREATE_ORDER_FORM_FIELD_RULES.primaryGroupNumber}
            >
              <Input
                size='large'
                className='co-insurance-info-tab-3-input-number'
                placeholder='Enter Primary Group Number'
              />
            </Form.Item>
          </Col>
        </Row>

        <Row span={24} gutter={24}>
          <Col
            xs={{ span: 24 }}
            sm={{ span: 12 }}
            md={{ span: 12 }}
            lg={{ span: 8 }}
          >
            <Form.Item
              label='Secondary Subscriber Number'
              name={CREATE_ORDER_FORM_KEY_NAMES.secondarySubscriberNumber}
              rules={CREATE_ORDER_FORM_FIELD_RULES.secondarySubscriberNumber}
            >
              <Input
                size='large'
                className='co-insurance-info-tab-3-input-number'
                placeholder='Enter Secondary Subscriber Number'
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
              label='Secondary Group Number'
              name={CREATE_ORDER_FORM_KEY_NAMES.secondaryGroupNumber}
              rules={CREATE_ORDER_FORM_FIELD_RULES.secondaryGroupNumber}
            >
              <Input
                size='large'
                className='co-insurance-info-tab-3-input-number'
                placeholder='Enter Primary Group Number'
              />
            </Form.Item>
          </Col>
        </Row>

        <Row span={24} gutter={24}>
          <Col
            xs={{ span: 24 }}
            sm={{ span: 12 }}
            md={{ span: 12 }}
            lg={{ span: 8 }}
          >
            <Form.Item
              label='Primary Start Date'
              name={CREATE_ORDER_FORM_KEY_NAMES.primaryStartDate}
              rules={CREATE_ORDER_FORM_FIELD_RULES.primaryStartDate}
            >
              <DatePicker
                className='co-insurance-info-tab-3-datepicker'
                size='large'
                placeholder='Choose Primary Start Date'
                format={DATE_FORMAT_STARTING_FROM_MONTH}
                onChange={(date, dateString) =>
                  handleDateChangeFunc(
                    date,
                    dateString,
                    CREATE_ORDER_FORM_KEY_NAMES.primaryStartDate
                  )
                }
                disabledDate={disabledPrimaryStartDate}
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
              label='Primary End Date'
              name={CREATE_ORDER_FORM_KEY_NAMES.primaryEndDate}
              rules={CREATE_ORDER_FORM_FIELD_RULES.primaryEndDate}
            >
              <DatePicker
                className='co-insurance-info-tab-3-datepicker'
                size='large'
                placeholder='Choose Primary End Date'
                format={DATE_FORMAT_STARTING_FROM_MONTH}
                onChange={(date, dateString) =>
                  handleDateChangeFunc(
                    date,
                    dateString,
                    CREATE_ORDER_FORM_KEY_NAMES.primaryEndDate
                  )
                }
                disabledDate={disabledPrimaryEndDate}
              />
            </Form.Item>
          </Col>

          <Col
            xs={{ span: 24 }}
            sm={{ span: 12 }}
            md={{ span: 12 }}
            lg={{ span: 8 }}
          >
            <Form.Item label='Copy Of Insurance Card'>
              <Upload
                beforeUpload={beforeFileUpload}
                customRequest={(file) =>
                  customRequest(
                    file,
                    DOCUMENTS_UPLOAD_IN_INSURANCE_COPY_CATEGORY
                  )
                }
                listType='picture'
                maxCount={MAX_UPLOAD_DOCUMENTS_PER_CATEGORY}
                showUploadList={false}
                disabled={
                  patientAllUploadedFilesData?.insuranceCardCopyFiles
                    ?.length === MAX_UPLOAD_DOCUMENTS_PER_CATEGORY
                }
              >
                <Button
                  size='large'
                  className='co-tab-3-upload-btn'
                  icon={<FiUpload />}
                  disabled={
                    patientAllUploadedFilesData?.insuranceCardCopyFiles
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
          {patientAllUploadedFilesData?.insuranceCardCopyFiles?.map((elem) => (
            <Col
              xs={{ span: 24 }}
              sm={{ span: 12 }}
              md={{ span: 12 }}
              lg={{ span: 8 }}
              className='co-tab-3-single-document-container'
              key={elem?.id}
            >
              <UploadedImageContainer
                data={{
                  ...elem,
                  category: DOCUMENTS_UPLOAD_IN_INSURANCE_COPY_CATEGORY,
                }}
              />
            </Col>
          ))}
        </Row>

        <Row span={24} gutter={24} className='co-tab-3-sec-ins-mt-15'>
          <Col
            xs={{ span: 24 }}
            sm={{ span: 12 }}
            md={{ span: 12 }}
            lg={{ span: 8 }}
          >
            <Form.Item label='Secondary Insurance'>
              <Switch
                checked={
                  isSecondaryInsurance ||
                  patientAllUploadedFilesData?.secondaryInsuranceFiles?.length >
                    0
                }
                onChange={handleSecondaryInsuranceChecked}
                disabled={
                  patientAllUploadedFilesData?.secondaryInsuranceFiles?.length >
                  0
                }
              />
            </Form.Item>
          </Col>
          {(isSecondaryInsurance ||
            patientAllUploadedFilesData?.secondaryInsuranceFiles?.length >
              0) && (
            <>
              <Col
                xs={{ span: 24 }}
                sm={{ span: 12 }}
                md={{ span: 12 }}
                lg={{ span: 8 }}
              >
                <Form.Item
                  label='Secondary Start Date'
                  name={CREATE_ORDER_FORM_KEY_NAMES.secondaryStartDate}
                  rules={CREATE_ORDER_FORM_FIELD_RULES.secondaryStartDate}
                >
                  <DatePicker
                    className='co-insurance-info-tab-3-datepicker'
                    size='large'
                    placeholder='Choose Secondary Start Date'
                    format={DATE_FORMAT_STARTING_FROM_MONTH}
                    onChange={(date, dateString) =>
                      handleDateChangeFunc(
                        date,
                        dateString,
                        CREATE_ORDER_FORM_KEY_NAMES.secondaryStartDate
                      )
                    }
                    disabledDate={disabledSecondaryStartDate}
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
                  label='Secondary End Date'
                  name={CREATE_ORDER_FORM_KEY_NAMES.secondaryEndDate}
                  rules={CREATE_ORDER_FORM_FIELD_RULES.secondaryEndDate}
                >
                  <DatePicker
                    className='co-insurance-info-tab-3-datepicker'
                    size='large'
                    placeholder='Choose Secondary End Date'
                    format={DATE_FORMAT_STARTING_FROM_MONTH}
                    onChange={(date, dateString) =>
                      handleDateChangeFunc(
                        date,
                        dateString,
                        CREATE_ORDER_FORM_KEY_NAMES.secondaryEndDate
                      )
                    }
                    disabledDate={disabledSecondaryEndDate}
                  />
                </Form.Item>
              </Col>
            </>
          )}
        </Row>
        {isSecondaryInsurance && (
          <Row span={24} gutter={24}>
            <Col span={24}>
              <Form.Item label='Copy Of Secondary Insurance'>
                <Upload
                  beforeUpload={beforeFileUpload}
                  customRequest={(file) =>
                    customRequest(
                      file,
                      DOCUMENTS_UPLOAD_IN_SECONDARY_INSURANCE_CATEGORY
                    )
                  }
                  listType='picture'
                  maxCount={MAX_UPLOAD_DOCUMENTS_PER_CATEGORY}
                  showUploadList={false}
                  disabled={
                    patientAllUploadedFilesData?.secondaryInsuranceFiles
                      ?.length === MAX_UPLOAD_DOCUMENTS_PER_CATEGORY
                  }
                >
                  <Button
                    size='large'
                    className='co-tab-3-upload-btn'
                    icon={<FiUpload />}
                    disabled={
                      patientAllUploadedFilesData?.secondaryInsuranceFiles
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
        )}

        <Row span={24} gutter={24}>
          {patientAllUploadedFilesData?.secondaryInsuranceFiles?.map((elem) => (
            <Col
              xs={{ span: 24 }}
              sm={{ span: 12 }}
              md={{ span: 12 }}
              lg={{ span: 8 }}
              className='co-tab-3-single-document-container'
              key={elem?.id}
            >
              <UploadedImageContainer
                data={{
                  ...elem,
                  category: DOCUMENTS_UPLOAD_IN_SECONDARY_INSURANCE_CATEGORY,
                }}
              />
            </Col>
          ))}
        </Row>
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

export default InsuranceInfo;
