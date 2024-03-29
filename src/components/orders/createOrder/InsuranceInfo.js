import React, { useEffect, useState } from 'react';
import '../../../styles/orders/createOrder/insuranceInfo.css';
import '../../../styles/orders/createOrder.css';
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
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
  CREATE_ORDER_FORM_FIELD_RULES,
  CREATE_ORDER_FORM_KEY_NAMES,
  DATE_FORMAT_STARTING_FROM_MONTH,
  DATE_FORMAT_STARTING_FROM_YEAR,
  MEDICARE_CONDITIONAL_VALIDATION,
  MEDICARE_ID,
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
} from '@/utils/constant.util';
import { FiUpload } from 'react-icons/fi';
import { BiTrash } from 'react-icons/bi';
import {
  INSURANCE_INFO_HEALTH_PLAN_OPTIONS,
  INSURANCE_INFO_LOB_OPTIONS,
} from '@/utils/options';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';

import {
  resetCreateOrderDataBacktoInitialState,
  setCurrentSelectedTab,
  setPateintDocsTab,
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
  setPrimaryStartValue,
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
  fileLengthCheck,
  replaceNullWithEmptyString,
} from '@/utils/commonFunctions';
import DisplayFileSize from './DisplayFileSize';

const InsuranceInfo = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { orderId } = router.query;
  const patientSearchData = useSelector(
    (state) => state.allOrdersData.patientRecordSearchData
  );
  const searchResponse = useSelector(
    (state) => state.allOrdersData.patientSearchResponse
  );

  const patientDemographicsData = useSelector(
    (state) => state.allOrdersData.patientDemographicsData
  );
  const medicalHistoryOnly = useSelector(
    (state) => state.allOrdersData.medicalHistoryOnly
  );
  const medicalRecordOnly = useSelector(
    (state) => state.allOrdersData.medicalRecordOnly
  );
  const insuranceInfoData = useSelector(
    (state) => state.allOrdersData.insuranceInfoData || {}
  );
  const isNewPatientCreated = useSelector(
    (state) => state.allOrdersData.isNewPatientCreated
  );

  const createNewInsuranceInfo = useSelector(
    (state) => state.allOrdersData.createNewInsuranceInfo
  );

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

  // Handling Documents Uploads state
  const patientAllUploadedFilesData = useSelector(
    (state) => state.allOrdersData.patientAllUploadedFilesData
  );

  const insuranceInfoId = useSelector(
    (state) => state.allOrdersData.insuranceInfoId
  );

  const primaryStartValue = useSelector((state) => {
    state.allOrdersData.primaryStartValue;
  });

  const [formData] = Form.useForm();
  const formValues = Form.useWatch([], formData);
  const [submittable, setSubmittable] = useState(false);
  const [selectedLoB, setSelectedLoB] = useState('');
  const [isSecondaryInsurance, setIsSecondaryInsurance] = useState(
    tab3FormData?.secondaryInsurance || false
  );
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState(ARE_YOU_SURE_WANT_TO_CANCEL_ORDER);
  const [isDraftModal, setIsDraftModal] = useState(false);
  const [startValue, setStartValue] = useState(null);
  const [endValue, setEndValue] = useState(null);
  const [secondaryStartValue, setSecondaryStartValue] = useState(null);
  const [secondaryEndValue, setSecondaryEndValue] = useState(null);

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

  const handleSubmitTab3Data = (values) => {
    const isAllFileUploaded = handleAllFileUploaded();
    if (isAllFileUploaded) {
      message.error(isAllFileUploaded);
      return;
    }
    let traceChanges = false;
    const patientId = patientDemographicsData?.id;
    values.patientId = patientId;
    values.primaryStartDate = dayjs(values.primaryStartDate).format(
      DATE_FORMAT_STARTING_FROM_YEAR
    );
    values.primaryEndDate = dayjs(values.primaryEndDate).format(
      DATE_FORMAT_STARTING_FROM_YEAR
    );
    values.secondaryInsurance = isSecondaryInsurance ? 'Yes' : 'No';
    values.medicareId = values?.medicareId ? values?.medicareId : '';
    if (isSecondaryInsurance) {
      values.secondaryStartDate = dayjs(values.secondaryStartDate).format(
        DATE_FORMAT_STARTING_FROM_YEAR
      );
      values.secondaryEndDate = dayjs(values.secondaryEndDate).format(
        DATE_FORMAT_STARTING_FROM_YEAR
      );
    }

    if (
      searchResponse ||
      (insuranceInfoData && Object.keys(insuranceInfoData)?.length > 0)
    ) {
      const insuranceInfoUnfreezed = { ...insuranceInfoData };

      insuranceInfoUnfreezed.primaryStartDate = dayjs(
        insuranceInfoUnfreezed?.primaryStartDate
      ).format(DATE_FORMAT_STARTING_FROM_YEAR);

      insuranceInfoUnfreezed.primaryEndDate = dayjs(
        insuranceInfoUnfreezed?.primaryEndDate
      ).format(DATE_FORMAT_STARTING_FROM_YEAR);

      insuranceInfoUnfreezed.secondaryStartDate = dayjs(
        insuranceInfoUnfreezed?.secondaryStartDate
      ).format(DATE_FORMAT_STARTING_FROM_YEAR);

      insuranceInfoUnfreezed.secondaryEndDate = dayjs(
        insuranceInfoUnfreezed?.secondaryEndDate
      ).format(DATE_FORMAT_STARTING_FROM_YEAR);

      const updatedFreezedData = replaceNullWithEmptyString(
        insuranceInfoUnfreezed
      );
      const updatedFormDataValues = replaceNullWithEmptyString(values);

      const commonKeys =
        updatedFreezedData &&
        Object.keys(updatedFreezedData).filter((key) =>
          updatedFormDataValues.hasOwnProperty(key)
        );

      traceChanges = commonKeys.some(
        (key) => updatedFreezedData[key] != updatedFormDataValues[key]
      );
      // If no common keys exist, consider it as a change
      if (commonKeys.length < 1) {
        traceChanges = true;
      }
    }

    if (createNewInsuranceInfo || traceChanges) {
      if (insuranceInfoId) {
        values.insuranceId = insuranceInfoId;
      }
      if (orderId) {
        values.orderId = orderId;
      }
      dispatch(postInsuranceInfoData(values)).then((res) => {
        if (res?.payload?.status) {
          message.success(res?.payload?.message);
          dispatch(setPateintDocsTab(false));
          dispatch(setInsuranceInfoCreated(false));
          dispatch(setCurrentSelectedTab('patientDocuments'));
        } else {
          message.error(res?.payload?.message);
        }
      });
    } else {
      dispatch(setCurrentSelectedTab('patientDocuments'));
    }
  };

  const customRequest = (file, category) => {
    setLoading(true);
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
        // TODO WIll remove once QA is completed
        // if (!isSecondaryInsurance) {
        //   setSubmittable(true);
        // }
      }
    );
    const initialValues = formData.getFieldsValue();
    initialValues.secondaryInsurance =
      isSecondaryInsurance === true || isSecondaryInsurance === 'Yes'
        ? 'Yes'
        : 'No';
    if (isSecondaryInsurance === 'No' || isSecondaryInsurance === false) {
      setIsSecondaryInsurance(false);
    } else {
      setIsSecondaryInsurance(true);
    }
    const payload = { ...tab3FormData, ...initialValues };
    dispatch(setTab3FormData(payload));
  }, [formValues, isSecondaryInsurance]);

  const saveOrderAsDraft = async () => {
    const isAllFileUploaded = handleAllFileUploaded();
    if (isAllFileUploaded) {
      message.error(isAllFileUploaded);
      return;
    }
    let traceChanges = false;
    const { id: patientId } = patientDemographicsData;
    const { id: historyId } = medicalHistoryOnly;
    const { id: recordId } = medicalRecordOnly;

    setLoading(true);
    const newValues = {
      ...tab3FormData,
      secondaryInsurance: isSecondaryInsurance ? 'Yes' : 'No',
      patientId,
      primaryStartDate: dayjs(tab3FormData?.primaryStartDate?.$d).format(
        DATE_FORMAT_STARTING_FROM_YEAR
      ),
      primaryEndDate: dayjs(tab3FormData?.primaryEndDate?.$d).format(
        DATE_FORMAT_STARTING_FROM_YEAR
      ),
      secondaryStartDate:
        isSecondaryInsurance && tab3FormData?.secondaryStartDate?.$d
          ? dayjs(tab3FormData?.secondaryStartDate?.$d).format(
              DATE_FORMAT_STARTING_FROM_YEAR
            )
          : null,
      secondaryEndDate:
        isSecondaryInsurance && tab3FormData?.secondaryEndDate?.$d
          ? dayjs(tab3FormData?.secondaryEndDate?.$d).format(
              DATE_FORMAT_STARTING_FROM_YEAR
            )
          : null,
    };
    // here we will identify that if the user has changed any value in the form
    if (
      searchResponse ||
      (insuranceInfoData && Object.keys(insuranceInfoData).length > 0)
    ) {
      const insuranceInfoUnfreezed = { ...insuranceInfoData };

      insuranceInfoUnfreezed.primaryStartDate = dayjs(
        insuranceInfoUnfreezed?.primaryStartDate
      ).format(DATE_FORMAT_STARTING_FROM_YEAR);

      insuranceInfoUnfreezed.primaryEndDate = dayjs(
        insuranceInfoUnfreezed?.primaryEndDate
      ).format(DATE_FORMAT_STARTING_FROM_YEAR);

      insuranceInfoUnfreezed.secondaryStartDate = dayjs(
        insuranceInfoUnfreezed?.secondaryStartDate
      ).format(DATE_FORMAT_STARTING_FROM_YEAR);

      insuranceInfoUnfreezed.secondaryEndDate = dayjs(
        insuranceInfoUnfreezed?.secondaryEndDate
      ).format(DATE_FORMAT_STARTING_FROM_YEAR);

      const updatedFreezedData = replaceNullWithEmptyString(
        insuranceInfoUnfreezed
      );
      const updatedFormDataValues = replaceNullWithEmptyString(newValues);

      const commonKeys =
        updatedFreezedData &&
        Object.keys(updatedFreezedData).filter((key) =>
          updatedFormDataValues.hasOwnProperty(key)
        );

      traceChanges = commonKeys.some(
        (key) => updatedFreezedData[key] != updatedFormDataValues[key]
      );
      // If no common keys exist, consider it as a change
      if (commonKeys.length < 1) {
        traceChanges = true;
      }
    }
    let insuranceId = insuranceInfoData?.id;
    if (insuranceInfoId) {
      newValues.insuranceId = insuranceInfoId;
    }
    if (orderId) {
      newValues.orderId = orderId;
    }
    if (createNewInsuranceInfo || traceChanges) {
      const createdInsuranceInfo = await dispatch(
        postInsuranceInfoData(newValues)
      );
      if (createdInsuranceInfo) {
        insuranceId = createdInsuranceInfo?.payload?.data?.insuranceInfo
          ? createdInsuranceInfo?.payload?.data?.insuranceInfo?.id
          : createdInsuranceInfo?.payload?.data?.id;
      }
      if (!createdInsuranceInfo?.payload?.status) {
        message.error(createdInsuranceInfo?.payload?.message);
        setLoading(false);
        return;
      }
    }

    let order;
    if (orderId) {
      const payload = {
        patientId,
        historyId,
        recordId,
        insuranceId: insuranceId,
        uploadFiles: medicalUploadedFilesById,
        orderAuthDocuments: patientDocsFilesById,
      };
      order = await dispatch(updateOrderData({ orderId, payload }));
    } else {
      order = await dispatch(
        orderSaveAsDraft({
          caseId: CASE_ID,
          patientId,
          historyId,
          recordId,
          insuranceId: insuranceId,
          currentStatus: ORDER_STATUS.draft,
          uploadFiles: medicalUploadedFilesById,
          orderAuthDocuments: patientDocsFilesById,
        })
      );
    }

    if (order?.payload?.status) {
      dispatch(resetCreateOrderDataBacktoInitialState());
      dispatch(setTab1FormData({}));
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
    dispatch(resetCreateOrderDataBacktoInitialState());
    dispatch(setTab1FormData({}));
    dispatch(resetSearchPatientData());
    dispatch(resetOrderStateToInitialState());
    router.push('/order-management');
  };
  const handleCancel = () => {
    setOpen(false);
  };

  const handleStartDateChange = (date) => {
    setStartValue(date);
  };

  const handleEndDateChange = (date) => {
    setEndValue(date);
  };

  const disabledStartDate = (current) => {
    let endDate = endValue
      ? endValue.startOf('day')
      : dayjs(
          insuranceInfoData?.primaryEndDate
            ? insuranceInfoData?.primaryEndDate
            : null
        ).startOf('day');
    // Disable dates after the selected end date
    return endDate ? current && current > endDate.startOf('day') : false;
  };

  const disabledEndDate = (current) => {
    let startDate = startValue
      ? startValue.startOf('day')
      : dayjs(
          insuranceInfoData?.primaryStartDate
            ? insuranceInfoData?.primaryStartDate
            : null
        ).startOf('day');
    // Disable dates before the selected start date
    return startDate ? current && current < startDate.startOf('day') : false;
  };

  const handleSecondaryStartDateChange = (date) => {
    setSecondaryStartValue(date);
  };

  const handleSecondaryEndDateChange = (date) => {
    setSecondaryEndValue(date);
  };

  const disabledSecondaryStartDate = (current) => {
    const secondaryEndDate = secondaryEndValue
      ? secondaryEndValue.startOf('day')
      : dayjs(
          insuranceInfoData?.secondaryEndDate
            ? insuranceInfoData?.secondaryEndDate
            : null
        ).startOf('day');
    // Disable dates after the selected end date
    return secondaryEndDate
      ? current && current > secondaryEndDate.startOf('day')
      : false;
  };

  const disabledSecondaryEndDate = (current) => {
    const secondaryStartDate = secondaryStartValue
      ? secondaryStartValue.startOf('day')
      : dayjs(
          insuranceInfoData?.secondaryStartDate
            ? insuranceInfoData?.secondaryStartDate
            : null
        ).startOf('day');
    // Disable dates before the selected start date
    return secondaryStartDate
      ? current && current < secondaryStartDate.startOf('day')
      : false;
  };

  useEffect(() => {
    const insuranceInfo = insuranceInfoData || {};
    if (insuranceInfo && Object.keys(insuranceInfo)?.length > 0) {
      const formattedInsuranceInfo = {
        ...insuranceInfo,
        primaryStartDate: insuranceInfo?.primaryStartDate
          ? dayjs(insuranceInfo?.primaryStartDate)
          : null,
        primaryEndDate: insuranceInfo?.primaryEndDate
          ? dayjs(insuranceInfo?.primaryEndDate)
          : null,
        secondaryStartDate: insuranceInfo?.secondaryStartDate
          ? dayjs(insuranceInfo.secondaryStartDate)
          : null,
        secondaryEndDate: insuranceInfo?.secondaryEndDate
          ? dayjs(insuranceInfo.secondaryEndDate)
          : null,
      };
      setSelectedLoB(insuranceInfo?.lob);
      setIsSecondaryInsurance(
        insuranceInfo?.secondaryInsurance === 'Yes' ? true : false
      );
      formData.setFieldsValue(formattedInsuranceInfo);
    }
  }, [searchResponse]);

  return (
    <div className='co-insurance-info-tab-3-parent-container'>
      {loading && <Spin fullscreen></Spin>}
      <Form
        form={formData}
        name='create-order-insurance-info'
        layout='vertical'
        autoComplete='off'
        preserve={true}
        onFinish={handleSubmitTab3Data}
        initialValues={tab3FormData}
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
                allowClear
                size='large'
                options={INSURANCE_INFO_HEALTH_PLAN_OPTIONS}
                placeholder='Select Health Plan'
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
                size='large'
                allowClear
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
              <InputNumber
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
              <InputNumber
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
              <InputNumber
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
              <InputNumber
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
                onChange={handleStartDateChange}
                disabledDate={disabledStartDate}
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
                onChange={handleEndDateChange}
                disabledDate={disabledEndDate}
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
          {isSecondaryInsurance && (
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
                    onChange={handleSecondaryStartDateChange}
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
                    onChange={handleSecondaryEndDateChange}
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
        handleCancel={handleCancel}
        modalText={modalText}
        okText={ORDER_MODAL_OK_TEXT}
        cancelText={ORDER_MODAL_CANCEL_TEXT}
      />
    </div>
  );
};

export default InsuranceInfo;
