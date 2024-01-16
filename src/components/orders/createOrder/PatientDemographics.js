import React, { useEffect, useState } from 'react';
import '../../../styles/orders/createOrder/patientDemographics.css';
import '../../../styles/orders/createOrder.css';
import {
  ARE_YOU_SURE_WANT_DRAFT_ORDER,
  ARE_YOU_SURE_WANT_TO_CANCEL_ORDER,
  CASE_ID,
  CREATE_NEW_RECORD_AT_PATIENT_DEMO,
  CREATE_ORDER_FORM_FIELD_RULES,
  CREATE_ORDER_FORM_KEY_NAMES,
  DATE_FORMAT_STARTING_FROM_MONTH,
  DATE_FORMAT_STARTING_FROM_YEAR,
  ORDER_MODAL_CANCEL_TEXT,
  ORDER_MODAL_OK_TEXT,
  ORDER_STATUS,
  SELECT_MANDATORY_FIELD_ERROR_MESSAGE,
} from '@/utils/constant.util';
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Spin,
  message,
} from 'antd';
import {
  AiFillExclamationCircle,
  AiOutlineSearch,
  AiOutlineUnorderedList,
} from 'react-icons/ai';
import TextArea from 'antd/es/input/TextArea';
import { useDispatch, useSelector } from 'react-redux';
import {
  resetCreateOrderDataBacktoInitialState,
  setCurrentSelectedTab,
  setInsuranceInfoTab,
  setMedicalHistoryTab,
  setPateintDocsTab,
} from '@/store/createOrderFormSlice';
import {
  postPatientDemographicsData,
  searchPatientRecordData,
  orderSaveAsDraft,
  setTab1FormData,
  setDisplaySearchModal,
  getPatientDocumentsAtEdit,
  getOrderDetailsById,
  updateOrderData,
  setSearchResponse,
  resetSearchPatientData,
  resetOrderStateToInitialState,
} from '@/store/orderSlice';
import CustomTable from '@/components/customTable/CustomTable';
import { TABLE_FOR_DISPLAYING_SEARCHED_PATIENT } from '@/utils/columns';
import { replaceMultipleSpacesWithSingleSpace } from '@/utils/patterns';
import { useRouter } from 'next/router';
import OrderModal from './OrderModal';
import dayjs from 'dayjs';
import {
  allowDigitsOnly,
  formatPhoneNumberForInput,
  patientDemographicsDataComparison,
  replaceNullWithEmptyString,
} from '@/utils/commonFunctions';
import { GENDER_OPTIONS } from '@/utils/options';

