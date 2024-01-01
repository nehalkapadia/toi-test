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
  Spin,
  Upload,
  message,
} from 'antd';
import { FiUpload } from 'react-icons/fi';
import UploadedImageContainer from './UploadedImageContainer';
import {
  CREATE_ORDER_PATIENT_DOCS_TAB_FILE_TYPE,
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
} from "@/store/orderSlice";
import { useRouter } from "next/router";
import {
  beforeFileUpload,
  compareTwoArraysElements,
  fileLengthCheck,
} from "@/utils/commonFunctions";
import {
  resetCreateOrderDataBacktoInitialState,
  setPatientDocsMdNotesCategory,
  setPatientDocsWrittenOrderCategory,
} from '@/store/createOrderFormSlice';
import OrderModal from './OrderModal';
import {
  AiFillExclamationCircle,
  AiOutlineUnorderedList,
} from 'react-icons/ai';

const PatientDocs = () => {
  const dispatch = useDispatch();
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

  const isNewPatientCreated = useSelector(
    (state) => state.allOrdersData.isNewPatientCreated
  );

  // Handling State for options Disabling
  const writtenOrdersCategory = useSelector(
    (state) => state.createOrderTabs.patientDocsWrittenOrderCategory
  );
  const mdNotesCategory = useSelector(
    (state) => state.createOrderTabs.patientDocsMdNotesCategory
  );
  const recentLabsCategory = useSelector(
    (state) => state.createOrderTabs.patientDocsRecentLabCategory
  );
  const recentPathologyCategory = useSelector(
    (state) => state.createOrderTabs.patientDocsRecentpathologyCategory
  );
  const imagingDetailsCategory = useSelector(
    (state) => state.createOrderTabs.patientDocsImagingDetailsCategory
  );

  const router = useRouter();
  const { orderId } = router.query;
  const [submittable, setSubmittable] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categoryArr, setCategoryArr] = useState([]);
  const [uploadBtn, setUploadBtn] = useState(false);
  const [isUploadBtnDisabled, setIsUploadBtnDisabled] = useState(false);

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState(ARE_YOU_SURE_WANT_TO_CANCEL_ORDER);
  const [isDraftModal, setIsDraftModal] = useState(false);
  // Set this in redux-store

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
  };

  const customRequest = (file) => {
    const { id = 1 } = patientDemographicsData;
    const matchingCategory = PATIENT_DOCUMENTS_FILE_UPLOAD_CATEGORIES.find(
      (cat) => cat.value === selectedCategory
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
      });
    } else {
      message.error(ERROR_MESSAGE_FOR_MAX_UPLOAD_DOCS);
    }
  };

  const handleCreateFinalOrder = () => {
    let traceChanges;
    let traceChanges1 = false;
    let traceChanges2 = false;
    const { id: patientId } = patientDemographicsData;
    const { id: historyId } = medicalHistoryOnly;
    const { id: recordId } = medicalRecordOnly;
    const { id: insuranceId } = insuranceInfoData;
    const { organizationId } = userData;
    const currentStatus = ORDER_STATUS.submitted;

    const payload = {
      patientId,
      historyId,
      recordId,
      insuranceId,
      currentStatus,
      organizationId,
      caseId: CASE_ID,
      uploadFiles: medicalUploadedFilesById,
      orderAuthDocuments: patientDocsFilesById,
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
    if(!orderId) {
      if (isNewPatientCreated || traceChanges) {
        dispatch(postFinalOrderCreateData(payload)).then((res) => {
          if (res?.payload?.message) {
            dispatch(resetCreateOrderDataBacktoInitialState());
            dispatch(resetSearchPatientData());
            message.success(res?.payload?.message);
            router.push("/order-management");
          } else {
            message.error(res?.payload?.message);
          }
        });
      } else {
        dispatch(resetCreateOrderDataBacktoInitialState());
        dispatch(resetOrderStateToInitialState());
        dispatch(resetSearchPatientData());
        router.push("/order-management");
      }
    } else {
      dispatch(updateOrderData(payload)).then((res) => {
        if (res?.payload?.message) {
          dispatch(resetCreateOrderDataBacktoInitialState());
          dispatch(resetOrderStateToInitialState());
          dispatch(resetSearchPatientData());
          message.success(res?.payload?.message);
          router.push("/order-management");
        } else {
          message.error(res?.payload?.message);
        }
      });
    }
  };
  const saveOrderAsDraft = async () => {
    const { id: patientId } = patientDemographicsData;
    const { id: historyId } = medicalHistoryOnly;
    const { id: recordId } = medicalRecordOnly;
    const { id: insuranceId } = insuranceInfoData;

    setLoading(true);
    const newValues = {
      patientId,
      historyId,
      recordId,
      insuranceId,
      currentStatus: ORDER_STATUS.draft,
      caseId: CASE_ID,
      uploadFiles: medicalUploadedFilesById,
      orderAuthDocuments: patientDocsFilesById,
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
      message.success(order?.payload?.message);
      router.push('/order-management');
      setLoading(false);
    } else {
      message.info(order?.payload?.message);
      setLoading(false);
    }
  };
  const shouldButtonDisabled = (category, dataObj) => {
    if (!category || category?.trim() === '' || !dataObj) {
      setIsUploadBtnDisabled(true);
      return;
    } else if (
      selectedCategory === DOCUMENTS_UPLOAD_IN_WRITTEN_ORDERS_CATEGORY &&
      dataObj?.writtenOrdersFiles?.length === MAX_UPLOAD_DOCUMENTS_PER_CATEGORY
    ) {
      setIsUploadBtnDisabled(true);
      return;
    } else if (
      selectedCategory === DOCUMENTS_UPLOAD_IN_MD_NOTES_CATEGORY &&
      dataObj?.mdNotesFiles?.length === MAX_UPLOAD_DOCUMENTS_PER_CATEGORY
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

  useEffect(() => {
    shouldButtonDisabled(selectedCategory, patientUploadedDocsData);

    if (
      searchResponse &&
      patientUploadedDocsData?.mdNotesFiles?.length > 0 &&
      patientUploadedDocsData?.writtenOrdersFiles?.length > 0
    ) {
      setSubmittable(true);
    }

    if (selectedCategory && selectedCategory?.trim() !== "") {
      setSubmittable(true);
    }
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
    }
  }, [selectedCategory, patientUploadedDocsData]);

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

  return (
    <div className="co-tab-4-patient-docs-container">
      {loading && <Spin fullscreen />}
      <Row span={24} gutter={24}>
        <Col
          xs={{ span: 24 }}
          sm={{ span: 12 }}
          md={{ span: 8 }}
          lg={{ span: 8 }}
        >
          <label className="co-tab-4-label-top-side">
            Upload Patient Documents
          </label>
          <Select
            options={patientDocumentsUploadCategoryOptions(
              writtenOrdersCategory,
              mdNotesCategory,
              recentLabsCategory,
              recentPathologyCategory,
              imagingDetailsCategory
            )}
            size="large"
            className="co-tab-4-file-type-select-tag"
            placeholder="Select File Category"
            onChange={handleCategoryChange}
          />
          <label className="co-tab-4-label-bottom-side">
            JPG, PNG, PDF (max. 5 MB)
          </label>
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
            listType="picture"
            showUploadList={false}
            disabled={isUploadBtnDisabled}
          >
            <Button
              size="large"
              className="co-tab-4-upload-btn"
              icon={<FiUpload className="co-tab-4-upload-btn-icon" />}
              onClick={isUploadBtnDisabled ? handleBtnDisabled : undefined}
            >
              Upload File
            </Button>
          </Upload>
        </Col>
      </Row>

      {patientUploadedDocsData?.writtenOrdersFiles?.length > 0 && (
        <div>
          <Col>
            <label className="co-tab-4-label-top-side">
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
                className="co-tab-4-parent-container-of-uploaded-file"
                key={elem?.id}
              >
                <UploadedImageContainer
                  data={{
                    ...elem,
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
            <label className="co-tab-4-label-top-side">MD Notes</label>
          </Col>
          <Row span={24} gutter={24}>
            {patientUploadedDocsData?.mdNotesFiles?.map((elem) => (
              <Col
                xs={{ span: 24 }}
                sm={{ span: 12 }}
                md={{ span: 12 }}
                lg={{ span: 8 }}
                className="co-tab-4-parent-container-of-uploaded-file"
                key={elem?.id}
              >
                <UploadedImageContainer
                  data={{
                    ...elem,
                    category: DOCUMENTS_UPLOAD_IN_MD_NOTES_CATEGORY,
                  }}
                />
              </Col>
            ))}
          </Row>
        </div>
      )}

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
            onClick={handleCreateFinalOrder}
          >
            Submit
          </Button>
        </Col>
      </Row>
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

export default PatientDocs;
