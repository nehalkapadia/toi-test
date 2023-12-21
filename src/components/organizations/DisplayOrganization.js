import React, { useEffect, useState } from "react";
import "../../styles/organizations/displayOrganization.css";
import { Button, Col, Form, Input, Radio, Row, Skeleton, message } from "antd";
import {
  API_RESPONSE_MESSAGES,
  FORM_NAME_VALUES,
  ORGANIZATION_FORM_FIELD_RULES,
  TOTAL_ITEMS_PER_PAGE,
} from "@/utils/constant.util";
import { useDispatch, useSelector } from "react-redux";
import {
  getOrganizationsById,
  getOrganizationsFunc,
  updateOrganizationFunc,
} from "@/store/organizationSlice";
import { formatPhoneNumberToUSFormat } from "@/utils/commonFunctions";
import TextArea from "antd/es/input/TextArea";

const DisplayOrganization = ({ columnId, isEditClicked, onClose, page }) => {
  const dispatch = useDispatch();
  const [formData] = Form.useForm();
  const [submittable, setSubmittable] = useState(false);
  const formValues = Form.useWatch([], formData);
  const isLoading = useSelector(
    (state) => state.organizationTable.viewIsLoading
  );
  const getOrgDetails = useSelector(
    (state) => state.organizationTable.getOrgDetails
  );

  const { name, email, phoneNumber, domain, address, isActive } = getOrgDetails;

  const submitFormData = (values) => {
    // const updatedBy = 4
    const payload = {
      name,
      phoneNumber,
      ...values,
    };
    dispatch(updateOrganizationFunc({ id: columnId, payload })).then((res) => {
      if (res?.payload?.status) {
        dispatch(getOrganizationsFunc({ page, perPage: TOTAL_ITEMS_PER_PAGE }));
        message.success(API_RESPONSE_MESSAGES.org_updated);
        onClose();
      } else if (res?.payload?.status === false) {
        message.error(res?.payload?.message);
      } else {
        message.error(API_RESPONSE_MESSAGES.err_rest_api);
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
  }, [formValues]);

  useEffect(() => {
    if (columnId) {
      dispatch(getOrganizationsById(columnId));
    }
  }, [columnId, isEditClicked]);

  return (
    <>
      {isLoading ? (
        <Skeleton active paragraph={{ row: 18 }} />
      ) : (
        <Form
          className="display-organization-details-container"
          form={formData}
          name="oncology-fields-editable"
          onFinish={submitFormData}
          autoComplete="off"
          preserve={false}
          layout="vertical"
        >
          <Row className="display-organization-rows-parent-container">
            <Col className="each-single-detail-row-child-container">
              <p className="column-name-lable-at-om">Organization</p>
              <p className="column-value-as-heading-at-om text-transform-class-om">
                {name}
              </p>
            </Col>

            {!isEditClicked && (
              <Col className="each-single-detail-row-child-container">
                <p className="column-name-lable-at-om">Email ID</p>
                <p className="column-value-as-heading-at-om">
                  {email || "N/A"}
                </p>
              </Col>
            )}

            <Col className="each-single-detail-row-child-container">
              <p className="column-name-lable-at-om">Phone Number</p>
              <p className="column-value-as-heading-at-om">
                {formatPhoneNumberToUSFormat(phoneNumber)}
              </p>
            </Col>

            {!isEditClicked && (
              <Col className="each-single-detail-row-child-container">
                <p className="column-name-lable-at-om">Domain</p>
                <p className="column-value-as-heading-at-om text-transform-class-om">
                  {domain}
                </p>
              </Col>
            )}
          </Row>

          {isEditClicked && (
            <Row className="display-organization-rows-parent-container">
              <Form.Item
                className="each-single-detail-row-child-container"
                initialValue={domain}
                name={FORM_NAME_VALUES.domain}
                label="Domain"
                validateStatus="validating"
                rules={ORGANIZATION_FORM_FIELD_RULES.domain}
              >
                <Input
                  size="large"
                  className="edit-organization-input-box"
                  placeholder="Please Enter Domain Name"
                />
              </Form.Item>

              <Form.Item
                className="each-single-detail-row-child-container"
                initialValue={email}
                name={FORM_NAME_VALUES.email}
                label="Email ID"
                validateStatus="validating"
                rules={ORGANIZATION_FORM_FIELD_RULES.org_email}
              >
                <Input
                  type="email"
                  size="large"
                  placeholder="Please Enter Email ID"
                  className="edit-organization-input-box"
                />
              </Form.Item>
            </Row>
          )}

          {!isEditClicked && (
            <Row className="display-organization-rows-parent-container">
              <Col className="each-single-detail-row-child-container">
                <p className="column-name-lable-at-om">Address</p>
                <p className="column-value-as-heading-at-om text-transform-class-om">
                  {address || "Address Not Available"}
                </p>
              </Col>

              <Col className="each-single-detail-row-child-container">
                <p className="column-name-lable-at-om">Status</p>
                <p
                  className={`text-transform-class-om organization-current-${isActive}`}
                >
                  {isActive ? "Active" : "InActive"}
                </p>
              </Col>
            </Row>
          )}

          {isEditClicked && (
            <Row className="display-organization-rows-parent-container">
              <Form.Item
                className="each-single-detail-row-child-container"
                initialValue={address}
                name={FORM_NAME_VALUES.address}
                label="Address"
              >
                <TextArea
                  className="edit-organization-input-box"
                  placeholder="Please Enter Full Address"
                  autoSize={{ minRows: 4, maxRows: 6 }}
                />
              </Form.Item>
            </Row>
          )}

          {isEditClicked && (
            <Row className="display-organization-rows-parent-container">
              <Form.Item
                className="each-single-detail-row-child-container"
                initialValue={isActive}
                name={FORM_NAME_VALUES.isActive}
                label="Status"
              >
                <Radio.Group className="radio-group-for-edit-in-org-mgt">
                  <Radio value={true} className="organization-current-active">
                    Active
                  </Radio>

                  <Radio
                    value={false}
                    className="organization-current-inactive"
                  >
                    InActive
                  </Radio>
                </Radio.Group>
              </Form.Item>
            </Row>
          )}

          <Form.Item className="edit-component-btn-container-parent-at-org">
            <Row className="cancel-and-submit-btn-container-at-org-edit">
              <Button
                size="large"
                className="org-mgt-edit-btn-for-cancel"
                onClick={onClose}
              >
                {isEditClicked ? "Cancel" : "Close"}
              </Button>

              {isEditClicked && (
                <Button
                  size="large"
                  className="org-mgt-edit-btn-for-update"
                  htmlType="submit"
                  disabled={!submittable}
                >
                  Update
                </Button>
              )}
            </Row>
          </Form.Item>
        </Form>
      )}
    </>
  );
};

export default DisplayOrganization;
