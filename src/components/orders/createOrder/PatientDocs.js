import React, { useEffect, useState } from "react";
import "../../../styles/orders/createOrder/patientDocs.css";
import "../../../styles/orders/createOrder.css";
import {
  Button,
  Col,
  Modal,
  Popover,
  Row,
  Select,
  Upload,
  message,
} from "antd";
import { FiUpload } from "react-icons/fi";
import UploadedImageContainer from "./UploadedImageContainer";
import { CREATE_ORDER_PATIENT_DOCS_TAB_FILE_TYPE } from "@/utils/options";
import {
  NOT_SELECTED_ANY_CATEGORY_ERROR_MESSAGE,
  SAME_SELECTED_CATEGORY_ERROR_MESSAGE1,
} from "@/utils/constant.util";
import { useDispatch, useSelector } from "react-redux";
import { postFinalOrderCreateData } from "@/store/orderSlice";
import { useRouter } from "next/router";

const PatientDocs = () => {
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
  const userData = useSelector((state) => state.auth.user);

  const dispatch = useDispatch();
  const router = useRouter();
  const [submittable, setSubmittable] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categoryArr, setCategoryArr] = useState([]);
  const [uploadBtn, setUploadBtn] = useState(false);
  const [tab4UploadedData, setTab4uploadedData] = useState({
    writtenOrders: [],
    mdNotes: [],
    recentLabs: [],
    recentPathology: [],
    imagingDetails: [],
  });
  // Set this in redux-store

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
  };

  const handleClickUpload = () => {
    if (!selectedCategory) {
      message.error(NOT_SELECTED_ANY_CATEGORY_ERROR_MESSAGE);
    } else if (categoryArr.includes(selectedCategory)) {
      message.error(SAME_SELECTED_CATEGORY_ERROR_MESSAGE1);
    }
  };

  const handleCreateFinalOrder = () => {
    const { id: patientId } = patientDemographicsData;
    const { id: historyId } = medicalHistoryOnly;
    const { id: recordId } = medicalRecordOnly;
    const { id: insuranceId } = insuranceInfoData;
    const { organizationId } = userData;
    const currentStatus = "submitted";

    const payload = {
      patientId,
      historyId,
      recordId,
      insuranceId,
      currentStatus,
      organizationId,
      caseId: "case12242",
    };
    dispatch(postFinalOrderCreateData(payload)).then((res) => {
      if (res?.payload?.message) {
        message.success(res?.payload?.message);
        router.push("/order-management");
      } else {
        message.error(res?.payload?.message);
      }
    });
  };

  useEffect(() => {
    if (categoryArr.includes(selectedCategory) || selectedCategory === "") {
      setUploadBtn(true);
    } else {
      setCategoryArr([...categoryArr, selectedCategory]);
      setUploadBtn(false);
    }

    if (selectedCategory && selectedCategory?.trim() !== "") {
      setSubmittable(true);
    }
  }, [selectedCategory]);

  return (
    <div className="co-tab-4-patient-docs-container">
      <Row span={24} gutter={24}>
        <Col
          xs={{ span: 12 }}
          sm={{ span: 10 }}
          md={{ span: 8 }}
          lg={{ span: 8 }}
        >
          <label className="co-tab-4-label-top-side">
            Upload Patient Documents
          </label>
          <Select
            options={CREATE_ORDER_PATIENT_DOCS_TAB_FILE_TYPE}
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
          xs={{ span: 12 }}
          sm={{ span: 10 }}
          md={{ span: 8 }}
          lg={{ span: 8 }}
        >
          <Upload
            action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
            listType="picture"
            maxCount={1}
            showUploadList={false}
            disabled={uploadBtn}
          >
            <Button
              size="large"
              className="co-tab-4-upload-btn"
              icon={<FiUpload className="co-tab-4-upload-btn-icon" />}
              onClick={uploadBtn ? handleClickUpload : undefined}
            >
              Upload File
            </Button>
          </Upload>
        </Col>
      </Row>

      <Row span={24} gutter={32}>
        <Col
          xs={{ span: 24 }}
          sm={{ span: 12 }}
          md={{ span: 8 }}
          lg={{ span: 8 }}
        >
          <label className="co-tab-4-label-top-side">
            Written Orders For Treatment
          </label>
          <div>
            <UploadedImageContainer data={tab4UploadedData.writtenOrders} />
          </div>
        </Col>

        <Col
          xs={{ span: 24 }}
          sm={{ span: 12 }}
          md={{ span: 8 }}
          lg={{ span: 8 }}
        >
          <label className="co-tab-4-label-top-side">MD Notes</label>
          <div>
            <UploadedImageContainer data={tab4UploadedData.mdNotes} />
          </div>
        </Col>
      </Row>

      <Row span={24} gutter={32}>
        <Col
          xs={{ span: 24 }}
          sm={{ span: 12 }}
          md={{ span: 8 }}
          lg={{ span: 8 }}
        >
          <label className="co-tab-4-label-top-side">Most Recent Labs</label>
          <div>
            <UploadedImageContainer data={tab4UploadedData.recentLabs} />
          </div>
        </Col>

        <Col
          xs={{ span: 24 }}
          sm={{ span: 12 }}
          md={{ span: 8 }}
          lg={{ span: 8 }}
        >
          <label className="co-tab-4-label-top-side">
            Most Recent Pathology
          </label>
          <div>
            <UploadedImageContainer data={tab4UploadedData.recentPathology} />
          </div>
        </Col>
      </Row>

      <Row span={24} gutter={32}>
        <Col
          xs={{ span: 24 }}
          sm={{ span: 12 }}
          md={{ span: 8 }}
          lg={{ span: 24 }}
        >
          <label className="co-tab-4-label-top-side">Imaging Details</label>
          <div>
            <UploadedImageContainer data={tab4UploadedData.imagingDetails} />
          </div>
        </Col>
      </Row>
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
            onClick={handleCreateFinalOrder}
          >
            Submit
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default PatientDocs;
