import React, { useEffect, useState } from 'react';
import '../../styles/organizations/addOrganization.css';
import {
  Form,
  Input,
  Row,
  Button,
  InputNumber,
  message,
  Col,
  Radio,
  Drawer,
  Skeleton,
  Select,
} from 'antd';
import {
  FORM_NAME_VALUES,
  ORGANIZATION_FORM_FIELD_RULES,
  API_RESPONSE_MESSAGES,
  TOTAL_ITEMS_PER_PAGE,
  ORG_LABEL,
  ADD_BUTTON_TEXT,
  UPDATE_BUTTON_TEXT,
  PERCENTAGE_TEXT_FOR_100,
  PERCENTAGE_TEXT_FOR_80,
} from '@/utils/constant.util';
import { replaceMultipleSpacesWithSingleSpace } from '@/utils/patterns';
import { useDispatch, useSelector } from 'react-redux';
import {
  getOrganizationsById,
  getOrganizationsFunc,
  postOrganizationFunc,
  updateOrganizationFunc,
} from '@/store/organizationSlice';
import { formatPhoneNumberForInput } from '@/utils/commonFunctions';
import CustomSpinner from '../CustomSpinner';
import { ORGANIZATION_TYPE_SELECT_OPTIONS } from '@/utils/options';

const { TextArea } = Input;

