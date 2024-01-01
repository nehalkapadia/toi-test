import React, { useEffect, useState } from 'react';
import '../../styles/users/addUser.css';
import {
  Form,
  Input,
  Row,
  Button,
  message,
  Radio,
  Col,
  Select,
  Skeleton,
  Spin,
} from 'antd';
import {
  FORM_NAME_VALUES,
  API_RESPONSE_MESSAGES,
  TOTAL_ITEMS_PER_PAGE,
  USER_FORM_FIELD_RULES,
} from '@/utils/constant.util';
import { replaceMultipleSpacesWithSingleSpace } from '@/utils/patterns';
import { useDispatch, useSelector } from 'react-redux';
import {
  getUserById,
  getUsersFunc,
  postUserFunc,
  updateUserFunc,
} from '@/store/userTableDataSlice';
import { ROLES_SELECT_OPTIONS_FOR_USER_ADD } from '@/utils/options';

const AddUser = ({
  onClose,
  page,
  organizationName,
  organizationID,
  isEditClicked,
  columnId,
}) => {
  const dispatch = useDispatch();
  const [formData] = Form.useForm();
  const [submittable, setSubmittable] = useState(false);
  const formValues = Form.useWatch([], formData);
  const isLoading = useSelector((state) => state.userTable.viewIsLoading);
  const getUserDetails = useSelector((state) => state.userTable.getUserDetails);
  const [loading, setLoading] = useState(false);
  // const { firstName, lastName, email, roleId, isActive } = getUserDetails;

  const handleSubmitFormData = async (values) => {
    setLoading(true);
    values.firstName = replaceMultipleSpacesWithSingleSpace(values.firstName);
    values.lastName = replaceMultipleSpacesWithSingleSpace(values.lastName);

    if (!isEditClicked) {
      values.isActive = true;
      values.organizationId = organizationID;
      values.roleId = organizationName.toLowerCase() === 'toi' ? 1 : 2;
      dispatch(postUserFunc(values)).then((res) => {
        if (res?.payload?.status) {
          dispatch(
            getUsersFunc({
              page: page,
              perPage: TOTAL_ITEMS_PER_PAGE,
              organizationId: organizationID,
            })
          );
          message.success(API_RESPONSE_MESSAGES.user_added);
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
    } else if (isEditClicked) {
      const payload = { ...getUserDetails, ...values };
      dispatch(updateUserFunc({ id: columnId, payload })).then((res) => {
        if (res?.payload?.status) {
          dispatch(
            getUsersFunc({
              page: page,
              perPage: TOTAL_ITEMS_PER_PAGE,
              organizationId: organizationID,
            })
          );
          message.success(API_RESPONSE_MESSAGES.user_updated);
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

  useEffect(() => {
    if (columnId && isEditClicked) {
      dispatch(getUserById(columnId));
    }
  }, [columnId, isEditClicked]);

  return (
    <>
      {isLoading ? (
        <Skeleton active paragraph={{ row: 16 }} />
      ) : (
        <Form
          form={formData}
          name="add-organization-form"
          onFinish={handleSubmitFormData}
          autoComplete="off"
          preserve={false}
          layout="vertical"
          initialValues={isEditClicked ? getUserDetails : {}}
        >
          <div className="all-form-items-container-at-add-user">
            <Row className="single-rows-for-form-items-container-at-user organization-row-at-add-user">
              <Col className="each-one-for-item-itself-at-user">
                <label className="organization-label-at-add-user">
                  Organization
                </label>
                <p className="organization-value-at-add-user">
                  {organizationName}
                </p>
              </Col>
            </Row>
            <Row className="single-rows-for-form-items-container-at-user">
              <Form.Item
                className="each-one-for-item-itself-at-user"
                name={FORM_NAME_VALUES.first_name}
                label={'First Name'}
                rules={USER_FORM_FIELD_RULES.first_name}
              >
                <Input
                  size="large"
                  className="add-user-form-input-box"
                  placeholder="Please Enter First Name"
                />
              </Form.Item>

              <Form.Item
                className="each-one-for-item-itself-at-user"
                name={FORM_NAME_VALUES.last_name}
                label={'Last Name'}
                rules={USER_FORM_FIELD_RULES.last_name}
              >
                <Input
                  size="large"
                  className="add-user-form-input-box"
                  placeholder="Please Enter Last Name"
                />
              </Form.Item>
            </Row>

            <Row className="single-rows-for-form-items-container-at-user">
              <Form.Item
                className="each-one-for-item-itself-at-user"
                name={FORM_NAME_VALUES.email}
                label={'Email ID'}
                rules={USER_FORM_FIELD_RULES.user_email}
              >
                <Input
                  size="large"
                  className="add-user-form-input-box"
                  placeholder="example@domain.com"
                />
              </Form.Item>

              {!isEditClicked && (
                <Form.Item
                  className="each-one-for-item-itself-at-user"
                  name={FORM_NAME_VALUES.roleId}
                  label={'Role'}
                  rules={USER_FORM_FIELD_RULES.user_role}
                >
                  <Select
                    size="large"
                    disabled
                    className="add-user-form-select-box"
                    placeholder="Select OR Search Role"
                    defaultValue={[
                      organizationName.toLowerCase() === 'toi' ? 1 : 2,
                    ]}
                    options={ROLES_SELECT_OPTIONS_FOR_USER_ADD}
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      (option?.label?.toLocaleLowerCase() ?? '').includes(
                        input?.toLocaleLowerCase()
                      )
                    }
                  />
                </Form.Item>
              )}
            </Row>

            {isEditClicked && (
              <Row className="single-rows-for-form-items-container-at-user">
                <Form.Item
                  className="each-one-for-item-itself-at-user"
                  name={FORM_NAME_VALUES.isActive}
                  label={'Status'}
                >
                  <Radio.Group className="radio-group-for-edit-in-user-mgt">
                    <Radio value={true}>Active</Radio>
                    <Radio value={false}>InActive</Radio>
                  </Radio.Group>
                </Form.Item>
              </Row>
            )}

            <Form.Item className="parent-btn-container-at-add-user">
              <Row className="cancel-and-add-btn-container-at-add-user">
                <Button
                  size="large"
                  className="user-mgt-add-btn-for-cancel"
                  onClick={onClose}
                >
                  Close
                </Button>

                <Button
                  size="large"
                  className="user-mgt-add-btn-for-creating-user"
                  htmlType="submit"
                  disabled={!submittable}
                >
                  {isEditClicked ? 'Update' : 'Add'}
                </Button>
              </Row>
            </Form.Item>
          </div>
          {loading && <Spin fullscreen />}
        </Form>
      )}
    </>
  );
};

export default AddUser;
