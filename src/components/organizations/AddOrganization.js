import React, { useEffect, useState } from 'react';
import '../../styles/organizations/addOrganization.css';
import { Form, Input, Row, Button, InputNumber, message, Spin } from 'antd';
import {
  FORM_NAME_VALUES,
  ORGANIZATION_FORM_FIELD_RULES,
  API_RESPONSE_MESSAGES,
  TOTAL_ITEMS_PER_PAGE,
  ERROR_WHEN_CREATING_ORGANIZATION,
  ORG_LABEL
} from '@/utils/constant.util';
import { replaceMultipleSpacesWithSingleSpace } from '@/utils/patterns';
import { useDispatch } from 'react-redux';
import {
  getOrganizationsFunc,
  postOrganizationFunc,
} from '@/store/organizationSlice';
import { formatPhoneNumberForInput } from '@/utils/commonFunctions';

const { TextArea } = Input;

const AddOrganization = ({ onClose, page }) => {
  const dispatch = useDispatch();
  const [formData] = Form.useForm();
  const [submittable, setSubmittable] = useState(false);
  const [loading, setLoading] = useState(false);
  const formValues = Form.useWatch([], formData);

  const handleSubmitFormData = async (values) => {
    try {
      setLoading(true);
      values.isActive = true;
      values.name = replaceMultipleSpacesWithSingleSpace(values.name);
      values.domain = replaceMultipleSpacesWithSingleSpace(values.domain);
      values.address = replaceMultipleSpacesWithSingleSpace(values.address);
      values.phoneNumber = values.phoneNumber.toString();
      dispatch(postOrganizationFunc(values)).then((res) => {
        if (res?.payload?.status) {
          dispatch(
            getOrganizationsFunc({ page: page, perPage: TOTAL_ITEMS_PER_PAGE })
          );
          message.success(API_RESPONSE_MESSAGES.org_added);
          setLoading(false);
          onClose();
        } else if (res?.payload?.status === false) {
          message.error(res?.payload?.message);
          setLoading(false);
        } else {
          message.error(API_RESPONSE_MESSAGES.err_rest_api);
          setLoading(false);
        }
      });
    } catch (error) {
      message.error(error?.message ? error?.message : ERROR_WHEN_CREATING_ORGANIZATION);
      setLoading(false);
    }
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

  return (
    <Form
      form={formData}
      name="add-organization-form"
      onFinish={handleSubmitFormData}
      autoComplete="off"
      preserve={false}
      layout="vertical"
    >
      <div className="all-form-items-container-at-add-organization">
        <Row className="single-rows-for-form-items-container">
          <Form.Item
            className="each-one-for-item-itself-at-org"
            name={FORM_NAME_VALUES.name}
            label={ORG_LABEL.org_name}
            rules={ORGANIZATION_FORM_FIELD_RULES.org_name}
          >
            <Input
              size="large"
              className="add-org-form-input-box"
              placeholder="Please Enter Organization Name"
            />
          </Form.Item>

          <Form.Item
            className="each-one-for-item-itself-at-org"
            name={FORM_NAME_VALUES.email}
            label={ORG_LABEL.email}
            rules={ORGANIZATION_FORM_FIELD_RULES.org_email}
          >
            <Input
              size="large"
              className="add-org-form-input-box"
              type="email"
              placeholder="example@domain.com"
            />
          </Form.Item>
        </Row>

        <Row className="single-rows-for-form-items-container">
          <Form.Item
            className="each-one-for-item-itself-at-org"
            name={FORM_NAME_VALUES.domain}
            label={ORG_LABEL.domain}
            rules={ORGANIZATION_FORM_FIELD_RULES.domain}
          >
            <Input
              size="large"
              className="add-org-form-input-box"
              placeholder="Please Enter Domain Name"
            />
          </Form.Item>

          <Form.Item
            className="each-one-for-item-itself-at-org"
            name={FORM_NAME_VALUES.number}
            label={ORG_LABEL.number}
            rules={ORGANIZATION_FORM_FIELD_RULES.number}
          >
            <InputNumber
              type="tel"
              size="large"
              className="add-org-form-input-box add-org-number-input"
              placeholder="Please Enter Phone Number"
              formatter={(value) => formatPhoneNumberForInput(value)}
              parser={(value) => value.replace(/\D/g, '')}
              maxLength={14}
            />
          </Form.Item>
        </Row>

        <Row className="single-rows-for-form-items-container">
          <Form.Item
            className="each-one-for-item-itself-at-org"
            name={FORM_NAME_VALUES.address}
            label={ORG_LABEL.address}
          >
            <TextArea
              className="add-org-form-input-box"
              placeholder="Please Enter Full Address"
              autoSize={{ minRows: 4, maxRows: 6 }}
            />
          </Form.Item>
        </Row>

        <Form.Item className="parent-btn-container-at-add-org">
          <Row className="cancel-and-add-btn-container-at-add-org">
            <Button
              size="large"
              className="org-mgt-add-btn-for-cancel"
              onClick={onClose}
            >
              Close
            </Button>

            <Button
              size="large"
              className="org-mgt-add-btn-for-creating-org"
              htmlType="submit"
              disabled={!submittable}
            >
              Add
            </Button>
          </Row>
        </Form.Item>
      </div>
      {loading && <Spin fullscreen />}
    </Form>
  );
};

export default AddOrganization;
