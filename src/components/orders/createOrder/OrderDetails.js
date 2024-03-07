import React, { useEffect, useState } from 'react';
import '../../../styles/orders/createOrder/orderDetails.css';
import CustomSpinner from '@/components/CustomSpinner';
import { Button, Col, Form, Input, Row, Select, Tooltip, message } from 'antd';
import { useRouter } from 'next/router';
import {
  ARE_YOU_SURE_WANT_DRAFT_ORDER,
  ARE_YOU_SURE_WANT_TO_CANCEL_ORDER,
  BTN_TEXT_FOR_DRAFT_IN_LOWER_CASE,
  BTN_TEXT_FOR_NEXT_IN_LOWER_CASE,
  CASE_ID,
  CHEMO_ORDER_TYPE,
  CPT_CODE_DESCRIPTION_MAX_LENGTH,
  CREATE_ORDER_FORM_FIELD_RULES,
  CREATE_ORDER_FORM_KEY_NAMES,
  MAX_CPT_CODE_TO_BE_UPLOADED,
  MAX_CPT_CODE_UPLOAD_WARNING,
  ORDER_MODAL_CANCEL_TEXT,
  ORDER_MODAL_OK_TEXT,
  ORDER_STATUS,
  PLEASE_FILL_INSURANCE_INFO_TAB,
  PLEASE_FILL_MEDICAL_HISTORY_AND_RECORD_TAB,
  PLEASE_SELECT_ONE_CPT_CODE,
  THIS_CPT_CODE_ALREADY_EXIST,
} from '@/utils/constant.util';
import { useDispatch, useSelector } from 'react-redux';
import {
  setSelectedCptCodeData,
  setCptCodeSearchedStr,
  setOrderDetailsTab,
  setPatientDemographicsTab,
  setMedicalHistoryTab,
  setInsuranceInfoTab,
  setPateintDocsTab,
  setCurrentSelectedTab,
  resetCreateOrderDataBacktoInitialState,
} from '@/store/createOrderFormSlice';
import {
  AiFillExclamationCircle,
  AiOutlinePlus,
  AiOutlineUnorderedList,
} from 'react-icons/ai';
import CustomTable from '@/components/customTable/CustomTable';
import {
  getCptCodeDescriptionByCode,
  orderSaveAsDraft,
  postOrderDetailsData,
  resetOrderStateToInitialState,
  setCptCodeInternalDataArray,
  setCptCodeOptionsArrEmpty,
  setCptCodesArrayOfId,
  updateOrderData,
} from '@/store/orderSlice';
import {
  TABLE_FOR_CPT_CODES_AT_ORDER_DETAILS_CHEMO,
  TABLE_FOR_CPT_CODES_AT_ORDER_DETAILS_TAB,
} from '@/utils/columns';
import OrderModal from './OrderModal';
import {
  customizedStringFunc,
  orderDetailsArrayComparisonFunc,
} from '@/utils/commonFunctions';