const PatientDemographics = () => {
  const router = useRouter();
  const { orderId } = router.query;
  const [formData] = Form.useForm();
  const formValues = Form.useWatch([], formData);
  const [submittable, setSubmittable] = useState(false);
  const [isSearchable, setIsSearchable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState(ARE_YOU_SURE_WANT_TO_CANCEL_ORDER);
  const [isDraftModal, setIsDraftModal] = useState(false);
  const [isOnChangeTurned, setIsOnChangeTurned] = useState(false);

  const dispatch = useDispatch();
  const tab1FormData = useSelector((state) => state.allOrdersData.tab1FormData);
  const displaySearchModal = useSelector(
    (state) => state.allOrdersData.displaySearchModal
  );
  const patientSearchData = useSelector(
    (state) => state.allOrdersData.patientRecordSearchData
  );
  const searchResponse = useSelector(
    (state) => state.allOrdersData.patientSearchResponse
  );
  const patientDemographicsData = useSelector(
    (state) => state.allOrdersData.patientDemographicsData
  );
  const isNewPatientCreated = useSelector(
    (state) => state.allOrdersData.isNewPatientCreated
  );
  const createHistoryOrInsurance = useSelector(
    (state) => state.allOrdersData.createHistoryOrInsurance
  );
  const patientDemoId = useSelector((state) => state.allOrdersData.patientId);
  const medicalHistoryId = useSelector(
    (state) => state.allOrdersData.medicalHistoryId
  );
  const medicalRecordId = useSelector(
    (state) => state.allOrdersData.medicalRecordId
  );
  const insuranceInfoId = useSelector(
    (state) => state.allOrdersData.insuranceInfoId
  );
  const medicalUploadedFilesById = useSelector(
    (state) => state.allOrdersData.medicalUploadedFilesById
  );
  const patientDocsFilesById = useSelector(
    (state) => state.allOrdersData.patientDocsFilesById
  );
  const handleDisabledDate = (current) => {
    return current && current > dayjs().startOf('day');
  };

  const handleSearchPatient = () => {
    const initValues = formData.getFieldValue();
    const { firstName, lastName, dob, gender, mrn } = initValues;
    const dateOfBirth = dayjs(dob).format(DATE_FORMAT_STARTING_FROM_YEAR);
    if (
      !firstName ||
      !lastName ||
      !dob ||
      !gender ||
      !mrn ||
      firstName?.trim() === '' ||
      lastName?.trim() === '' ||
      dateOfBirth?.trim() === '' ||
      gender?.trim() === ''
    ) {
      return message.info(SELECT_MANDATORY_FIELD_ERROR_MESSAGE);
    }
    const payload = { firstName, lastName, dob: dateOfBirth, gender, mrn };
    dispatch(searchPatientRecordData(payload))
      .then((res) => {
        if (res?.payload?.status) {
        } else {
          message.info(
            res?.payload?.message + CREATE_NEW_RECORD_AT_PATIENT_DEMO
          );
        }
      })
      .catch((err) => {
        message.error(err);
      });
  };

  const handleSearchDetailsAdd = async (order, orderDetail = false) => {
    let {
      patientDemography: {
        id: patientId,
        primaryPhoneNumber,
        email,
        secondaryPhoneNumber,
        preferredLanguage,
        address,
        mrn,
        race,
        firstName,
        lastName,
        dob,
        gender,
      },
    } = orderDetail ? order : patientSearchData || {};

    formData.setFieldsValue({
      firstName,
      lastName,
      dob: dayjs(dob),
      gender,
      mrn,
      primaryPhoneNumber,
      secondaryPhoneNumber,
      email,
      preferredLanguage,
      race,
      address,
    });
    if (patientSearchData?.id && !orderDetail) {
      router.push(`/order-management/create?orderId=${patientSearchData?.id}`);
    }
    dispatch(setDisplaySearchModal(false));
    dispatch(setMedicalHistoryTab(false));
    dispatch(setInsuranceInfoTab(false));
    dispatch(setPateintDocsTab(false));
    dispatch(getPatientDocumentsAtEdit({ patientId, orderId }));
  };

  const handleSubmitTab1Data = (values) => {
    let traceChanges = false;
    values.dob = dayjs(values.dob).format(DATE_FORMAT_STARTING_FROM_YEAR);
    values.firstName = replaceMultipleSpacesWithSingleSpace(values.firstName);
    values.lastName = replaceMultipleSpacesWithSingleSpace(values.lastName);
    values.gender = replaceMultipleSpacesWithSingleSpace(values.gender);
    values.address = replaceMultipleSpacesWithSingleSpace(values.address);
    if (
      searchResponse ||
      (patientDemographicsData &&
        Object.keys(patientDemographicsData)?.length > 0)
    ) {
      traceChanges = patientDemographicsDataComparison(
        patientDemographicsData,
        values
      );
    }
    if (!searchResponse || traceChanges) {
      if (orderId) {
        values.orderId = orderId;
      }
      if (patientDemographicsData?.id) {
        values.patientId = patientDemographicsData?.id;
      }
      if (!values.email) {
        delete values.email;
      }
      dispatch(postPatientDemographicsData(values)).then((res) => {
        if (res?.payload?.status) {
          message.success(res?.payload?.message);
          dispatch(setMedicalHistoryTab(false));
          dispatch(setSearchResponse(true));
          dispatch(setCurrentSelectedTab('medicalHistory'));
          if (searchResponse) {
            dispatch(setInsuranceInfoTab(false));
            dispatch(setPateintDocsTab(false));
          }
        } else {
          message.info(res?.payload?.message);
        }
      });
    } else {
      dispatch(setMedicalHistoryTab(false));
      dispatch(setCurrentSelectedTab('medicalHistory'));
    }
  };

  const validateAddressField = (str) => {
    return typeof str === 'string' && str?.trim().length > 0;
  };

  const validateMRNNumber = (numString) => {
    return typeof numString === 'number'
      ? numString?.toString()?.trim()?.length > 0
      : numString?.trim()?.length > 0;
  };

  useEffect(() => {
    formData
      .validateFields(['firstName', 'lastName', 'dob', 'gender', 'mrn'], {
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

    const addressField = formData.getFieldValue(
      CREATE_ORDER_FORM_KEY_NAMES.address
    );
    const mrnNumberField = formData.getFieldValue(
      CREATE_ORDER_FORM_KEY_NAMES.mrn
    );
    if (isSearchable) {
      if (
        validateAddressField(addressField) &&
        validateMRNNumber(mrnNumberField)
      ) {
        setSubmittable(true);
      } else {
        setSubmittable(false);
      }
    } else if (!isSearchable) {
      setSubmittable(false);
    }
    const initialValues = formData.getFieldValue();
    dispatch(setTab1FormData(initialValues));
  }, [formValues, isSearchable]);

  useEffect(() => {
    if (orderId && !isNewPatientCreated && createHistoryOrInsurance) {
      orderDetailsByOrderId(orderId);
    }
  }, [orderId]);

  const orderDetailsByOrderId = async (orderId) => {
    if (orderId) {
      const order = await dispatch(getOrderDetailsById(orderId));
      await handleSearchDetailsAdd(order?.payload?.data, true);
    }
  };

  const saveOrderAsDraft = async () => {
    let traceChanges = false;
    setLoading(true);
    const newValues = {
      ...tab1FormData,
      dob: dayjs(tab1FormData?.dob?.$d).format(DATE_FORMAT_STARTING_FROM_YEAR),
    };
    // here we will identify that if the user has changed any value in the form
    if (searchResponse) {
      const updatedPatientData = replaceNullWithEmptyString(
        patientDemographicsData
      );
      const updatedFormValue = replaceNullWithEmptyString(newValues);

      traceChanges = Object.keys({
        ...updatedFormValue,
        ...updatedPatientData,
      }).some(
        (key) =>
          (updatedFormValue[key] === undefined &&
            updatedPatientData[key] === undefined) ||
          (updatedFormValue[key] !== undefined &&
            updatedPatientData[key] !== undefined &&
            updatedFormValue[key] != updatedPatientData[key])
      );
    }
    let patientId = patientDemographicsData?.id;
    if (!searchResponse || traceChanges) {
      if (!newValues.email) {
        delete newValues.email;
      }
      if (orderId) {
        newValues.orderId = orderId;
      }
      if (patientDemographicsData?.id) {
        newValues.patientId = patientDemographicsData?.id;
      }
      const patient = await dispatch(postPatientDemographicsData(newValues));

      if (patient?.payload?.status) {
        patientId = patient?.payload?.data?.id;
      } else {
        message.info(patient?.payload?.message);
        setLoading(false);
        return;
      }
    }
    let order;
    if (orderId) {
      const payload = {
        patientId: patientId ? patientId : patientDemoId,
        historyId: medicalHistoryId ? medicalHistoryId : null,
        insuranceId: insuranceInfoId ? insuranceInfoId : null,
        recordId: medicalRecordId ? medicalRecordId : null,
        uploadFiles: medicalUploadedFilesById,
        orderAuthDocuments: patientDocsFilesById,
      };
      order = await dispatch(updateOrderData({ orderId, payload }));
    } else {
      order = await dispatch(
        orderSaveAsDraft({
          caseId: CASE_ID,
          patientId: patientId ? patientId : patientDemoId,
          historyId: medicalHistoryId ? medicalHistoryId : null,
          insuranceId: insuranceInfoId ? insuranceInfoId : null,
          recordId: medicalRecordId ? medicalRecordId : null,
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
      setLoading(false);
      router.push('/order-management');
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

  const onValuesChange = (changedValues, allValues) => {
    if (
      searchResponse ||
      (patientDemographicsData &&
        Object.keys(patientDemographicsData)?.length > 0)
    ) {
      const keys = Object.keys(changedValues);
      const changedKey = keys[0];
      changedKey === CREATE_ORDER_FORM_KEY_NAMES.dob
        ? (changedValues.dob = dayjs(changedValues.dob).format(
            DATE_FORMAT_STARTING_FROM_YEAR
          ))
        : '';
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
    if (isOnChangeTurned && Object.keys(patientDemographicsData)?.length > 0) {
      dispatch(setMedicalHistoryTab(true));
      dispatch(setInsuranceInfoTab(true));
      dispatch(setPateintDocsTab(true));
    } else {
      dispatch(setMedicalHistoryTab(false));
      dispatch(setInsuranceInfoTab(false));
      dispatch(setPateintDocsTab(false));
    }
  }, [isOnChangeTurned]);

  return (
    <div className='create-order-patient-demographics-container'>
      {loading && <Spin fullscreen></Spin>}
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
        <Row span={24} gutter={24}>
          <Col
            xs={{ span: 24 }}
            sm={{ span: 12 }}
            md={{ span: 12 }}
            lg={{ span: 8 }}
          >
            <Form.Item
              label='First Name'
              name={CREATE_ORDER_FORM_KEY_NAMES.firstName}
              rules={CREATE_ORDER_FORM_FIELD_RULES.firstName}
            >
              <Input size='large' placeholder="Patient's First Name" />
            </Form.Item>
          </Col>

          <Col
            xs={{ span: 24 }}
            sm={{ span: 12 }}
            md={{ span: 12 }}
            lg={{ span: 8 }}
          >
            <Form.Item
              label='Last Name'
              name={CREATE_ORDER_FORM_KEY_NAMES.lastName}
              rules={CREATE_ORDER_FORM_FIELD_RULES.lastName}
            >
              <Input size='large' placeholder="Patient's Last Name" />
            </Form.Item>
          </Col>
          <Col
            xs={{ span: 24 }}
            sm={{ span: 12 }}
            md={{ span: 12 }}
            lg={{ span: 8 }}
          >
            <Form.Item
              label='Date Of Birth'
              name={CREATE_ORDER_FORM_KEY_NAMES.dob}
              rules={CREATE_ORDER_FORM_FIELD_RULES.dob}
            >
              <DatePicker
                className='co-tab1-form-item-width-manually'
                size='large'
                placeholder="Patient's Date of Birth"
                format={DATE_FORMAT_STARTING_FROM_MONTH}
                disabledDate={handleDisabledDate}
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
              label='Gender'
              name={CREATE_ORDER_FORM_KEY_NAMES.gender}
              rules={CREATE_ORDER_FORM_FIELD_RULES.gender}
            >
              {/* <Input size='large' placeholder="Patient's Gender" /> */}
              <Select
                size='large'
                options={GENDER_OPTIONS}
                placeholder='Select Gender'
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
              label='MRN Number'
              name={CREATE_ORDER_FORM_KEY_NAMES.mrn}
              rules={CREATE_ORDER_FORM_FIELD_RULES.mrn}
            >
              <InputNumber
                size='large'
                placeholder='Enter MRN Number'
                className='co-tab1-form-item-width-manually'
              />
            </Form.Item>
          </Col>

          <Col
            xs={{ span: 24 }}
            sm={{ span: 12 }}
            md={{ span: 12 }}
            lg={{ span: 8 }}
          >
            {!orderId && (
              <Button
                className={
                  isSearchable
                    ? 'patient-search-btn'
                    : 'disabled-patient-search-btn'
                }
                icon={<AiOutlineSearch className='patient-search-icon' />}
                size='large'
                onClick={handleSearchPatient}
                disabled={!isSearchable}
              >
                Search Patient
              </Button>
            )}
          </Col>

          <Col
            xs={{ span: 24 }}
            sm={{ span: 12 }}
            md={{ span: 12 }}
            lg={{ span: 8 }}
          >
            <Form.Item
              label='Email'
              name={CREATE_ORDER_FORM_KEY_NAMES.email}
              rules={CREATE_ORDER_FORM_FIELD_RULES.email}
            >
              <Input size='large' placeholder='Enter Email ID' />
            </Form.Item>
          </Col>

          <Col
            xs={{ span: 24 }}
            sm={{ span: 12 }}
            md={{ span: 12 }}
            lg={{ span: 8 }}
          >
            <Form.Item
              label='Primary Phone Number'
              name={CREATE_ORDER_FORM_KEY_NAMES.primaryPhoneNumber}
              rules={CREATE_ORDER_FORM_FIELD_RULES.number}
            >
              <InputNumber
                className='co-tab1-form-item-width-manually'
                size='large'
                placeholder='Primary Phone Number'
                formatter={(value) => formatPhoneNumberForInput(value)}
                parser={(value) => value.replace(/\D/g, '')}
                maxLength={14}
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
              label='Secondary Phone Number'
              name={CREATE_ORDER_FORM_KEY_NAMES.secondaryPhoneNumber}
              rules={CREATE_ORDER_FORM_FIELD_RULES.number}
            >
              <InputNumber
                step={null}
                className='co-tab1-form-item-width-manually'
                size='large'
                placeholder='Secondary Phone Number'
                onKeyDown={allowDigitsOnly}
                formatter={(value) => formatPhoneNumberForInput(value)}
                parser={(value) => value.replace(/\D/g, '')}
                maxLength={14}
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
              label='Preferred Language'
              name={CREATE_ORDER_FORM_KEY_NAMES.preferredLanguage}
              validateStatus='validating'
              rules={CREATE_ORDER_FORM_FIELD_RULES.preferredLanguage}
            >
              <Input size='large' placeholder='Your Preferred Language' />
            </Form.Item>
          </Col>

          <Col
            xs={{ span: 24 }}
            sm={{ span: 12 }}
            md={{ span: 12 }}
            lg={{ span: 8 }}
          >
            <Form.Item
              label='Race'
              name={CREATE_ORDER_FORM_KEY_NAMES.race}
              validateStatus='validating'
              rules={CREATE_ORDER_FORM_FIELD_RULES.race}
            >
              <Input size='large' placeholder='Race' />
            </Form.Item>
          </Col>

          <Col
            xs={{ span: 24 }}
            sm={{ span: 12 }}
            md={{ span: 12 }}
            lg={{ span: 8 }}
          >
            <Form.Item
              label='Address'
              name={CREATE_ORDER_FORM_KEY_NAMES.address}
              rules={CREATE_ORDER_FORM_FIELD_RULES.address}
            >
              <TextArea
                placeholder='Please Enter Full Address'
                autoSize={{ minRows: 4, maxRows: 6 }}
              />
            </Form.Item>
          </Col>
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

      {/* Modal Start from here */}
      <Modal
        open={displaySearchModal}
        title='Patient Details'
        footer={false}
        closable={false}
        width={'90%'}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
        transitionName=''
      >
        <CustomTable
          rowKey='id'
          rows={[patientDemographicsData]}
          columns={TABLE_FOR_DISPLAYING_SEARCHED_PATIENT}
          pagination={false}
        />
        <Row className='co-modal-add-btn-container'>
          <Button
            size='large'
            className='co-modal-add-btn'
            onClick={handleSearchDetailsAdd}
          >
            Add
          </Button>
        </Row>
      </Modal>
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

export default PatientDemographics;
