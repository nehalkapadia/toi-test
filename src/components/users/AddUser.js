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
  InputNumber,
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
  ALL_PROVIDERS_MAX_LENGTH_COUNT,
  NPI_NUMBER_VALIDATION_ERROR_MESSAGE,
  ORDERING_PROVIDER_ROLE_NUMBER_VALUE,
  ADMIN_ROLE_NUMBER_VALUE,
  CO_ORDINATOR_ROLE_NUMBER_VALUE,
  USER_ROLE_NUMBER_VALUE,
} from '@/utils/constant.util';
import { replaceMultipleSpacesWithSingleSpace } from '@/utils/patterns';
import { useDispatch, useSelector } from 'react-redux';
import {
  getUserById,
  getUsersFunc,
  postUserFunc,
  updateUserFunc,
} from '@/store/userTableDataSlice';
import CustomSpinner from '../CustomSpinner';
import UserModal from './UserModal';
import { AiOutlineEdit } from 'react-icons/ai';
import { logout } from '@/store/authSlice';
import { getRoleOptionsAtAddUser } from '@/utils/options';
import { validateNPINumberLength } from '@/utils/commonFunctions';
import { getValidateOrderingProvider } from '@/store/orderSlice';
import { setDisplayorderingSuccessTick } from '@/store/createOrderFormSlice';
import ProviderDetailsModal from '../orders/createOrder/ProviderDetailsModal';