const OrderDetails = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { orderId, type: orderType } = router.query;

  const searchResponse = useSelector(
    (state) => state.allOrdersData.patientSearchResponse
  );
  const patientSearchData = useSelector(
    (state) => state.allOrdersData.patientRecordSearchData
  );

  const patientId = useSelector((state) => state.allOrdersData.patientId);

  const medicalHistoryOnly = useSelector(
    (state) => state.allOrdersData.medicalHistoryOnly
  );
  const medicalRecordOnly = useSelector(
    (state) => state.allOrdersData.medicalRecordOnly
  );
  const insuranceInfoData = useSelector(
    (state) => state.allOrdersData.insuranceInfoData || {}
  );

  const cptCodeSearchedStr = useSelector(
    (state) => state.createOrderTabs.cptCodeSearchedStr
  );
  const cptCodeOptionsArr =
    useSelector((state) => state.allOrdersData.cptCodeOptionsArr) || [];

  const selectedCptCodeData = useSelector(
    (state) => state.createOrderTabs.selectedCptCodeData
  );

  const cptCodeInternalDataArray =
    useSelector((state) => state.allOrdersData.cptCodeInternalDataArray) || [];

  const cptCodesArrayOfId = useSelector(
    (state) => state.allOrdersData.cptCodesArrayOfId
  );
  const cptCodeArrOfIdForEdit = useSelector(
    (state) => state.allOrdersData.cptCodeArrOfIdForEdit
  );

  const orderDetailsData =
    useSelector((state) => state.allOrdersData.orderDetailsData) || {};

  // Uploaded Files Data
  const medicalUploadedFilesById = useSelector(
    (state) => state.allOrdersData.medicalUploadedFilesById
  );
  const patientDocsFilesById = useSelector(
    (state) => state.allOrdersData.patientDocsFilesById
  );

  // Order Type Array
  const orderTypeList =
    useSelector((state) => state.allOrdersData.orderTypeList) || [];

  const [formData] = Form.useForm();
  const formValues = Form.useWatch([], formData);
  const [submittable, setSubmittable] = useState(false);
  const [enableNextBtn, setEnableNextBtn] = useState(false);
  const [modalText, setModalText] = useState(ARE_YOU_SURE_WANT_TO_CANCEL_ORDER);
  const [isDraftModal, setIsDraftModal] = useState(false);
  const [isCancelModal, setIsCancelModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cptCodeSelectOptions, setCptCodeSelectOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const checkForDuplicationInCptCode = (value) => {
    const isDuplicateCptCode = cptCodeInternalDataArray?.some(
      (elem) => elem?.id === value
    );
    return isDuplicateCptCode;
  };

  const validateCptCodeSelection = (_, value) => {
    if (!value) {
      return Promise.reject();
    }
    if (checkForDuplicationInCptCode(value)) {
      return Promise.reject(THIS_CPT_CODE_ALREADY_EXIST);
    } else {
      return Promise.resolve();
    }
  };

  const handleChangeForCptData = (_, obj) => {
    if (checkForDuplicationInCptCode(obj?.value)) {
      dispatch(setSelectedCptCodeData({}));
      return message.info(THIS_CPT_CODE_ALREADY_EXIST);
    }
    const payload = {
      id: obj?.value,
      description: obj?.description,
      cptCode: obj?.cptCode,
    };
    dispatch(setSelectedCptCodeData(payload));
  };

  const submitCptCodeData = (values) => {
    if (checkForDuplicationInCptCode(values?.cptCode)) {
      return message.info(THIS_CPT_CODE_ALREADY_EXIST);
    }
    if (cptCodeInternalDataArray?.length === MAX_CPT_CODE_TO_BE_UPLOADED) {
      return message(MAX_CPT_CODE_UPLOAD_WARNING);
    }
    const { cptCode, ...restValues } = values;
    const updatedCptCodesArrayOfId = [...cptCodesArrayOfId, values?.cptCode];
    dispatch(setCptCodesArrayOfId(updatedCptCodesArrayOfId));
    const payload = { ...selectedCptCodeData, ...restValues };
    dispatch(
      setCptCodeInternalDataArray([payload, ...cptCodeInternalDataArray])
    );
    dispatch(setSelectedCptCodeData({}));
    dispatch(setCptCodeOptionsArrEmpty());
    formData.resetFields();
    formData.setFieldsValue({
      cptCode: null,
    });
  };

  const handleEditOfTheCptCode = (objData) => {
    const { id } = objData;
    if (cptCodesArrayOfId?.length > 0) {
      const updatedCptCodesArr = cptCodesArrayOfId?.filter(
        (elem) => elem !== id
      );
      dispatch(setCptCodesArrayOfId(updatedCptCodesArr));
    }
    const updatedCptCodeInternalArr = cptCodeInternalDataArray?.filter(
      (elem) => elem?.id !== id
    );
    dispatch(setCptCodeInternalDataArray(updatedCptCodeInternalArr));
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
      case !insuranceInfoData?.id:
        return PLEASE_FILL_INSURANCE_INFO_TAB;
      default:
        return false;
    }
  };

  const submitOrderDetailsTabData = async (e) => {
    if (cptCodeInternalDataArray?.length < 1 && !isCancelModal) {
      return message.error(PLEASE_SELECT_ONE_CPT_CODE);
    }
    let response;
    let orderDetailsId = orderDetailsData?.id;
    const typeOfSubmission = e?.target?.textContent;
    const payload = {
      patientId,
      cptCodes: cptCodeInternalDataArray,
    };
    if (orderId) {
      payload.orderId = orderId;
    }
    if (orderDetailsId) {
      payload.orderDetailsId = orderDetailsId;
    }
    const { id: historyId } = medicalHistoryOnly || {};
    const { id: recordId } = medicalRecordOnly || {};
    const { id: insuranceId } = insuranceInfoData || {};

    const isChangesOccur = orderDetailsArrayComparisonFunc(
      cptCodeArrOfIdForEdit,
      cptCodesArrayOfId
    );

    if (typeOfSubmission?.toLowerCase() === BTN_TEXT_FOR_NEXT_IN_LOWER_CASE) {
      if (isChangesOccur || Object.keys(orderDetailsData)?.length === 0) {
        // When  changes are occured in Order Details Tab.

        await dispatch(postOrderDetailsData(payload)).then((res) => {
          if (res?.payload?.status) {
            message.success(res?.payload?.message);
            dispatch(setSelectedCptCodeData({}));
            dispatch(setCptCodeOptionsArrEmpty());
            formData.resetFields();
            formData.setFieldsValue({
              cptCode: null,
            });
          } else {
            return message.error(res?.payload?.message);
          }
        });
      }
      dispatch(setPatientDemographicsTab(false));
      dispatch(setMedicalHistoryTab(false));
      dispatch(setInsuranceInfoTab(false));
      dispatch(setOrderDetailsTab(false));
      dispatch(setPateintDocsTab(false));
      dispatch(setCurrentSelectedTab('patientDocuments'));
      return;
    } else if (
      typeOfSubmission?.toLowerCase() === BTN_TEXT_FOR_DRAFT_IN_LOWER_CASE
    ) {
      if (isDraftModal) {
        setIsModalOpen(false);

        const isAllTabCreated = handleAllTabCreated();
        if (isAllTabCreated) {
          return message.error(isAllTabCreated);
        }

        if (isChangesOccur || !patientSearchData?.orderDetails) {
          await dispatch(postOrderDetailsData(payload)).then((res) => {
            if (res?.payload?.status) {
              orderDetailsId = res?.payload?.data?.id;
            } else {
              return message.error(res?.payload?.message);
            }
          });
        }

        payload.historyId = historyId;
        payload.recordId = recordId;
        payload.insuranceId = insuranceId;
        payload.uploadFiles = medicalUploadedFilesById;
        payload.orderAuthDocuments = patientDocsFilesById;
        payload.orderDetailsId = orderDetailsId;
        payload.orderTypeId = filterOrderTypeId();

        if (orderId) {
          response = await dispatch(updateOrderData({ orderId, payload }));
        } else {
          payload.caseId = CASE_ID;
          payload.currentStatus = ORDER_STATUS.draft;
          response = await dispatch(orderSaveAsDraft(payload));
        }

        if (response?.payload?.status) {
          message.success(response?.payload?.message);
        } else {
          return message.error(response?.payload?.message);
        }
      }
      setIsDraftModal(false);
      setIsCancelModal(false);
      dispatch(resetCreateOrderDataBacktoInitialState());
      dispatch(resetOrderStateToInitialState());
      router.push('/order-management');
    }
  };

  const displayModal = (orderStatus) => {
    if (orderStatus === ORDER_STATUS.draft) {
      setIsDraftModal(true);
      setIsCancelModal(false);
      setModalText(ARE_YOU_SURE_WANT_DRAFT_ORDER);
    } else if (orderStatus === ORDER_STATUS.cancel) {
      setIsDraftModal(false);
      setIsCancelModal(true);
      setModalText(ARE_YOU_SURE_WANT_TO_CANCEL_ORDER);
    }
    setIsModalOpen(true);
  };

  useEffect(() => {
    if (cptCodesArrayOfId?.length > 0) {
      const newOptionsArr = cptCodeOptionsArr?.filter(
        (elem) => !cptCodesArrayOfId?.includes(elem?.value)
      );
      setCptCodeSelectOptions(newOptionsArr);
    } else {
      setCptCodeSelectOptions(cptCodeOptionsArr);
    }
  }, [cptCodeOptionsArr?.length, cptCodesArrayOfId?.length]);

  useEffect(() => {
    if (cptCodeInternalDataArray?.length > 0) {
      setEnableNextBtn(true);
    } else {
      setEnableNextBtn(false);
    }
  }, [cptCodeInternalDataArray?.length]);

  useEffect(() => {
    if (cptCodeSearchedStr?.trim()?.length > 2) {
      dispatch(getCptCodeDescriptionByCode(cptCodeSearchedStr));
    }
  }, [cptCodeSearchedStr]);

  useEffect(() => {
    formData.validateFields({ validateOnly: true }).then(
      () => {
        setSubmittable(true);
      },
      () => {
        setSubmittable(false);
      }
    );
  }, [formValues]);

  useEffect(() => {
    const isChangesOccur = orderDetailsArrayComparisonFunc(
      cptCodeArrOfIdForEdit,
      cptCodesArrayOfId
    );

    if (
      (selectedCptCodeData?.id &&
        Object.keys(selectedCptCodeData)?.length > 0) ||
      isChangesOccur
    ) {
      dispatch(setPatientDemographicsTab(true));
      dispatch(setMedicalHistoryTab(true));
      dispatch(setInsuranceInfoTab(true));
      dispatch(setPateintDocsTab(true));
    } else if (!isChangesOccur) {
      dispatch(setPatientDemographicsTab(false));
      dispatch(setMedicalHistoryTab(false));
      dispatch(setInsuranceInfoTab(false));
      dispatch(setPateintDocsTab(false));
    }
  }, [
    selectedCptCodeData,
    cptCodeInternalDataArray?.length,
    cptCodesArrayOfId?.length,
  ]);

  return (
    <div className='co-order-details-tab-container'>
      {false && <CustomSpinner />}
      <Col>
        <h3 className='co-order-details-order-type'>{orderType}</h3>
        {cptCodeInternalDataArray?.length === MAX_CPT_CODE_TO_BE_UPLOADED && (
          <p className='display-cpt-code-max-length-warning'>
            <span className='warning-text-heading'>Note:</span>{' '}
            {MAX_CPT_CODE_UPLOAD_WARNING}
          </p>
        )}
      </Col>

      <Form
        form={formData}
        name='create-order-order-details-tab'
        layout='vertical'
        autoComplete='off'
        preserve
        onFinish={submitCptCodeData}
        initialValues={selectedCptCodeData}
      >
        <Row span={24} gutter={24}>
          <Col
            xs={{ span: 24 }}
            sm={{ span: 12 }}
            md={{ span: 12 }}
            lg={{ span: orderType === CHEMO_ORDER_TYPE ? 7 : 8 }}
          >
            <Form.Item
              label='CPT Code'
              name={CREATE_ORDER_FORM_KEY_NAMES.cptCode}
              rules={[
                ...CREATE_ORDER_FORM_FIELD_RULES.cptCode,
                { validator: validateCptCodeSelection },
              ]}
            >
              <Select
                size='large'
                placeholder='Search & Select CPT Code'
                showSearch
                defaultActiveFirstOption={false}
                filterOption={false}
                onSearch={(value) => dispatch(setCptCodeSearchedStr(value))}
                onChange={handleChangeForCptData}
                notFoundContent={null}
                options={cptCodeSelectOptions}
                disabled={
                  cptCodeInternalDataArray?.length ===
                  MAX_CPT_CODE_TO_BE_UPLOADED
                }
                dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
              />
            </Form.Item>

            {selectedCptCodeData?.description && (
              <Tooltip
                placement='bottom'
                title={
                  selectedCptCodeData?.description?.length >
                    CPT_CODE_DESCRIPTION_MAX_LENGTH &&
                  selectedCptCodeData?.description
                }
              >
                <h3
                  style={
                    selectedCptCodeData?.description
                      ? { marginTop: '-18px' }
                      : {}
                  }
                  className='display-cpt-code-description-at-od'
                >
                  {customizedStringFunc(
                    selectedCptCodeData?.description,
                    CPT_CODE_DESCRIPTION_MAX_LENGTH
                  )}
                </h3>
              </Tooltip>
            )}
          </Col>

          {selectedCptCodeData?.description && (
            <Col
              xs={{ span: 24 }}
              sm={{ span: 12 }}
              md={{ span: 12 }}
              lg={{ span: orderType === CHEMO_ORDER_TYPE ? 7 : 8 }}
            >
              <Form.Item
                label='Dose/Unit'
                name={CREATE_ORDER_FORM_KEY_NAMES.dose}
                rules={CREATE_ORDER_FORM_FIELD_RULES.dose}
              >
                <Input size='large' placeholder='Enter Dose' />
              </Form.Item>
            </Col>
          )}

          {selectedCptCodeData?.description &&
            orderType !== CHEMO_ORDER_TYPE && (
              <Col
                xs={{ span: 24 }}
                sm={{ span: 12 }}
                md={{ span: 12 }}
                lg={{ span: orderType === CHEMO_ORDER_TYPE ? 7 : 8 }}
              >
                <Form.Item>
                  <Button
                    size='large'
                    className='add-cpt-code-details-btn'
                    disabled={!submittable}
                    htmlType='submit'
                  >
                    <AiOutlinePlus className='add-cpt-code-details-btn-icon' />
                  </Button>
                </Form.Item>
              </Col>
            )}
        </Row>

        {orderType === CHEMO_ORDER_TYPE && selectedCptCodeData?.description && (
          <Row span={24} gutter={24}>
            <Col
              xs={{ span: 24 }}
              sm={{ span: 12 }}
              md={{ span: 12 }}
              lg={{ span: 7 }}
            >
              <Form.Item
                label='Route'
                name={CREATE_ORDER_FORM_KEY_NAMES.route}
                rules={CREATE_ORDER_FORM_FIELD_RULES.route}
              >
                <Input size='large' placeholder='Enter Route' />
              </Form.Item>
            </Col>

            <Col
              xs={{ span: 24 }}
              sm={{ span: 12 }}
              md={{ span: 12 }}
              lg={{ span: 7 }}
            >
              <Form.Item
                label='Frequency'
                name={CREATE_ORDER_FORM_KEY_NAMES.frequency}
                rules={CREATE_ORDER_FORM_FIELD_RULES.frequency}
              >
                <Input size='large' placeholder='Enter Frequency' />
              </Form.Item>
            </Col>

            <Col
              xs={{ span: 24 }}
              sm={{ span: 12 }}
              md={{ span: 12 }}
              lg={{ span: 7 }}
            >
              <Form.Item
                label='Cycle'
                name={CREATE_ORDER_FORM_KEY_NAMES.cycle}
                rules={CREATE_ORDER_FORM_FIELD_RULES.cycle}
              >
                <Input size='large' placeholder='Enter Cycle' />
              </Form.Item>
            </Col>

            <Col
              xs={{ span: 24 }}
              sm={{ span: 12 }}
              md={{ span: 12 }}
              lg={{ span: 3 }}
            >
              <Form.Item>
                <Button
                  size='large'
                  className='add-cpt-code-details-btn'
                  disabled={!submittable}
                  htmlType='submit'
                >
                  <AiOutlinePlus className='add-cpt-code-details-btn-icon' />
                </Button>
              </Form.Item>
            </Col>
          </Row>
        )}

        <Form.Item>
          <Row className='co-all-tabs-btn-container'>
            <Col>
              <Button
                className='co-all-tabs-cancel-btn'
                size='large'
                onClick={() => displayModal(ORDER_STATUS.cancel)}
              >
                Cancel
              </Button>
            </Col>

            <Col>
              <Button
                className='co-all-tabs-save-as-draft-btn'
                size='large'
                disabled={!enableNextBtn}
                onClick={() => displayModal(ORDER_STATUS.draft)}
              >
                Save As Draft
              </Button>
            </Col>

            <Col>
              <Button
                className='co-all-tabs-next-btn'
                size='large'
                disabled={!enableNextBtn}
                onClick={submitOrderDetailsTabData}
              >
                Next
              </Button>
            </Col>
          </Row>
        </Form.Item>
      </Form>

      {cptCodeInternalDataArray?.length > 0 && (
        <Col className='cpt-code-table-for-data-display'>
          <CustomTable
            rowKey='id'
            rows={cptCodeInternalDataArray}
            columns={
              orderType === CHEMO_ORDER_TYPE
                ? TABLE_FOR_CPT_CODES_AT_ORDER_DETAILS_CHEMO
                : TABLE_FOR_CPT_CODES_AT_ORDER_DETAILS_TAB
            }
            rowSelectionType={false}
            pagination={false}
            isDeleteable={true}
            onDelete={handleEditOfTheCptCode}
            pageSize={25}
            scroll={{ y: 300 }}
          />
        </Col>
      )}

      {/* Order Details Modal */}
      <OrderModal
        title={
          isDraftModal ? (
            <AiOutlineUnorderedList size={40} color='grey' />
          ) : (
            <AiFillExclamationCircle color='red' size={45} />
          )
        }
        open={isModalOpen}
        modalText={modalText}
        okText={ORDER_MODAL_OK_TEXT}
        cancelText={ORDER_MODAL_CANCEL_TEXT}
        confirmLoading={true}
        handleCancel={() => setIsModalOpen(false)}
        handleOk={submitOrderDetailsTabData}
      />
    </div>
  );
};

export default OrderDetails;
