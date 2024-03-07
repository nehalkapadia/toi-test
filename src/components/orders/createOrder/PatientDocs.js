import React, { useEffect, useState } from 'react';
import '../../../styles/orders/createOrder/patientDocs.css';
import '../../../styles/orders/createOrder.css';
import {
  Button,
  Col,
  Modal,
  Popover,
  Row,
  Select,
  Upload,
  message,
} from 'antd';
import { FiUpload } from 'react-icons/fi';
import UploadedImageContainer from './UploadedImageContainer';
import {
  CREATE_ORDER_PATIENT_DOCS_TAB_FILE_TYPE,
  patientDocsCategoryForChemo,
  patientDocsCategoryForOfficeVisit,
  patientDocsCategoryForRadiation,
  patientDocumentsUploadCategoryOptions,
} from '@/utils/options';
import {
  ARE_YOU_SURE_WANT_DRAFT_ORDER,
  ARE_YOU_SURE_WANT_TO_CANCEL_ORDER,
  CANCEL,
  CASE_ID,
  ORDER_STATUS,
  SAME_SELECTED_CATEGORY_ERROR_MESSAGE1,
  PATIENT_DOCUMENTS_FILE_UPLOAD_CATEGORIES,
  DOCUMENTS_UPLOAD_IN_MD_NOTES_CATEGORY,
  DOCUMENTS_UPLOAD_IN_WRITTEN_ORDERS_CATEGORY,
  ERROR_MESSAGE_FOR_MAX_UPLOAD_DOCS,
  MAX_UPLOAD_DOCUMENTS_PER_CATEGORY,
  NOT_SELECTED_ANY_CATEGORY_ERROR_MESSAGE,
  ORDER_MODAL_CANCEL_TEXT,
  ORDER_MODAL_OK_TEXT,
  SELECT_AT_LIST_WRITTEN_ORDER_FILE,
  SELECT_AT_LIST_MD_NOTES_FILE,
  ARE_YOU_SURE_YOU_WANT_TO_SUBMIT_THE_ORDER_MESSAGE,
  ORDER_HAS_BEEN_CANCELED,
  PLEASE_FILL_INSURANCE_INFO_TAB,
  PLEASE_FILL_MEDICAL_HISTORY_AND_RECORD_TAB,
  CHEMO_ORDER_TYPE,
  OFFICE_VISIT_ORDER_TYPE,
  RADIATION_ORDER_TYPE,
  PLEASE_FILL_ORDER_DETAILS_TAB,
  MAX_UPLOAD_DOCUMENTS_OV_RAD_ORDER_TYPE,
} from '@/utils/constant.util';
import { useDispatch, useSelector } from 'react-redux';
import {
  postFinalOrderCreateData,
  orderSaveAsDraft,
  postPatientDocsUploadFunc,
  resetOrderStateToInitialState,
  updateOrderData,
  setTab1FormData,
  resetSearchPatientData,
} from '@/store/orderSlice';
import { useRouter } from 'next/router';
import {
  beforeFileUpload,
  compareTwoArraysElements,
  fileLengthCheck,
} from '@/utils/commonFunctions';
import {
  resetCreateOrderDataBacktoInitialState,
  setPatientDocsMdNotesCategory,
  setPatientDocsReferralCategory,
  setPatientDocsWrittenOrderCategory,
  setSelectedUploadCategory,
} from '@/store/createOrderFormSlice';
import OrderModal from './OrderModal';
import {
  AiFillExclamationCircle,
  AiOutlineUnorderedList,
} from 'react-icons/ai';
import { IoIosCheckmarkCircle } from 'react-icons/io';
import DisplayFileSize from './DisplayFileSize';
import CustomSpinner from '@/components/CustomSpinner';

