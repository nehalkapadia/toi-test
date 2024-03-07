import React, { useEffect, useState } from 'react';
import '../../../styles/orders/createOrder/patientDemographics.css';
import '../../../styles/orders/createOrder.css';
import {
  API_RESPONSE_MESSAGES,
  ARE_YOU_SURE_WANT_TO_CANCEL_ORDER,
  CREATE_ORDER_FORM_FIELD_RULES,
  CREATE_ORDER_FORM_KEY_NAMES,
  DATE_FORMAT_STARTING_FROM_MONTH,
  DATE_FORMAT_STARTING_FROM_YEAR,
  MIN_FIELDS_FOR_ENABLE_SEARCH_AT_PATIENT_DEMO,
  ORDER_MODAL_CANCEL_TEXT,
  ORDER_MODAL_OK_TEXT,
  ORDER_STATUS,
  PATIENT_NO_RECORD_FOUND,
  SEARCH_PATIENT_FIELDS_NAME,
  SEARCH_RESULT_SUCCESS,
  SELECT_MANDATORY_FIELD_ERROR_MESSAGE,
} from '@/utils/constant.util';
import {
  Button,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  message,
} from 'antd';
import { AiFillExclamationCircle, AiOutlineSearch } from 'react-icons/ai';
import TextArea from 'antd/es/input/TextArea';
import { useDispatch, useSelector } from 'react-redux';
import {
  resetCreateOrderDataBacktoInitialState,
  setCurrentSelectedTab,
  setDisplayPcpNumberSuccessTick,
  setDisplayReferringSuccessTick,
  setDisplayorderingSuccessTick,
  setInsuranceInfoTab,
  setMedicalHistoryTab,
  setOrderDetailsTab,
  setPateintDocsTab,
  setTab2FormData,
  setTab3FormData,
} from '@/store/createOrderFormSlice';
import {
  searchPatientRecordData,
  setTab1FormData,
  getPatientDocumentsAtEdit,
  getOrderDetailsById,
  resetSearchPatientData,
  resetOrderStateToInitialState,
  setMedicalUploadedFilesById,
  setMedicalFilesAtEditById,
  setPatientDocsFilesById,
} from '@/store/orderSlice';
import { useRouter } from 'next/router';
import OrderModal from './OrderModal';
import dayjs from 'dayjs';
import {
  extractIdsFromNestedObjects,
  formatPhoneNumberForInput,
  patientDemographicsDataComparison,
  replaceNullWithEmptyString,
} from '@/utils/commonFunctions';
import { GENDER_OPTIONS } from '@/utils/options';
import CustomSpinner from '@/components/CustomSpinner';