const AddUser = ({
  onClose,
  page,
  organizationName,
  organizationID,
  isEditClicked,
  columnId,
  drawerHeadingText,
  displayAddUserDrawer,
  organizationType,
  selectedRoleType,
  setSelectedRoleType,
  providerValue,
  setProviderValue,
}) => {
  const dispatch = useDispatch();
  const [formData] = Form.useForm();
  const [submittable, setSubmittable] = useState(false);
  const formValues = Form.useWatch([], formData);

  const isLoadingOrdering = useSelector(
    (state) => state.allOrdersData.loadingOrderingProvider
  );
  const orderingResStatus = useSelector(
    (state) => state.allOrdersData.orderingResStatus
  );
  const orderingSuccessTick = useSelector(
    (state) => state.createOrderTabs.displayOrderingSuccessTick
  );
  const displayOrderingModal = useSelector(
    (state) => state.allOrdersData.displayOrderingModal
  );
  const orderingProviderData =
    useSelector((state) => state.allOrdersData.orderingProviderData) || {};

  const isLoading = useSelector((state) => state.userTable.viewIsLoading);
  const postLoading = useSelector((state) => state.userTable.postLoading);
  const getUserDetails = useSelector((state) => state.userTable.getUserDetails);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [userModal, setUserModal] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const [modalText, setModalText] = useState(LOGGED_IN_EMAIL_UPDATE_TEXT);
  const [disableOrderingBtn, setDisableOrderingBtn] = useState(true);

  const handleChangeOrderingProvider = (value) => {
    setProviderValue(value);
    if (value?.toString()?.trim()?.length === ALL_PROVIDERS_MAX_LENGTH_COUNT) {
      setDisableOrderingBtn(false);
    } else {
      setDisableOrderingBtn(true);
    }

    if (
      orderingResStatus &&
      orderingSuccessTick &&
      orderingProviderData?.npiNumber !== value
    ) {
      dispatch(setDisplayorderingSuccessTick(false));
    } else if (
      orderingResStatus &&
      !orderingSuccessTick &&
      orderingProviderData?.npiNumber == value
    ) {
      dispatch(setDisplayorderingSuccessTick(true));
    }
  };

  const validateOrderingProvider = async () => {
    const npiNumber = formData.getFieldValue(FORM_NAME_VALUES.orderingProvider);
    if (!validateNPINumberLength(npiNumber)) {
      message.error(NPI_NUMBER_VALIDATION_ERROR_MESSAGE);
      return;
    }
    const response = await dispatch(
      getValidateOrderingProvider({ npiNumber, event: 'atCreate' })
    );
    if (!response?.payload?.status) {
      message.error(response?.payload?.message);
      formData.setFieldValue(FORM_NAME_VALUES.first_name, '');
      formData.setFieldValue(FORM_NAME_VALUES.last_name, null);
    }
  };

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
      if (selectedRoleType == ORDERING_PROVIDER_ROLE_NUMBER_VALUE) {
        values.orderingProvider = orderingProviderData?.npiNumber;
      }

      const commonParams = {
        page,
        perPage: TOTAL_ITEMS_PER_PAGE,
        organizationId: organizationID,
      };

      if (!isEditClicked) {
        values.isActive = true;
        values.organizationId = organizationID;

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
      formData.setFieldValue(
        FORM_NAME_VALUES.organization_Name,
        organizationName
      );
    }
  }, [displayAddUserDrawer]);

  useEffect(() => {
    if (displayAddUserDrawer) {
      formData.validateFields({ validateOnly: true }).then(
        () => {
          if (
            selectedRoleType == ADMIN_ROLE_NUMBER_VALUE ||
            selectedRoleType == CO_ORDINATOR_ROLE_NUMBER_VALUE
          ) {
            setSubmittable(true);
          } else if (
            (selectedRoleType == ORDERING_PROVIDER_ROLE_NUMBER_VALUE &&
              orderingSuccessTick) ||
            (selectedRoleType == ORDERING_PROVIDER_ROLE_NUMBER_VALUE &&
              isEditClicked)
          ) {
            setSubmittable(true);
          } else if (selectedRoleType == USER_ROLE_NUMBER_VALUE) {
            setSubmittable(true);
          } else {
            setSubmittable(false);
          }
        },
        (e) => {
          if (e.outOfDate === true) {
            setSubmittable(true);
            formData.setFieldValue(
              FORM_NAME_VALUES.orderingProvider,
              providerValue
            );
            return;
          } else {
            setSubmittable(false);
          }
        }
      );
    } else {
      setSubmittable(false);
    }
    const orgName = formData.getFieldValue(FORM_NAME_VALUES.organization_Name);
    if (!orgName || orgName?.trim()?.length === 0) {
      formData.setFieldValue(
        FORM_NAME_VALUES.organization_Name,
        organizationName
      );
    }
  }, [formValues, selectedRoleType, orderingSuccessTick]);

  useEffect(() => {
    if (columnId && isEditClicked) {
      formData.resetFields();
      dispatch(getUserById(columnId)).then((res) => {
        if (res?.payload?.status) {
          setSelectedRoleType(res?.payload?.data?.roleId);
        }
      });
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

  useEffect(() => {
    if (orderingSuccessTick) {
      formData.setFieldValue(
        FORM_NAME_VALUES.first_name,
        orderingProviderData?.first_name
      );
      formData.setFieldValue(
        FORM_NAME_VALUES.last_name,
        orderingProviderData?.last_name
      );
    }
  }, [orderingSuccessTick]);

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
              className='global-cancel-btn-style'
              onClick={onClose}
            >
              Cancel
            </Button>
          </Col>

          <Col>
            <Button
              size='large'
              className='global-primary-btn-style'
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
                <label>
                  <span className='lable-asterick'>*</span> Organization Name
                </label>
                <h3 className='heading-inside-form-element'>
                  {organizationName}
                </h3>
              </Col>

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
                    disabled={isEditClicked || orderingResStatus}
                    placeholder='Select Role'
                    onChange={(value) => setSelectedRoleType(value)}
                    options={getRoleOptionsAtAddUser({
                      name: organizationName,
                      type: organizationType,
                    })}
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
                  name={FORM_NAME_VALUES.first_name}
                  label={'First Name'}
                  rules={USER_FORM_FIELD_RULES.first_name}
                >
                  <Input
                    size='large'
                    placeholder='Enter First Name'
                    disabled={
                      (isEditClicked &&
                        selectedRoleType ==
                          ORDERING_PROVIDER_ROLE_NUMBER_VALUE) ||
                      selectedRoleType == ORDERING_PROVIDER_ROLE_NUMBER_VALUE
                    }
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
                  name={FORM_NAME_VALUES.last_name}
                  label={'Last Name'}
                  rules={USER_FORM_FIELD_RULES.last_name}
                >
                  <Input
                    size='large'
                    placeholder='Enter Last Name'
                    disabled={
                      (isEditClicked &&
                        selectedRoleType ==
                          ORDERING_PROVIDER_ROLE_NUMBER_VALUE) ||
                      selectedRoleType == ORDERING_PROVIDER_ROLE_NUMBER_VALUE
                    }
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
                  label={'Email ID'}
                  rules={USER_FORM_FIELD_RULES.user_email}
                >
                  <Input
                    size='large'
                    placeholder='example@domain.com'
                    disabled={
                      isEditClicked &&
                      selectedRoleType == ORDERING_PROVIDER_ROLE_NUMBER_VALUE
                    }
                  />
                </Form.Item>
              </Col>
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

            {selectedRoleType == ORDERING_PROVIDER_ROLE_NUMBER_VALUE &&
              !isEditClicked && (
                <Row span={24} gutter={24}>
                  {isLoadingOrdering && <CustomSpinner />}
                  <Col
                    xs={{ span: 24 }}
                    sm={{ span: 12 }}
                    md={{ span: 12 }}
                    lg={{ span: 12 }}
                  >
                    <Form.Item
                      name={FORM_NAME_VALUES.orderingProvider}
                      label={'Ordering Provider'}
                      rules={USER_FORM_FIELD_RULES.orderingProvider}
                      validateStatus={orderingSuccessTick ? 'success' : ''}
                      hasFeedback
                    >
                      <InputNumber
                        size='large'
                        placeholder='Enter NPI Number'
                        className='global-input-number-full-width'
                        onChange={handleChangeOrderingProvider}
                        status='success'
                        maxLength={ALL_PROVIDERS_MAX_LENGTH_COUNT}
                      />
                    </Form.Item>
                    {!orderingSuccessTick && (
                      <Button
                        size='large'
                        className='global-primary-btn-style user-mgt-space-adjusting'
                        disabled={disableOrderingBtn}
                        onClick={validateOrderingProvider}
                      >
                        Validate
                      </Button>
                    )}
                  </Col>
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

      <ProviderDetailsModal
        dataObj={orderingProviderData}
        isSuccessTick={orderingSuccessTick}
        providerType={FORM_NAME_VALUES.orderingProvider}
        shouldDisplayModal={displayOrderingModal}
      />
    </Drawer>
  );
};

export default AddUser;