const PatientDocs = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { orderId, type: orderType } = router.query;
  const userData = useSelector((state) => state.auth.user);

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
    (state) => state.allOrdersData.insuranceInfoData
  );
  const orderDetailsData =
    useSelector((state) => state.allOrdersData.orderDetailsData) || {};
  const searchResponse = useSelector(
    (state) => state.allOrdersData.patientSearchResponse
  );

  // Handling Documents Uploads state
  const patientUploadedDocsData = useSelector(
    (state) => state.allOrdersData.patientUploadedDocsData
  );
  // Tab-4 uploaded doc id
  const patientFilesAtEditById = useSelector(
    (state) => state.allOrdersData.patientFilesAtEditById
  );
  const patientDocsFilesById = useSelector(
    (state) => state.allOrdersData.patientDocsFilesById
  );

  // Tab-2 & Tab-3 uploaded documents id
  const medicalFilesAtEditById = useSelector(
    (state) => state.allOrdersData.medicalFilesAtEditById
  );

  const medicalUploadedFilesById = useSelector(
    (state) => state.allOrdersData.medicalUploadedFilesById
  );

  // Handling State for options Disabling, hold boolean values.
  const writtenOrdersCategory = useSelector(
    (state) => state.createOrderTabs.patientDocsWrittenOrderCategory
  );
  const mdNotesCategory = useSelector(
    (state) => state.createOrderTabs.patientDocsMdNotesCategory
  );
  const referralCategory = useSelector(
    (state) => state.createOrderTabs.patientDocsReferralCategory
  );
  const selectedCategory = useSelector(
    (state) => state.createOrderTabs.selectedUploadCategory || null
  );
  const orderTypeList = useSelector(
    (state) => state.allOrdersData.orderTypeList
  );

  const [submittable, setSubmittable] = useState(false);
  const [isUploadBtnDisabled, setIsUploadBtnDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState(ARE_YOU_SURE_WANT_TO_CANCEL_ORDER);
  const [isDraftModal, setIsDraftModal] = useState(false);
  const [isSubmitModal, setIsSubmitModal] = useState(false);
  const [isCancelModal, setIsCancelModal] = useState(false);

  const handleCategoryChange = (value) => {
    dispatch(setSelectedUploadCategory(value));
  };

  const getPatientDocsCategories = (
    writtenOrdersCategory,
    mdNotesCategory,
    referralCategory
  ) => {
    switch (orderType) {
      case CHEMO_ORDER_TYPE:
        return patientDocsCategoryForChemo(
          writtenOrdersCategory,
          mdNotesCategory
        );
      case OFFICE_VISIT_ORDER_TYPE:
        // TODO For future Reference:
        // When Referral category is available, update this to referralCategory
        return patientDocsCategoryForOfficeVisit(mdNotesCategory);
      case RADIATION_ORDER_TYPE:
        return patientDocsCategoryForRadiation(mdNotesCategory);
      default:
        return [];
    }
  };

  const customRequest = (file) => {
    setLoading(true);
    const { id = 1 } = patientDemographicsData;
    const matchingCategory = PATIENT_DOCUMENTS_FILE_UPLOAD_CATEGORIES.find(
      (cat) => cat?.value === selectedCategory
    );
    if (
      matchingCategory &&
      fileLengthCheck(patientUploadedDocsData[matchingCategory.key])
    ) {
      dispatch(
        postPatientDocsUploadFunc({
          file: file.file,
          type: selectedCategory,
          patientId: id,
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
    const { writtenOrdersFiles, mdNotesFiles } = patientUploadedDocsData;
    switch (orderType) {
      case CHEMO_ORDER_TYPE: {
        if (writtenOrdersFiles?.length < 1) {
          return SELECT_AT_LIST_WRITTEN_ORDER_FILE;
        }
        if (mdNotesFiles?.length < 1) {
          return SELECT_AT_LIST_MD_NOTES_FILE;
        }
        return false;
      }
      case OFFICE_VISIT_ORDER_TYPE: {
        if (mdNotesCategory?.length < 1) {
          return SELECT_AT_LIST_WRITTEN_ORDER_FILE;
        }
        return false;
      }
      case RADIATION_ORDER_TYPE: {
        if (mdNotesFiles?.length < 1) {
          return SELECT_AT_LIST_MD_NOTES_FILE;
        }
        return false;
      }
    }
  };

  const handleAllTabCreated = () => {
    switch (true) {
      case !medicalHistoryOnly?.id:
        return PLEASE_FILL_MEDICAL_HISTORY_AND_RECORD_TAB;
      case !insuranceInfoData?.id:
        return PLEASE_FILL_INSURANCE_INFO_TAB;
      case !orderDetailsData?.id:
        return PLEASE_FILL_ORDER_DETAILS_TAB;
      default:
        return false;
    }
  };

  const handleCreateFinalOrder = () => {
    const isAllFileUploaded = handleAllFileUploaded();
    if (isAllFileUploaded) {
      message.error(isAllFileUploaded);
      return;
    }
    const isAllTabCreated = handleAllTabCreated();
    if (isAllTabCreated) {
      message.error(isAllTabCreated);
      return;
    }
    let traceChanges;
    let traceChanges1 = false;
    let traceChanges2 = false;

    const { id: patientId } = patientDemographicsData;
    const { id: historyId } = medicalHistoryOnly;
    const { id: recordId } = medicalRecordOnly;
    const { id: insuranceId } = insuranceInfoData;
    const { id: orderDetailsId } = orderDetailsData;

    const { organizationId } = userData;
    const currentStatus = ORDER_STATUS.submitted;

    const payload = {
      patientId,
      historyId,
      recordId,
      insuranceId,
      orderDetailsId,
      currentStatus,
      organizationId,
      caseId: CASE_ID,
      uploadFiles: medicalUploadedFilesById,
      orderAuthDocuments: patientDocsFilesById,
      orderTypeId: filterOrderTypeId(),
    };
    // here we will identify that if the user has changed any value in the form
    if (searchResponse) {
      traceChanges1 = compareTwoArraysElements(
        medicalFilesAtEditById,
        medicalUploadedFilesById
      );
      traceChanges2 = compareTwoArraysElements(
        patientFilesAtEditById,
        patientDocsFilesById
      );
      traceChanges = traceChanges1 || traceChanges2;
    }
    if (!orderId) {
      dispatch(postFinalOrderCreateData(payload)).then((res) => {
        if (res?.payload?.status) {
          dispatch(resetCreateOrderDataBacktoInitialState());
          dispatch(resetSearchPatientData());
          dispatch(resetOrderStateToInitialState());
          message.success(res?.payload?.message);
          router.push('/order-management');
        } else {
          message.error(res?.payload?.message);
        }
      });
    } else {
      dispatch(updateOrderData({ orderId, payload })).then((res) => {
        if (res?.payload?.status) {
          dispatch(resetCreateOrderDataBacktoInitialState());
          dispatch(resetSearchPatientData());
          dispatch(resetOrderStateToInitialState());
          message.success(res?.payload?.message);
          router.push('/order-management');
        } else {
          message.error(res?.payload?.message);
        }
      });
    }
  };
  const saveOrderAsDraft = async () => {
    const isAllFileUploaded = handleAllFileUploaded();
    if (isAllFileUploaded) {
      message.error(isAllFileUploaded);
      return;
    }
    const isAllTabCreated = handleAllTabCreated();
    if (isAllTabCreated) {
      message.error(isAllTabCreated);
      return;
    }
    const { id: patientId } = patientDemographicsData;
    const { id: historyId } = medicalHistoryOnly;
    const { id: recordId } = medicalRecordOnly;
    const { id: insuranceId } = insuranceInfoData;
    const { id: orderDetailsId } = orderDetailsData;

    setLoading(true);
    const newValues = {
      patientId,
      historyId,
      recordId,
      insuranceId,
      orderDetailsId,
      currentStatus: ORDER_STATUS.draft,
      caseId: CASE_ID,
      uploadFiles: medicalUploadedFilesById,
      orderAuthDocuments: patientDocsFilesById,
      orderTypeId: filterOrderTypeId(),
    };
    let order;
    if (orderId) {
      order = await dispatch(updateOrderData({ orderId, payload: newValues }));
    } else {
      order = await dispatch(orderSaveAsDraft(newValues));
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
  const filterOrderTypeId = () => {
    const orderTypeData = orderTypeList.find(
      (item) => item?.label.toLowerCase() === orderType.toLowerCase()
    );
    return orderTypeData?.id;
  };
  const shouldButtonDisabled = (category, dataObj) => {
    const maxUploadLimit =
      orderType === CHEMO_ORDER_TYPE
        ? MAX_UPLOAD_DOCUMENTS_PER_CATEGORY
        : MAX_UPLOAD_DOCUMENTS_OV_RAD_ORDER_TYPE;
    if (!category || category?.trim() === '' || !dataObj) {
      setIsUploadBtnDisabled(true);
      return;
    } else if (
      orderType === CHEMO_ORDER_TYPE &&
      selectedCategory === DOCUMENTS_UPLOAD_IN_WRITTEN_ORDERS_CATEGORY &&
      dataObj?.writtenOrdersFiles?.length === MAX_UPLOAD_DOCUMENTS_PER_CATEGORY
    ) {
      setIsUploadBtnDisabled(true);
      return;
    } else if (
      selectedCategory === DOCUMENTS_UPLOAD_IN_MD_NOTES_CATEGORY &&
      dataObj?.mdNotesFiles?.length === maxUploadLimit
    ) {
      setIsUploadBtnDisabled(true);
      return;
    } else {
      setIsUploadBtnDisabled(false);
      return;
    }
  };

  const handleBtnDisabled = () => {
    if (!selectedCategory || selectedCategory?.trim() === '') {
      message.error(NOT_SELECTED_ANY_CATEGORY_ERROR_MESSAGE);
    } else {
      message.error(ERROR_MESSAGE_FOR_MAX_UPLOAD_DOCS);
    }
  };

  const submittableBtnScenario = () => {
    switch (orderType) {
      case CHEMO_ORDER_TYPE: {
        if (
          patientUploadedDocsData?.writtenOrdersFiles?.length > 0 &&
          patientUploadedDocsData?.mdNotesFiles?.length > 0
        ) {
          setSubmittable(true);
        } else {
          setSubmittable(false);
        }
        break;
      }
      case OFFICE_VISIT_ORDER_TYPE: {
        if (patientUploadedDocsData?.mdNotesFiles?.length > 0) {
          setSubmittable(true);
        } else {
          setSubmittable(false);
        }
        break;
      }
      case RADIATION_ORDER_TYPE: {
        if (patientUploadedDocsData?.mdNotesFiles?.length > 0) {
          setSubmittable(true);
        } else {
          setSubmittable(false);
        }
        break;
      }
    }
  };

  useEffect(() => {
    shouldButtonDisabled(selectedCategory, patientUploadedDocsData);
    submittableBtnScenario();

    if (
      patientUploadedDocsData?.writtenOrdersFiles?.length ===
      MAX_UPLOAD_DOCUMENTS_PER_CATEGORY
    ) {
      dispatch(setPatientDocsWrittenOrderCategory(true));
    }
    if (
      patientUploadedDocsData?.mdNotesFiles?.length ===
      MAX_UPLOAD_DOCUMENTS_PER_CATEGORY
    ) {
      dispatch(setPatientDocsMdNotesCategory(true));
      dispatch(setPatientDocsReferralCategory(true));
    }
    if (
      patientUploadedDocsData?.writtenOrdersFiles?.length <
      MAX_UPLOAD_DOCUMENTS_PER_CATEGORY
    ) {
      dispatch(setPatientDocsWrittenOrderCategory(false));
    }
    if (
      patientUploadedDocsData?.mdNotesFiles?.length <
      MAX_UPLOAD_DOCUMENTS_PER_CATEGORY
    ) {
      dispatch(setPatientDocsMdNotesCategory(false));
      dispatch(setPatientDocsReferralCategory(false));
    }
  }, [selectedCategory, patientUploadedDocsData]);

  const showModal = (type) => {
    if (type === ORDER_STATUS.draft) {
      setIsDraftModal(true);
      setIsSubmitModal(false);
      setIsCancelModal(false);
      setModalText(ARE_YOU_SURE_WANT_DRAFT_ORDER);
    } else if (type === ORDER_STATUS.submitted) {
      setIsSubmitModal(true);
      setIsDraftModal(false);
      setIsCancelModal(false);
      setModalText(ARE_YOU_SURE_YOU_WANT_TO_SUBMIT_THE_ORDER_MESSAGE);
    } else if (type === ORDER_STATUS.cancel) {
      setIsDraftModal(false);
      setIsSubmitModal(false);
      setIsCancelModal(true);
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
    } else if (isSubmitModal) {
      setOpen(false);
      setConfirmLoading(false);
      handleCreateFinalOrder();
    } else if (isCancelModal) {
      setOpen(false);
      setConfirmLoading(false);
      dispatch(resetCreateOrderDataBacktoInitialState());
      dispatch(setTab1FormData({}));
      dispatch(resetSearchPatientData());
      dispatch(resetOrderStateToInitialState());
      router.push('/order-management');
    }
  };
  const handleCancel = () => {
    setOpen(false);
    setIsCancelModal(false);
    setIsDraftModal(false);
    setIsSubmitModal(false);
  };

  return (
    <div className='co-tab-4-patient-docs-container'>
      {loading && <CustomSpinner />}
      <Col>
        <h3 className='co-patient-docs-info-order-type'>{orderType}</h3>
      </Col>
      <Row span={24} gutter={24}>
        <Col
          xs={{ span: 24 }}
          sm={{ span: 12 }}
          md={{ span: 8 }}
          lg={{ span: 8 }}
        >
          <label className='co-tab-4-label-top-side'>
            Upload Patient Documents
          </label>
          <Select
            options={getPatientDocsCategories(
              writtenOrdersCategory,
              mdNotesCategory,
              referralCategory
            )}
            size='large'
            className='co-tab-4-file-type-select-tag'
            placeholder='Select File Category'
            onChange={handleCategoryChange}
            value={selectedCategory}
          />
          <DisplayFileSize className='co-tab-4-label-bottom-side' />
        </Col>
        <Col
          xs={{ span: 24 }}
          sm={{ span: 12 }}
          md={{ span: 8 }}
          lg={{ span: 8 }}
        >
          <Upload
            beforeUpload={beforeFileUpload}
            customRequest={customRequest}
            listType='picture'
            showUploadList={false}
            disabled={isUploadBtnDisabled}
          >
            <Button
              size='large'
              className='co-tab-4-upload-btn'
              icon={<FiUpload className='co-tab-4-upload-btn-icon' />}
              onClick={isUploadBtnDisabled ? handleBtnDisabled : undefined}
              disabled={isUploadBtnDisabled}
            >
              Upload File
            </Button>
          </Upload>
        </Col>
      </Row>

      {orderType === CHEMO_ORDER_TYPE &&
        patientUploadedDocsData?.writtenOrdersFiles?.length > 0 && (
          <div>
            <Col>
              <label className='co-tab-4-label-top-side'>
                Written Orders For Treatment
              </label>
            </Col>
            <Row span={24} gutter={24}>
              {patientUploadedDocsData?.writtenOrdersFiles?.map((elem) => (
                <Col
                  xs={{ span: 24 }}
                  sm={{ span: 12 }}
                  md={{ span: 12 }}
                  lg={{ span: 8 }}
                  className='co-tab-4-parent-container-of-uploaded-file'
                  key={elem?.id}
                >
                  <UploadedImageContainer
                    data={{
                      ...elem,
                      isAuth: true,
                      category: DOCUMENTS_UPLOAD_IN_WRITTEN_ORDERS_CATEGORY,
                    }}
                  />
                </Col>
              ))}
            </Row>
          </div>
        )}

      {patientUploadedDocsData?.mdNotesFiles?.length > 0 && (
        <div>
          <Col>
            <label className='co-tab-4-label-top-side'>
              {orderType === OFFICE_VISIT_ORDER_TYPE ? 'Referral' : 'MD Notes'}
            </label>
          </Col>
          <Row span={24} gutter={24}>
            {patientUploadedDocsData?.mdNotesFiles?.map((elem) => (
              <Col
                xs={{ span: 24 }}
                sm={{ span: 12 }}
                md={{ span: 12 }}
                lg={{ span: 8 }}
                className='co-tab-4-parent-container-of-uploaded-file'
                key={elem?.id}
              >
                <UploadedImageContainer
                  data={{
                    ...elem,
                    isAuth: true,
                    category: DOCUMENTS_UPLOAD_IN_MD_NOTES_CATEGORY,
                  }}
                />
              </Col>
            ))}
          </Row>
        </div>
      )}

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
            onClick={() => showModal(ORDER_STATUS.submitted)}
          >
            Submit
          </Button>
        </Col>
      </Row>
      <OrderModal
        title={
          isDraftModal ? (
            <AiOutlineUnorderedList color='grey' size={49} />
          ) : isCancelModal ? (
            <AiFillExclamationCircle color='red' size={49} />
          ) : isSubmitModal ? (
            <IoIosCheckmarkCircle color='green' size={49} />
          ) : (
            ''
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

export default PatientDocs;
