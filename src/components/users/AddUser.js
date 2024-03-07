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
  Drawer,
} from 'antd';
import {
  FORM_NAME_VALUES,
  API_RESPONSE_MESSAGES,
  TOTAL_ITEMS_PER_PAGE,
  USER_FORM_FIELD_RULES,
  ADD_BUTTON_TEXT,
  UPDATE_BUTTON_TEXT,
  PERCENTAGE_TEXT_FOR_100,
  PERCENTAGE_TEXT_FOR_80,
  ORDER_MODAL_OK_TEXT,
  ORDER_MODAL_CANCEL_TEXT,
  LOGGED_IN_EMAIL_UPDATE_TEXT,
  INACTIVE_YOURSELF,
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
import CustomSpinner from '../CustomSpinner';
import UserModal from './UserModal';
import { AiOutlineEdit } from 'react-icons/ai';
import { logout } from '@/store/authSlice';

const AddUser = ({
  onClose,
  page,
  organizationName,
  organizationID,
  isEditClicked,
  columnId,
  drawerHeadingText,
  displayAddUserDrawer,
}) => {
  const dispatch = useDispatch();
  const [formData] = Form.useForm();
  const [submittable, setSubmittable] = useState(false);
  const formValues = Form.useWatch([], formData);
  const isLoading = useSelector((state) => state.userTable.viewIsLoading);
  const postLoading = useSelector((state) => state.userTable.postLoading);
  const getUserDetails = useSelector((state) => state.userTable.getUserDetails);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [userModal, setUserModal] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const [modalText, setModalText] = useState(LOGGED_IN_EMAIL_UPDATE_TEXT);

  const handleApiResponse = (res, commonParams, event) => {
    if (res?.payload?.status) {
      dispatch(getUsersFunc(commonParams));
      message.success(
        event === 'create'
          ? API_RESPONSE_MESSAGES.user_added
          : API_RESPONSE_MESSAGES.user_updated
      );
      onClose();
      return true;
    } else if (res?.payload?.status === false) {
      message.error(res?.payload?.message);
      return false;
    } else {
      message.error(API_RESPONSE_MESSAGES.err_rest_api);
      return false;
    }
  };

  const handleSubmitFormData = async () => {
    try {
      const values = await formData.validateFields();
      values.firstName = replaceMultipleSpacesWithSingleSpace(values.firstName);
      values.lastName = replaceMultipleSpacesWithSingleSpace(values.lastName);

      const commonParams = {
        page,
        perPage: TOTAL_ITEMS_PER_PAGE,
        organizationId: organizationID,
      };

      if (!isEditClicked) {
        values.isActive = true;
        values.organizationId = organizationID;
        values.roleId = organizationName.toLowerCase() === 'toi' ? 1 : 2;

        const res = await dispatch(postUserFunc(values));
        handleApiResponse(res, commonParams, 'create');
      } else if (isEditClicked) {
        if (columnId === user?.id) {
          if (user?.email !== values?.email) {
            setModalText(LOGGED_IN_EMAIL_UPDATE_TEXT);
            setUserModal(true);
            return;
          } else if (values?.isActive === false) {
            setModalText(INACTIVE_YOURSELF);
            setUserModal(true);
            return;
          }
        }
        const res = await dispatch(
          updateUserFunc({ id: columnId, payload: values })
        );
        handleApiResponse(res, commonParams, 'edit');
      }
    } catch (error) {
      message.error(API_RESPONSE_MESSAGES.err_rest_api);
    }
  };

  const handleOk = async () => {
    setConfirmLoading(true);
    const values = await formData.validateFields();
    values.firstName = replaceMultipleSpacesWithSingleSpace(values.firstName);
    values.lastName = replaceMultipleSpacesWithSingleSpace(values.lastName);

    const commonParams = {
      page,
      perPage: TOTAL_ITEMS_PER_PAGE,
      organizationId: organizationID,
    };

    const res = await dispatch(
      updateUserFunc({ id: columnId, payload: values })
    );
    const response = handleApiResponse(res, commonParams, 'edit');
    setUserModal(false);
    setConfirmLoading(false);
    if (response !== false) {
      dispatch(logout());
    }
  };

  const handleCancel = () => {
    setUserModal(false);
  };

  useEffect(() => {
    if (displayAddUserDrawer) {
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
    if (columnId && isEditClicked) {
      formData.resetFields();
      dispatch(getUserById(columnId));
    }
  }, [columnId, isEditClicked]);

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
      title={`${drawerHeadingText} User`}
      placement='right'
      open={displayAddUserDrawer}
      onClose={onClose}
      closable={true}
      width={isSmallScreen ? PERCENTAGE_TEXT_FOR_100 : PERCENTAGE_TEXT_FOR_80}
      destroyOnClose={true}
      footer={
        <Row gutter={16} className='cancel-and-add-btn-container-at-add-user'>
          <Col>
            <Button
              size='large'
              className='user-mgt-add-btn-for-cancel'
              onClick={onClose}
            >
              Cancel
            </Button>
          </Col>

          <Col>
            <Button
              size='large'
              className='user-mgt-add-btn-for-creating-user'
              disabled={!submittable}
              onClick={handleSubmitFormData}
            >
              {isEditClicked ? UPDATE_BUTTON_TEXT : ADD_BUTTON_TEXT}
            </Button>
          </Col>
        </Row>
      }
    >
      {isLoading ? (
        <Skeleton active paragraph={{ row: 16 }} />
      ) : (
        <>
          <Row span={24} className='organization-row-at-add-user'>
            <Col span={24}>
              <label className='organization-label-at-add-user'>
                Organization
              </label>
              <h3 className='organization-value-at-add-user'>
                {organizationName}
              </h3>
            </Col>
          </Row>

          <Form
            form={formData}
            name='add-user-form'
            onFinish={handleSubmitFormData}
            autoComplete='off'
            preserve={false}
            layout='vertical'
            initialValues={isEditClicked ? getUserDetails : {}}
          >
            <Row span={24} gutter={24}>
              <Col
                xs={{ span: 24 }}
                sm={{ span: 12 }}
                md={{ span: 12 }}
                lg={{ span: 12 }}
              >
                <Form.Item
                  name={FORM_NAME_VALUES.first_name}
                  label={'First Name'}
                  rules={USER_FORM_FIELD_RULES.first_name}
                >
                  <Input size='large' placeholder='Please Enter First Name' />
                </Form.Item>
              </Col>

              <Col
                xs={{ span: 24 }}
                sm={{ span: 12 }}
                md={{ span: 12 }}
                lg={{ span: 12 }}
              >
                <Form.Item
                  name={FORM_NAME_VALUES.last_name}
                  label={'Last Name'}
                  rules={USER_FORM_FIELD_RULES.last_name}
                >
                  <Input size='large' placeholder='Please Enter Last Name' />
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
                {' '}
                <Form.Item
                  name={FORM_NAME_VALUES.email}
                  label={'Email ID'}
                  rules={USER_FORM_FIELD_RULES.user_email}
                >
                  <Input size='large' placeholder='example@domain.com' />
                </Form.Item>
              </Col>

              {!isEditClicked && (
                <Col
                  xs={{ span: 24 }}
                  sm={{ span: 12 }}
                  md={{ span: 12 }}
                  lg={{ span: 12 }}
                >
                  <Form.Item
                    name={FORM_NAME_VALUES.roleId}
                    label={'Role'}
                    rules={USER_FORM_FIELD_RULES.user_role}
                  >
                    <Select
                      size='large'
                      disabled
                      placeholder='Select OR Search Role'
                      defaultValue={[
                        organizationName.toLowerCase() === 'toi' ? 1 : 2,
                      ]}
                      options={ROLES_SELECT_OPTIONS_FOR_USER_ADD}
                      showSearch
                      optionFilterProp='children'
                      filterOption={(input, option) =>
                        (option?.label?.toLocaleLowerCase() ?? '').includes(
                          input?.toLocaleLowerCase()
                        )
                      }
                    />
                  </Form.Item>
                </Col>
              )}
            </Row>

            {isEditClicked && (
              <Row span={24}>
                <Form.Item name={FORM_NAME_VALUES.isActive} label={'Status'}>
                  <Radio.Group className='radio-group-for-edit-in-user-mgt'>
                    <Radio value={true}>Active</Radio>
                    <Radio value={false}>InActive</Radio>
                  </Radio.Group>
                </Form.Item>
              </Row>
            )}
            {postLoading && <CustomSpinner />}
          </Form>
        </>
      )}
      <UserModal
        title={<AiOutlineEdit color='green' size={49} />}
        open={userModal}
        handleOk={handleOk}
        confirmLoading={confirmLoading}
        handleCancel={handleCancel}
        modalText={modalText}
        okText={ORDER_MODAL_OK_TEXT}
        cancelText={ORDER_MODAL_CANCEL_TEXT}
      />
    </Drawer>
  );
};

export default AddUser;