const AddOrganization = ({
  columnId,
  isEditClicked,
  onClose,
  page,
  drawerHeadingText,
  displayAddOrgDrawer,
}) => {
  const dispatch = useDispatch();
  const [formData] = Form.useForm();
  const [submittable, setSubmittable] = useState(false);
  const formValues = Form.useWatch([], formData);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const isLoading = useSelector((state) => state.organizationTable.isLoading);
  const viewIsLoading = useSelector(
    (state) => state.organizationTable.viewIsLoading
  );
  const getOrgDetails =
    useSelector((state) => state.organizationTable.getOrgDetails) || {};

  const handleApiResponse = (res, page, event) => {
    if (res?.payload?.status) {
      dispatch(getOrganizationsFunc({ page, perPage: TOTAL_ITEMS_PER_PAGE }));
      message.success(
        event === 'create'
          ? API_RESPONSE_MESSAGES.org_added
          : API_RESPONSE_MESSAGES.org_updated
      );
      onClose();
    } else if (res?.payload?.status === false) {
      message.error(res?.payload?.message);
    } else {
      message.error(API_RESPONSE_MESSAGES.err_rest_api);
    }
  };

  const handleSubmitFormData = async () => {
    try {
      const values = await formData.validateFields();

      values.domain =
        replaceMultipleSpacesWithSingleSpace(values?.domain) || '';
      values.address =
        replaceMultipleSpacesWithSingleSpace(values?.address) || '';
      values.phoneNumber = values?.phoneNumber?.toString() || '';

      if (!isEditClicked) {
        values.isActive = true;
        values.name = replaceMultipleSpacesWithSingleSpace(values?.name) || '';

        const res = await dispatch(postOrganizationFunc(values));

        handleApiResponse(res, page, 'create');
      } else if (isEditClicked) {
        const payload = {
          name: getOrgDetails?.name,
          ...values,
        };
        const res = await dispatch(
          updateOrganizationFunc({ id: columnId, payload })
        );

        handleApiResponse(res, page, 'edit');
      }
    } catch (error) {
      message.error(API_RESPONSE_MESSAGES.err_rest_api);
    }
  };

  useEffect(() => {
    if (columnId && isEditClicked) {
      formData.resetFields();
      dispatch(getOrganizationsById(columnId));
    }
  }, [columnId, isEditClicked]);

  useEffect(() => {
    if (displayAddOrgDrawer) {
      formData.validateFields({ validateOnly: true }).then(
        () => {
          setSubmittable(true);
        },
        () => {
          setSubmittable(false);
        }
      );
    } else {
      setSubmittable(false);
    }
  }, [formValues]);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 500);
    };
    if (typeof window !== 'undefined') {
      handleResize();
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, []);

  return (
    <Drawer
      title={`${drawerHeadingText} Organization`}
      placement='right'
      open={displayAddOrgDrawer}
      onClose={onClose}
      closable={true}
      width={isSmallScreen ? PERCENTAGE_TEXT_FOR_100 : PERCENTAGE_TEXT_FOR_80}
      destroyOnClose={true}
      footer={
        <Row className='cancel-and-add-btn-container-at-add-org'>
          <Button
            size='large'
            className='global-cancel-btn-style'
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button
            size='large'
            className='global-primary-btn-style'
            onClick={handleSubmitFormData}
            disabled={!submittable}
          >
            {isEditClicked ? UPDATE_BUTTON_TEXT : ADD_BUTTON_TEXT}
          </Button>
        </Row>
      }
    >
      {viewIsLoading ? (
        <Skeleton active paragraph={{ row: 16 }} />
      ) : (
        <Form
          form={formData}
          name='add-organization-form'
          autoComplete='off'
          onFinish={handleSubmitFormData}
          preserve={false}
          layout='vertical'
          initialValues={isEditClicked ? getOrgDetails : {}}
        >
          <Row span={24} gutter={24}>
            {isEditClicked ? (
              <Col
                xs={{ span: 24 }}
                sm={{ span: 12 }}
                md={{ span: 12 }}
                lg={{ span: 12 }}
              >
                <label>
                  <span className='lable-asterick'>*</span> Organization Name
                </label>
                <h3 className='heading-inside-form-element'>{getOrgDetails?.name}</h3>
              </Col>
            ) : (
              <Col
                xs={{ span: 24 }}
                sm={{ span: 12 }}
                md={{ span: 12 }}
                lg={{ span: 12 }}
              >
                <Form.Item
                  name={FORM_NAME_VALUES.name}
                  label={ORG_LABEL.org_name}
                  rules={ORGANIZATION_FORM_FIELD_RULES.org_name}
                >
                  <Input size='large' placeholder='Please Enter Organization' />
                </Form.Item>
              </Col>
            )}

            <Col
              xs={{ span: 24 }}
              sm={{ span: 12 }}
              md={{ span: 12 }}
              lg={{ span: 12 }}
            >
              <Form.Item
                name={FORM_NAME_VALUES.organizationType}
                label={ORG_LABEL.organizationType}
                rules={ORGANIZATION_FORM_FIELD_RULES.organizationType}
              >
                <Select
                  size='large'
                  placeholder='Select Organization Type'
                  options={ORGANIZATION_TYPE_SELECT_OPTIONS}
                  disabled={isEditClicked}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row span={24} gutter={24}>
            <Col
              xs={{ span: 24 }}
              sm={{ span: 12 }}
              md={{ span: 12 }}
              lg={{ span: 12 }}
            >
              <Form.Item
                name={FORM_NAME_VALUES.email}
                label={ORG_LABEL.email}
                rules={ORGANIZATION_FORM_FIELD_RULES.org_email}
              >
                <Input
                  size='large'
                  type='email'
                  placeholder='example@domain.com'
                />
              </Form.Item>
            </Col>

            <Col
              xs={{ span: 24 }}
              sm={{ span: 12 }}
              md={{ span: 12 }}
              lg={{ span: 12 }}
            >
              <Form.Item
                name={FORM_NAME_VALUES.number}
                label={ORG_LABEL.number}
                rules={ORGANIZATION_FORM_FIELD_RULES.number}
              >
                <InputNumber
                  size='large'
                  className='global-input-number-full-width'
                  placeholder='Please Enter Phone Number'
                  formatter={(value) => formatPhoneNumberForInput(value)}
                  parser={(value) => value.replace(/\D/g, '')}
                  maxLength={14}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row span={24} gutter={24}>
            <Col
              xs={{ span: 24 }}
              sm={{ span: 12 }}
              md={{ span: 12 }}
              lg={{ span: 12 }}
            >
              <Form.Item
                name={FORM_NAME_VALUES.domain}
                label={ORG_LABEL.domain}
                rules={ORGANIZATION_FORM_FIELD_RULES.domain}
              >
                <Input size='large' placeholder='Please Enter Domain Name' />
              </Form.Item>
            </Col>
          </Row>

          <Row span={24} gutter={24}>
            <Col
              xs={{ span: 24 }}
              sm={{ span: 12 }}
              md={{ span: 12 }}
              lg={{ span: 12 }}
            >
              <Form.Item
                name={FORM_NAME_VALUES.address}
                label={ORG_LABEL.address}
              >
                <TextArea
                  placeholder='Please Enter Full Address'
                  autoSize={{ minRows: 4, maxRows: 6 }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row span={24} gutter={24}>
            {isEditClicked && (
              <Col
                xs={{ span: 24 }}
                sm={{ span: 12 }}
                md={{ span: 12 }}
                lg={{ span: 12 }}
              >
                <Form.Item
                  initialValue={getOrgDetails?.isActive}
                  name={FORM_NAME_VALUES.isActive}
                  label='Status'
                >
                  <Radio.Group className='radio-group-for-edit-in-org-mgt'>
                    <Radio value={true} className='organization-current-active'>
                      Active
                    </Radio>

                    <Radio
                      value={false}
                      className='organization-current-inactive'
                    >
                      InActive
                    </Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
            )}
          </Row>
          {isLoading && <CustomSpinner />}
        </Form>
      )}
    </Drawer>
  );
};

export default AddOrganization;
