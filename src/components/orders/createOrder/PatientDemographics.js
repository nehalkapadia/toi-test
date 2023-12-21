import React, { useEffect, useState } from "react";
import "../../../styles/orders/createOrder/patientDemographics.css";
import "../../../styles/orders/createOrder.css";
import {
  CREATE_ORDER_FORM_FIELD_RULES,
  CREATE_ORDER_FORM_KEY_NAMES,
  SELECT_MANDATORY_FIELD_ERROR_MESSAGE,
} from "@/utils/constant.util";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Spin,
  message,
} from "antd";
import { AiOutlineSearch } from "react-icons/ai";
import TextArea from "antd/es/input/TextArea";
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentSelectedTab,
  setMedicalHistoryTab,
  setTab1FormData,
} from "@/store/createOrderFormSlice";
import {
  postPatientDemographicsData,
  searchPatientRecordData,
} from "@/store/orderSlice";
import dayjs from "dayjs";
import CustomTable from "@/components/customTable/CustomTable";
import { TABLE_FOR_DISPLAYING_SEARCHED_PATIENT } from "@/utils/columns";
import { replaceMultipleSpacesWithSingleSpace } from "@/utils/patterns";

const PatientDemographics = () => {
  const [formData] = Form.useForm();
  const formValues = Form.useWatch([], formData);
  const [submittable, setSubmittable] = useState(false);
  const [isSearchable, setIsSearchable] = useState(false);
  const [displayModal, setDisplayModal] = useState(false);
  const dispatch = useDispatch();
  const tab1FormData = useSelector(
    (state) => state.createOrderTabs.tab1FormData
  );
  // const isLoading = useSelector(
  //   (state) => state.allOrdersData.patientSearchIsLoading
  // );
  const patientSearchData = useSelector(
    (state) => state.allOrdersData.patientRecordSearchData
  );
  const searchResponse = useSelector(
    (state) => state.allOrdersData.patientSearchResponse
  );

  const isPatientCreated = useSelector(
    (state) => state.allOrdersData.isPatientCreated
  );

  const patientCreatedData = useSelector(
    (state) => state.allOrdersData.patientDemographicsData
  );

  const handleDisabledDate = (current) => {
    return current && current > dayjs().startOf("day");
  };

  const parseDateFormat = (data) => {
    const { dob, ...rest } = data;
    const dateOfBirth = dayjs(dob);
    return { ...rest, dob: dateOfBirth };
  };

  const handleSearchPatient = () => {
    const initValues = formData.getFieldValue();
    const { firstName, lastName, dob, gender } = initValues;
    const dateOfBirth = dayjs(dob).format("YYYY-MM-DD");
    if (
      !firstName ||
      !lastName ||
      !dob ||
      !gender ||
      firstName?.trim() === "" ||
      lastName?.trim() === "" ||
      dateOfBirth?.trim() === "" ||
      gender?.trim() === ""
    ) {
      return message(SELECT_MANDATORY_FIELD_ERROR_MESSAGE);
    }
    const payload = { ...initValues, dob: dateOfBirth };
    dispatch(searchPatientRecordData(payload))
      .then((res) => {
        if (res?.payload?.status) {
          // formData.setFieldsValue(res?.payload?.data);
        } else {
          message.info(
            res?.payload?.message + " Please continue creating a new record"
          );
        }
      })
      .catch((err) => {
        message.error(err);
      });
  };

  const handleSearchDetailsAdd = () => {
    setDisplayModal(true);
  };

  const handleSubmitTab1Data = (values) => {
    const createdBy = localStorage.getItem("userId");
    values.dob = dayjs(values.dob).format("YYYY-MM-DD");
    values.firstName = replaceMultipleSpacesWithSingleSpace(values.firstName);
    values.lastName = replaceMultipleSpacesWithSingleSpace(values.lastName);
    values.gender = replaceMultipleSpacesWithSingleSpace(values.gender);
    values.address = replaceMultipleSpacesWithSingleSpace(values.address);
    dispatch(postPatientDemographicsData(values)).then((res) => {
      if (res?.payload?.status) {
        message.success(res?.payload?.message);
        dispatch(setMedicalHistoryTab());
        dispatch(setCurrentSelectedTab("medicalHistory"));
      } else {
        message.info(res?.payload?.message);
      }
    });
  };

  const validateAddressField = (str) => {
    return typeof str === "string" && str?.trim().length > 0;
  };

  useEffect(() => {
    formData
      .validateFields(["firstName", "lastName", "dob", "gender"], {
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
    if (isSearchable) {
      if (validateAddressField(addressField)) {
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

  // useEffect(() => {
  // if (searchResponse) {
  //   dispatch(setTab1FormData(patientSearchData));
  // }
  // }, [searchResponse, displayModal]);

  return (
    <div className="create-order-patient-demographics-container">
      <Form
        form={formData}
        name="create-order-patient-demographics"
        layout="vertical"
        autoComplete="off"
        preserve={true}
        onFinish={handleSubmitTab1Data}
        initialValues={tab1FormData}
      >
        <Row span={24} gutter={24}>
          <Col
            xs={{ span: 24 }}
            sm={{ span: 12 }}
            md={{ span: 12 }}
            lg={{ span: 8 }}
          >
            <Form.Item
              label="First Name"
              name={CREATE_ORDER_FORM_KEY_NAMES.firstName}
              validateStatus="validating"
              rules={CREATE_ORDER_FORM_FIELD_RULES.firstName}
              // // initialValue={tab1FormData?.firstName}
            >
              <Input size="large" placeholder="Patient's First Name" />
            </Form.Item>
          </Col>

          <Col
            xs={{ span: 24 }}
            sm={{ span: 12 }}
            md={{ span: 12 }}
            lg={{ span: 8 }}
          >
            <Form.Item
              label="Last Name"
              name={CREATE_ORDER_FORM_KEY_NAMES.lastName}
              validateStatus="validating"
              rules={CREATE_ORDER_FORM_FIELD_RULES.lastName}
              // initialValue={tab1FormData?.lastName}
            >
              <Input size="large" placeholder="Patient's Last Name" />
            </Form.Item>
          </Col>
          {/* {isLoading && (
            <div>
              <Spin fullscreen size="large" />
            </div>
          )} */}
          <Col
            xs={{ span: 24 }}
            sm={{ span: 12 }}
            md={{ span: 12 }}
            lg={{ span: 8 }}
          >
            <Form.Item
              label="Date Of Birth"
              name={CREATE_ORDER_FORM_KEY_NAMES.dob}
              rules={CREATE_ORDER_FORM_FIELD_RULES.dob}
              // initialValue={ tab1FormData.dob ? dayjs(tab1FormData?.dob) : null}
            >
              <DatePicker
                className="co-tab1-form-item-width-manually"
                size="large"
                placeholder="Patient's Date of Birth"
                format={"MM-DD-YYYY"}
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
              label="Gender"
              name={CREATE_ORDER_FORM_KEY_NAMES.gender}
              rules={CREATE_ORDER_FORM_FIELD_RULES.gender}
              // initialValue={tab1FormData?.gender}
            >
              <Input size="large" placeholder="Patient's Gender" />
            </Form.Item>
          </Col>

          <Col
            xs={{ span: 24 }}
            sm={{ span: 12 }}
            md={{ span: 12 }}
            lg={{ span: 8 }}
          >
            <Form.Item
              label="Primary Phone Number"
              name={CREATE_ORDER_FORM_KEY_NAMES.primaryPhoneNumber}
              rules={CREATE_ORDER_FORM_FIELD_RULES.number}
              // initialValue={tab1FormData?.primaryPhoneNumber}
            >
              <InputNumber
                className="co-tab1-form-item-width-manually"
                size="large"
                placeholder="Primary Phone Number"
              />
            </Form.Item>
          </Col>

          <Col
            xs={{ span: 24 }}
            sm={{ span: 12 }}
            md={{ span: 12 }}
            lg={{ span: 8 }}
          >
            <Button
              className="patient-search-btn"
              icon={<AiOutlineSearch className="patient-search-icon" />}
              size="large"
              onClick={handleSearchPatient}
              disabled={!isSearchable}
            >
              Search Patient
            </Button>
          </Col>

          <Col
            xs={{ span: 24 }}
            sm={{ span: 12 }}
            md={{ span: 12 }}
            lg={{ span: 8 }}
          >
            <Form.Item
              label="Email"
              name={CREATE_ORDER_FORM_KEY_NAMES.email}
              validateStatus="validating"
              rules={CREATE_ORDER_FORM_FIELD_RULES.email}
              // initialValue={tab1FormData?.email}
            >
              <Input size="large" placeholder="Enter Email ID" />
            </Form.Item>
          </Col>

          <Col
            xs={{ span: 24 }}
            sm={{ span: 12 }}
            md={{ span: 12 }}
            lg={{ span: 8 }}
          >
            <Form.Item
              label="Secondary Phone Number"
              name={CREATE_ORDER_FORM_KEY_NAMES.secondaryPhoneNumber}
              rules={CREATE_ORDER_FORM_FIELD_RULES.number}
              // initialValue={tab1FormData?.secondaryPhoneNumber}
            >
              <InputNumber
                className="co-tab1-form-item-width-manually"
                size="large"
                placeholder="Secondary Phone Number"
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
              label="Preferred Language"
              name={CREATE_ORDER_FORM_KEY_NAMES.language}
              validateStatus="validating"
              rules={CREATE_ORDER_FORM_FIELD_RULES.language}
              // initialValue={tab1FormData?.language}
            >
              <Input size="large" placeholder="Your Preferred Language" />
            </Form.Item>
          </Col>

          <Col
            xs={{ span: 24 }}
            sm={{ span: 12 }}
            md={{ span: 12 }}
            lg={{ span: 8 }}
          >
            <Form.Item
              label="Race"
              name={CREATE_ORDER_FORM_KEY_NAMES.race}
              validateStatus="validating"
              rules={CREATE_ORDER_FORM_FIELD_RULES.race}
              // initialValue={tab1FormData?.race}
            >
              <Input size="large" placeholder="Race" />
            </Form.Item>
          </Col>

          <Col
            xs={{ span: 24 }}
            sm={{ span: 12 }}
            md={{ span: 12 }}
            lg={{ span: 8 }}
          >
            <Form.Item
              label="Address"
              name={CREATE_ORDER_FORM_KEY_NAMES.address}
              validateStatus="validating"
              rules={CREATE_ORDER_FORM_FIELD_RULES.address}
              // initialValue={tab1FormData?.address}
            >
              <TextArea
                placeholder="Please Enter Full Address"
                autoSize={{ minRows: 4, maxRows: 6 }}
              />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item>
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
              >
                Next
              </Button>
            </Col>
          </Row>
        </Form.Item>
      </Form>

      {/* Modal Start from here */}
      <Modal
        open={!displayModal && searchResponse}
        title="Patient Details"
        footer={false}
        closable={false}
        width={"90%"}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
        transitionName=""
      >
        <CustomTable
          rowKey="id"
          rows={[patientSearchData]}
          columns={TABLE_FOR_DISPLAYING_SEARCHED_PATIENT}
          pagination={false}
        />
        <Row className="co-modal-add-btn-container">
          <Button
            size="large"
            className="co-modal-add-btn"
            onClick={handleSearchDetailsAdd}
          >
            Add
          </Button>
        </Row>
      </Modal>
    </div>
  );
};

export default PatientDemographics;
