import React, { useEffect, useState } from "react";
import "../../../styles/orders/createOrder/insuranceInfo.css";
import "../../../styles/orders/createOrder.css";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Switch,
  Upload,
  message,
} from "antd";
import {
  CREATE_ORDER_FORM_FIELD_RULES,
  CREATE_ORDER_FORM_KEY_NAMES,
  MEDICARE_CONDITIONAL_VALIDATION,
} from "@/utils/constant.util";
import { FiUpload } from "react-icons/fi";
import { BiTrash } from "react-icons/bi";
import { INSURANCE_INFO_HEALTH_PLAN_OPTIONS, INSURANCE_INFO_LOB_OPTIONS } from "@/utils/options";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import { setCurrentSelectedTab, setPateintDocsTab, setTab3FormData } from "@/store/createOrderFormSlice";
import { postInsuranceInfoData } from "@/store/orderSlice";

const InsuranceInfo = () => {
  const [formData] = Form.useForm();
  const formValues = Form.useWatch([], formData);
  const [submittable, setSubmittable] = useState(false);
  const [insuranceCopy, setInsuranceCopy] = useState(null);
  const [isSecondaryInsurance, setIsSecondaryInsurance] = useState(false);
  const [selectedLoB, setSelectedLoB] = useState("");

  const dispatch = useDispatch();
  const patientDemographicsData = useSelector(
    (state) => state.allOrdersData.patientDemographicsData
  );
  const medicalHistoryOnly = useSelector(
    (state) => state.allOrdersData.medicalHistoryOnly
  );
  const medicalRecordOnly = useSelector(
    (state) => state.allOrdersData.medicalRecordOnly
  );

  // Handling Internal State for FormData
  const tab3FormData = useSelector(
    (state) => state.createOrderTabs.tab3FormData
  );

  const handleLoBChange = (value) => {
    if (!value || value?.trim() === "") {
      setSelectedLoB("");
      return;
    } else {
      setSelectedLoB(value);
    }
  };

  const handleSecondaryInsuranceChecked = () => {
    setIsSecondaryInsurance(!isSecondaryInsurance);
  };

  const handleSubmitTab3Data = (values) => {
    const patientId = patientDemographicsData?.id;
    values.patientId = patientId;
    const medicareId = "M12564gf34";
    values.primaryStartDate = dayjs(values.primaryStartDate).format(
      "YYYY-MM-DD"
    );
    values.primaryEndDate = dayjs(values.primaryEndDate).format("YYYY-MM-DD");
    values.secondaryInsurance = "as";
    values.medicareId = medicareId;
    if (isSecondaryInsurance) {
      values.secondaryStartDate = dayjs(values.secondaryStartDate).format(
        "YYYY-MM-DD"
      );
      values.secondaryEndDate = dayjs(values.secondaryEndDate).format(
        "YYYY-MM-DD"
      );
    }
    dispatch(postInsuranceInfoData(values)).then((res) => {
      if (res?.payload?.status) {
        message.success(res?.payload?.message);
        dispatch(setPateintDocsTab());
        dispatch(setCurrentSelectedTab("patientDocuments"));
      } else {
        message.error(res?.payload?.message);
      }
    });
  };

  useEffect(() => {
    formData.validateFields({ validateOnly: true }).then(
      () => {
        setSubmittable(true);
      },
      () => {
        setSubmittable(false);
      }
    );
    const initialValues = formData.getFieldsValue();
    initialValues.secondaryInsurance = isSecondaryInsurance;
    const payload = { ...tab3FormData, ...initialValues };
    dispatch(setTab3FormData(payload));
  }, [formValues, isSecondaryInsurance]);

  return (
    <div className="co-insurance-info-tab-3-parent-container">
      <Form
        form={formData}
        name="create-order-insurance-info"
        layout="vertical"
        autoComplete="off"
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
              label="Health Plan"
              name={CREATE_ORDER_FORM_KEY_NAMES.healthPlan}
              rules={CREATE_ORDER_FORM_FIELD_RULES.healthPlan}
            >
              <Select
                size="large"
                options={INSURANCE_INFO_HEALTH_PLAN_OPTIONS}
                placeholder="Select Health Plan"
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
              label="LoB"
              name={CREATE_ORDER_FORM_KEY_NAMES.lob}
              rules={CREATE_ORDER_FORM_FIELD_RULES.lob}
            >
              <Select
                size="large"
                options={INSURANCE_INFO_LOB_OPTIONS}
                placeholder="Select LoB"
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
                label="Medicare ID"
                name={CREATE_ORDER_FORM_KEY_NAMES.medicareId}
                rules={CREATE_ORDER_FORM_FIELD_RULES.medicareId}
              >
                <Input
                  size="large"
                  className="co-insurance-info-tab-3-input-number"
                  placeholder="Enter Medicare ID"
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
              label="Primary Subscriber Number"
              name={CREATE_ORDER_FORM_KEY_NAMES.primarySubscriberNumber}
              rules={CREATE_ORDER_FORM_FIELD_RULES.primarySubscriberNumber}
            >
              <InputNumber
                size="large"
                className="co-insurance-info-tab-3-input-number"
                placeholder="Enter Primary Subscriber Number"
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
              label="Primary Group Number"
              name={CREATE_ORDER_FORM_KEY_NAMES.primaryGroupNumber}
              rules={CREATE_ORDER_FORM_FIELD_RULES.primaryGroupNumber}
            >
              <InputNumber
                size="large"
                className="co-insurance-info-tab-3-input-number"
                placeholder="Enter Primary Subscriber Number"
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
              label="Secondary Subscriber Number"
              name={CREATE_ORDER_FORM_KEY_NAMES.secondarySubscriberNumber}
              rules={CREATE_ORDER_FORM_FIELD_RULES.secondarySubscriberNumber}
            >
              <InputNumber
                size="large"
                className="co-insurance-info-tab-3-input-number"
                placeholder="Enter Secondary Subscriber Number"
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
              label="Secondary Group Number"
              name={CREATE_ORDER_FORM_KEY_NAMES.secondaryGroupNumber}
              rules={CREATE_ORDER_FORM_FIELD_RULES.secondaryGroupNumber}
            >
              <InputNumber
                size="large"
                className="co-insurance-info-tab-3-input-number"
                placeholder="Enter Primary Subscriber Number"
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
              label="Copy Of Insurance Card"
              // name={CREATE_ORDER_FORM_KEY_NAMES.copyOfInsuranceCard}
              // rules={CREATE_ORDER_FORM_FIELD_RULES.copyOfInsuranceCard}
              // initialValue={insuranceCopy}
            >
              <Upload
                action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                listType="picture"
                maxCount={1}
                showUploadList={{
                  removeIcon: (
                    <BiTrash className="trash-icon-for-uploaded-img" />
                  ),
                }}
              >
                <Button
                  size="large"
                  className="co-tab-3-upload-btn"
                  icon={<FiUpload />}
                >
                  Upload File
                </Button>
              </Upload>
            </Form.Item>
          </Col>

          <Col
            xs={{ span: 24 }}
            sm={{ span: 12 }}
            md={{ span: 12 }}
            lg={{ span: 8 }}
          >
            <Form.Item
              label="Primary Start Date"
              name={CREATE_ORDER_FORM_KEY_NAMES.primaryStartDate}
              rules={CREATE_ORDER_FORM_FIELD_RULES.primaryStartDate}
            >
              <DatePicker
                className="co-insurance-info-tab-3-datepicker"
                size="large"
                placeholder="Choose Primary Start Date"
                format="MM-DD-YYYY"
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
              label="Primary End Date"
              name={CREATE_ORDER_FORM_KEY_NAMES.primaryEndDate}
              rules={CREATE_ORDER_FORM_FIELD_RULES.primaryEndDate}
            >
              <DatePicker
                className="co-insurance-info-tab-3-datepicker"
                size="large"
                placeholder="Choose Primary End Date"
                format="MM-DD-YYYY"
              />
            </Form.Item>
          </Col>

          <Col
            xs={{ span: 24 }}
            sm={{ span: 12 }}
            md={{ span: 12 }}
            lg={{ span: 8 }}
          >
            <Form.Item label="Secondary Insurance">
              <Switch
                checked={isSecondaryInsurance}
                onChange={handleSecondaryInsuranceChecked}
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
                  label="Secondary Start Date"
                  name={CREATE_ORDER_FORM_KEY_NAMES.secondaryStartDate}
                  rules={CREATE_ORDER_FORM_FIELD_RULES.secondaryStartDate}
                >
                  <DatePicker
                    className="co-insurance-info-tab-3-datepicker"
                    size="large"
                    placeholder="Choose Secondary Start Date"
                    format="MM-DD-YYYY"
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
                  label="Secondary End Date"
                  name={CREATE_ORDER_FORM_KEY_NAMES.secondaryEndDate}
                  rules={CREATE_ORDER_FORM_FIELD_RULES.secondaryEndDate}
                >
                  <DatePicker
                    className="co-insurance-info-tab-3-datepicker"
                    size="large"
                    placeholder="Choose Secondary End Date"
                    format="MM-DD-YYYY"
                  />
                </Form.Item>
              </Col>
            </>
          )}
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
                primaryEndDate
                htmlType="submit"
                disabled={!submittable}
              >
                Next
              </Button>
            </Col>
          </Row>
        </Form.Item>
      </Form>
    </div>
  );
};

export default InsuranceInfo;