const PatientDemographics = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { orderId, type: orderType } = router.query;
  const [formData] = Form.useForm();
  const formValues = Form.useWatch([], formData);
  const [submittable, setSubmittable] = useState(false);
  const [isSearchable, setIsSearchable] = useState(false);
  const [isSearchable2, setIsSearchable2] = useState(false);
  const [open, setOpen] = useState(false);
  const [isOnChangeTurned, setIsOnChangeTurned] = useState(false);

  const tab1FormData =
    useSelector((state) => state.allOrdersData.tab1FormData) || {};

  const patientSearchIsLoading = useSelector(
    (state) => state.allOrdersData.patientSearchIsLoading
  );
  const searchPatientformData =
    useSelector((state) => state.allOrdersData.searchPatientformData) || {};
  const patientSearchData =
    useSelector((state) => state.allOrdersData.patientRecordSearchData) || {};
  const searchResponse = useSelector(
    (state) => state.allOrdersData.patientSearchResponse
  );
  const isSecondaryInsuranceAtSearch = useSelector(
    (state) => state.allOrdersData.isSecondaryInsuranceAtSearch
  );
  const patientRecordOrderStatus = useSelector(
    (state) => state.allOrdersData.patientRecordOrderStatus
  );

  // These 3 varibales are used When getPatientDocumentsAtEdit Func is called
  const isPatientDocsForEditCalled = useSelector(
    (state) => state.allOrdersData.isPatientDocsForEditCalled
  );
  const patientAllUploadedFilesData = useSelector(
    (state) => state.allOrdersData.patientAllUploadedFilesData
  );
  const patientUploadedDocsData = useSelector(
    (state) => state.allOrdersData.patientUploadedDocsData
  );
  const orderTypeList = useSelector(
    (state) => state.allOrdersData.orderTypeList
  );

  const patientDemographicsData =
    useSelector((state) => state.allOrdersData.patientDemographicsData) || {};

  const handleDisabledDate = (current) => {
    return current && current > dayjs().startOf('day');
  };

  const filterOrderTypeId = () => {
    const orderTypeData = orderTypeList?.find(
      (item) => item?.label.toLowerCase() === orderType?.toLowerCase()
    );
    return orderTypeData?.id;
  };

  const handleSearchPatient = () => {
    const initValues = formData.getFieldValue();
    const { firstName, lastName, dob, gender, hsMemberID } = initValues;
    const dateOfBirth = dob ? dayjs(dob).format(DATE_FORMAT_STARTING_FROM_YEAR) : '';
    if (
      ((!firstName || !lastName || !dob || !gender) && !hsMemberID) ||
      ((firstName?.trim() === '' ||
        lastName?.trim() === '' ||
        dateOfBirth?.trim() === '' ||
        gender?.trim() === '') &&
        hsMemberID?.trim() === '')
    ) {
      return message.info(SELECT_MANDATORY_FIELD_ERROR_MESSAGE);
    }
    const payload = {
      firstName: firstName ? firstName : '',
      lastName: lastName ? lastName : '',
      dob: dateOfBirth,
      gender: gender ? gender : '',
      hsMemberID: hsMemberID ? hsMemberID : '',
      orderTypeId: filterOrderTypeId(),
    };
    dispatch(searchPatientRecordData(payload))
      .then((res) => {
        if (res?.payload?.status) {
          message.success(SEARCH_RESULT_SUCCESS);
          dispatch(setTab2FormData({}));
          dispatch(setTab3FormData({}));
          dispatch(setDisplayorderingSuccessTick(false));
          dispatch(setDisplayReferringSuccessTick(false));
          dispatch(setDisplayPcpNumberSuccessTick(false));

          const { currentStatus } = res?.payload?.data || null;
          if (currentStatus === ORDER_STATUS.draft && !orderId) {
            const currentQuery = { ...router.query };
            currentQuery.type = res?.payload?.data?.orderTypeData?.name;
            currentQuery.orderId = res?.payload?.data?.id;
            router.push({
              pathname: router.pathname,
              query: currentQuery,
            });
          }
        } else {
          message.info({
            content: PATIENT_NO_RECORD_FOUND,
            duration: 0,
            key: 1,
          });
          const { dob, ...payload } = initValues;
          formData.setFieldsValue({
            ...initValues,
            dob: dob ? dayjs(dob) : null,
            email: null,
            primaryPhoneNumber: null,
            secondaryPhoneNumber: null,
            address: null,
          });
          dispatch(setTab2FormData({}));
          dispatch(setTab3FormData({}));
          dispatch(setDisplayorderingSuccessTick(false));
          dispatch(setDisplayReferringSuccessTick(false));
          dispatch(setDisplayPcpNumberSuccessTick(false));
          dispatch(setMedicalHistoryTab(true));
          dispatch(setInsuranceInfoTab(true));
          dispatch(setPateintDocsTab(true));
        }
      })
      .catch((err) => {
        message.error(API_RESPONSE_MESSAGES.err_rest_api);
      });
  };

  const handleSubmitTab1Data = () => {
    dispatch(setMedicalHistoryTab(false));
    dispatch(setCurrentSelectedTab('medicalHistory'));
  };

  const isMemberIdValid = (memberId) => {
    const res = memberId?.replace(/[^a-zA-Z0-9]/g, '');
    if (res?.trim()?.length > 4) {
      return true;
    } else {
      return false;
    }
  };

  useEffect(() => {
    formData
      .validateFields(MIN_FIELDS_FOR_ENABLE_SEARCH_AT_PATIENT_DEMO, {
        validateOnly: true,
      })
      .then(
        () => {
          setIsSearchable(true);
        },
        () => {
          setIsSearchable(false);
        }
      );

    const memberId = formData.getFieldValue(
      CREATE_ORDER_FORM_KEY_NAMES.hsMemberID
    );
    if (memberId?.trim()?.length > 4 && isMemberIdValid(memberId)) {
      setIsSearchable2(true);
    } else {
      setIsSearchable2(false);
    }

    if (
      searchPatientformData &&
      Object.keys(searchPatientformData)?.length > 0 &&
      patientRecordOrderStatus !== ORDER_STATUS.draft
    ) {
      const currentSearchValues = formData.getFieldsValue(
        SEARCH_PATIENT_FIELDS_NAME
      );
      currentSearchValues.dob =
        currentSearchValues?.dob &&
        dayjs(currentSearchValues?.dob).format(DATE_FORMAT_STARTING_FROM_YEAR);

      const traceChanges = patientDemographicsDataComparison(
        searchPatientformData,
        currentSearchValues
      );
      setSubmittable(!traceChanges);
    }

    const initialValues = formData.getFieldValue();
    dispatch(setTab1FormData(initialValues));
  }, [formValues, isSearchable]);

  useEffect(() => {
    if (searchResponse) {
      let {
        patientDemography: {
          id: patientId,
          firstName,
          lastName,
          dob,
          gender,
          hsMemberID,
          email,
          primaryPhoneNumber,
          secondaryPhoneNumber,
          preferredLanguage,
          address,
        },
      } = patientSearchData || {};

      formData.setFieldsValue({
        firstName,
        lastName,
        dob: dayjs(dob),
        gender,
        hsMemberID,
        email,
        primaryPhoneNumber,
        secondaryPhoneNumber,
        preferredLanguage,
        address,
      });
      dispatch(setMedicalHistoryTab(false));
      dispatch(setInsuranceInfoTab(false));
      dispatch(setOrderDetailsTab(false));
      dispatch(setPateintDocsTab(false));
      if (!isPatientDocsForEditCalled) {
        dispatch(
          getPatientDocumentsAtEdit({
            patientId,
            orderId: orderId ? orderId : patientSearchData?.id,
            orderTypeId: filterOrderTypeId(),
            isSecondaryInsurance: isSecondaryInsuranceAtSearch,
          })
        );
      }

      setSubmittable(true);
    } else {
      setSubmittable(false);
    }
  }, [searchResponse]);

  useEffect(() => {
    if (orderId && !searchResponse) {
      orderDetailsByOrderId(orderId);
    }
  }, [orderId]);

  const orderDetailsByOrderId = async (orderId) => {
    if (orderId) {
      dispatch(getOrderDetailsById(orderId));
    }
  };

  const showModal = () => {
    setOpen(true);
  };
  const handleOk = () => {
    message.destroy(1);
    setOpen(false);
    dispatch(resetCreateOrderDataBacktoInitialState());
    dispatch(setTab1FormData({}));
    dispatch(resetSearchPatientData());
    dispatch(resetOrderStateToInitialState());
    router.push('/order-management');
  };
  const handleCancel = () => {
    setOpen(false);
  };

  const onValuesChange = (changedValues) => {
    message.destroy(1);
    if (
      searchResponse ||
      (patientDemographicsData &&
        Object.keys(patientDemographicsData)?.length > 0)
    ) {
      const keys = Object.keys(changedValues);
      const changedKey = keys[0];
      if (changedKey === CREATE_ORDER_FORM_KEY_NAMES.dob) {
        changedValues.dob = dayjs(changedValues.dob).format(
          DATE_FORMAT_STARTING_FROM_YEAR
        );
      }
      const updatedPatientData = replaceNullWithEmptyString(
        patientDemographicsData
      );
      const updatedChangedValues = replaceNullWithEmptyString(changedValues);
      const traceChanges =
        updatedPatientData[changedKey] != updatedChangedValues[changedKey];
      setIsOnChangeTurned(traceChanges);
    }
  };

  useEffect(() => {
    if (Object.keys(patientDemographicsData)?.length > 0 && isOnChangeTurned) {
      dispatch(setMedicalHistoryTab(true));
      dispatch(setInsuranceInfoTab(true));
      dispatch(setPateintDocsTab(true));
      dispatch(setOrderDetailsTab(true));
    } else if (
      !isOnChangeTurned &&
      Object.keys(patientDemographicsData)?.length > 0
    ) {
      if (searchResponse) {
        dispatch(setInsuranceInfoTab(false));
        dispatch(setOrderDetailsTab(false));
        dispatch(setPateintDocsTab(false));
      }
      dispatch(setMedicalHistoryTab(false));
    }
  }, [isOnChangeTurned]);

  useEffect(() => {
    if (isPatientDocsForEditCalled) {
      const idsArrForMedicalAndInsurance = extractIdsFromNestedObjects(
        patientAllUploadedFilesData
      );
      dispatch(setMedicalUploadedFilesById(idsArrForMedicalAndInsurance));
      dispatch(setMedicalFilesAtEditById(idsArrForMedicalAndInsurance));

      const idsArrForPatientDocumentsTab = extractIdsFromNestedObjects(
        patientUploadedDocsData
      );
      dispatch(setPatientDocsFilesById(idsArrForPatientDocumentsTab));
    }
  }, [isPatientDocsForEditCalled]);

  return (
    <Form
      form={formData}
      name='create-order-patient-demographics'
      layout='vertical'
      autoComplete='off'
      preserve={true}
      onFinish={handleSubmitTab1Data}
      initialValues={tab1FormData}
      onValuesChange={onValuesChange}
    >
      <div>
        <div className='create-order-patient-demographics-container'>
          {patientSearchIsLoading && <CustomSpinner />}
          <Row>
            <Col>
              <p className='co-patient-demographics-note-text'>
                <i>
                  Note: Add First Name, Last Name, D.O.B & Gender or Member ID
                  to search the patient
                </i>
              </p>
              <h3 className='co-patient-demographics-order-type'>
                {orderType}
              </h3>
            </Col>
          </Row>
          <Row gutter={24} span={24}>
            <Col
              xs={{ span: 24 }}
              sm={{ span: 12 }}
              md={{ span: 12 }}
              lg={{ span: 6 }}
            >
              <Form.Item
                style={{ marginBottom: 0 }}
                label='Member ID'
                name={CREATE_ORDER_FORM_KEY_NAMES.hsMemberID}
                rules={CREATE_ORDER_FORM_FIELD_RULES.hsMemberID}
              >
                <Input
                  size='large'
                  placeholder='Enter Member ID'
                  className='co-tab1-form-item-width-manually bold-border'
                  disabled={patientRecordOrderStatus === ORDER_STATUS.draft}
                />
              </Form.Item>
            </Col>
          </Row>
          <Divider>OR</Divider>
          <Row gutter={24}>
            <Col
              xs={{ span: 24 }}
              sm={{ span: 12 }}
              md={{ span: 12 }}
              lg={{ span: 6 }}
            >
              <Form.Item
                label='First Name'
                name={CREATE_ORDER_FORM_KEY_NAMES.firstName}
                rules={CREATE_ORDER_FORM_FIELD_RULES.firstName}
              >
                <Input
                  size='large'
                  placeholder="Patient's First Name"
                  className='bold-border'
                  disabled={patientRecordOrderStatus === ORDER_STATUS.draft}
                />
              </Form.Item>
            </Col>

            <Col
              xs={{ span: 24 }}
              sm={{ span: 12 }}
              md={{ span: 12 }}
              lg={{ span: 6 }}
            >
              <Form.Item
                label='Last Name'
                name={CREATE_ORDER_FORM_KEY_NAMES.lastName}
                rules={CREATE_ORDER_FORM_FIELD_RULES.lastName}
              >
                <Input
                  size='large'
                  placeholder="Patient's Last Name"
                  className='bold-border'
                  disabled={patientRecordOrderStatus === ORDER_STATUS.draft}
                />
              </Form.Item>
            </Col>
            <Col
              xs={{ span: 24 }}
              sm={{ span: 12 }}
              md={{ span: 12 }}
              lg={{ span: 6 }}
            >
              <Form.Item
                label='Date Of Birth'
                name={CREATE_ORDER_FORM_KEY_NAMES.dob}
                rules={CREATE_ORDER_FORM_FIELD_RULES.dob}
              >
                <DatePicker
                  className='co-tab1-form-item-width-manually bold-border'
                  size='large'
                  placeholder="Patient's Date of Birth"
                  format={DATE_FORMAT_STARTING_FROM_MONTH}
                  disabledDate={handleDisabledDate}
                  disabled={patientRecordOrderStatus === ORDER_STATUS.draft}
                />
              </Form.Item>
            </Col>

            <Col
              xs={{ span: 24 }}
              sm={{ span: 12 }}
              md={{ span: 12 }}
              lg={{ span: 6 }}
            >
              <Form.Item
                label='Gender'
                name={CREATE_ORDER_FORM_KEY_NAMES.gender}
                rules={CREATE_ORDER_FORM_FIELD_RULES.gender}
              >
                <Select
                  size='large'
                  options={GENDER_OPTIONS}
                  placeholder='Select Gender'
                  disabled={patientRecordOrderStatus === ORDER_STATUS.draft}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24} span={24} justify='center' align='middle'>
            <Col>
              {patientRecordOrderStatus !== ORDER_STATUS.draft && (
                <Button
                  className={
                    isSearchable || isSearchable2
                      ? 'patient-search-btn large-button'
                      : 'disabled-patient-search-btn large-button'
                  }
                  icon={<AiOutlineSearch className='patient-search-icon' />}
                  size='large'
                  onClick={handleSearchPatient}
                  disabled={!(isSearchable || isSearchable2)}
                >
                  Search Patient
                </Button>
              )}
            </Col>
          </Row>
        </div>
        <div className='create-order-patient-demographics-container-2'>
          <Row gutter={24}>
            <Col
              xs={{ span: 24 }}
              sm={{ span: 12 }}
              md={{ span: 12 }}
              lg={{ span: 6 }}
            >
              <Form.Item
                label='Email'
                name={CREATE_ORDER_FORM_KEY_NAMES.email}
                rules={CREATE_ORDER_FORM_FIELD_RULES.email}
              >
                <Input size='large' placeholder='Enter Email ID' disabled />
              </Form.Item>
            </Col>
            <Col
              xs={{ span: 24 }}
              sm={{ span: 12 }}
              md={{ span: 12 }}
              lg={{ span: 6 }}
            >
              <Form.Item
                label='Member Cell Phone'
                name={CREATE_ORDER_FORM_KEY_NAMES.primaryPhoneNumber}
                rules={CREATE_ORDER_FORM_FIELD_RULES.number}
              >
                <InputNumber
                  className='co-tab1-form-item-width-manually'
                  size='large'
                  placeholder='Member Cell Phone'
                  formatter={(value) => formatPhoneNumberForInput(value)}
                  parser={(value) => value.replace(/\D/g, '')}
                  maxLength={14}
                  disabled
                />
              </Form.Item>
            </Col>

            <Col
              xs={{ span: 24 }}
              sm={{ span: 12 }}
              md={{ span: 12 }}
              lg={{ span: 6 }}
            >
              <Form.Item
                label='Member Home Phone'
                name={CREATE_ORDER_FORM_KEY_NAMES.secondaryPhoneNumber}
                rules={CREATE_ORDER_FORM_FIELD_RULES.number}
              >
                <InputNumber
                  className='co-tab1-form-item-width-manually'
                  size='large'
                  placeholder='Member Home Phone'
                  formatter={(value) => formatPhoneNumberForInput(value)}
                  parser={(value) => value.replace(/\D/g, '')}
                  maxLength={14}
                  disabled
                />
              </Form.Item>
            </Col>

            <Col
              xs={{ span: 24 }}
              sm={{ span: 12 }}
              md={{ span: 12 }}
              lg={{ span: 6 }}
            >
              <Form.Item
                label='Preferred Language'
                name={CREATE_ORDER_FORM_KEY_NAMES.preferredLanguage}
                validateStatus='validating'
                rules={CREATE_ORDER_FORM_FIELD_RULES.preferredLanguage}
              >
                <Input
                  size='large'
                  placeholder='Your Preferred Language'
                  disabled
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col
              xs={{ span: 24 }}
              sm={{ span: 12 }}
              md={{ span: 12 }}
              lg={{ span: 12 }}
            >
              <Form.Item
                label='Address'
                name={CREATE_ORDER_FORM_KEY_NAMES.address}
                rules={CREATE_ORDER_FORM_FIELD_RULES.address}
              >
                <TextArea
                  placeholder='Please Enter Full Address'
                  autoSize={{ minRows: 4, maxRows: 6 }}
                  disabled
                />
              </Form.Item>
            </Col>
          </Row>
        </div>
        <Form.Item>
          <Row className='co-all-tabs-btn-container'>
            <Col>
              <Button
                className='co-all-tabs-cancel-btn'
                size='large'
                onClick={showModal}
              >
                Cancel
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
      </div>

      {/* Modal Start from here */}

      <OrderModal
        title={<AiFillExclamationCircle color='red' size={45} />}
        open={open}
        handleOk={handleOk}
        handleCancel={handleCancel}
        modalText={ARE_YOU_SURE_WANT_TO_CANCEL_ORDER}
        okText={ORDER_MODAL_OK_TEXT}
        cancelText={ORDER_MODAL_CANCEL_TEXT}
      />
    </Form>
  );
};

export default PatientDemographics;
