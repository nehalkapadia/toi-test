import React, { useEffect, useState } from 'react';
import '../../styles/users/userFilters.css';
import { Button, Col, Input, Row, Select, message } from 'antd';
import {
  ORGANIZATION_STATUS_SELECT_OPTIONS,
  ORGANIZATION_WITH_TYPE_SUBMITTER_OPTIONS,
  TOI_ORGANIZATION_WITH_TYPE_REVIEWER_OPTIONS,
} from '@/utils/options';
import { useDispatch } from 'react-redux';
import {
  CLEAR,
  CLOSE,
  ORGANIZATION_TYPE_REVIEWER,
  ORGANIZATION_TYPE_SUBMITTER,
  TOTAL_ITEMS_PER_PAGE,
} from '@/utils/constant.util';
import { getUsersFunc } from '@/store/userTableDataSlice';

const UserFilters = ({
  onClose,
  setPage,
  organizationID,
  filterParams,
  setFilterparams,
  isClearable,
  setIsClearable,
  organizationType,
}) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isActive, setIsActive] = useState(null);
  const [roleId, setRoleId] = useState(null);

  const handleFilterByFirstName = (e) => {
    const value = e.target.value;
    if (
      value?.toString()?.trim() === '' ||
      value?.toString()?.trim()?.length <= 0 ||
      !value
    ) {
      setFirstName('');
      setFilterparams((prevFilterparams) => {
        const { firstName, ...rest } = prevFilterparams;
        return { ...rest };
      });
      return;
    }

    setFirstName(value);
    setFilterparams((prevFilterparams) => ({
      ...prevFilterparams,
      firstName: value,
    }));
  };

  const handleFilterByLastName = (e) => {
    const value = e.target.value;
    if (value?.trim() === '' || !value) {
      setLastName('');
      setFilterparams((prevFilterparams) => {
        const { lastName, ...rest } = prevFilterparams;
        return { ...rest };
      });
      return;
    }
    setLastName(e.target.value);
    setFilterparams((prevFilterparams) => ({
      ...prevFilterparams,
      lastName: e.target.value,
    }));
  };

  const handleFilterByEmail = (e) => {
    const value = e.target.value;
    if (value?.trim() === '' || !value) {
      setEmail('');
      setFilterparams((prevFilterparams) => {
        const { email, ...rest } = prevFilterparams;
        return { ...rest };
      });
      return;
    }
    setEmail(e.target.value);
    setFilterparams((prevFilterparams) => ({
      ...prevFilterparams,
      email: e.target.value,
    }));
  };

  const handleFilterByRoleId = (value) => {
    if (value === undefined || value === null) {
      setRoleId(null);
      setFilterparams((prevFilterparams) => {
        const { roleId, ...rest } = prevFilterparams;
        return { ...rest };
      });
      return;
    }
    setRoleId(value);
    setFilterparams((prevFilterparams) => ({
      ...prevFilterparams,
      roleId: value,
    }));
  };

  const handleFilterByStatus = (value) => {
    if (value === undefined || value === null) {
      setIsActive(null);
      setFilterparams((prevFilterparams) => {
        const { isActive, ...rest } = prevFilterparams;
        return { ...rest };
      });
      return;
    }
    setIsActive(value);
    setFilterparams((prevFilterparams) => ({
      ...prevFilterparams,
      isActive: value,
    }));
  };

  const handleFilterFunc = () => {
    setPage(1);
    dispatch(
      getUsersFunc({
        filters: filterParams,
        page: 1,
        perPage: TOTAL_ITEMS_PER_PAGE,
        organizationId: organizationID,
      })
    ).then((res) => {
      if (res?.payload?.status === false) {
        message.success(res?.payload?.message);
      }
    });
  };

  const handleClearFilters = (e) => {
    const closeBtnClicked = e.target.textContent;
    setPage(1);
    setFilterparams({});
    setEmail('');
    setFirstName('');
    setLastName('');
    setRoleId(null);
    setIsActive(null);
    setIsClearable(false);
    dispatch(
      getUsersFunc({
        page: 1,
        perPage: TOTAL_ITEMS_PER_PAGE,
        organizationId: organizationID,
      })
    );

    if (closeBtnClicked === CLOSE) {
      onClose();
    }
  };

  useEffect(() => {
    const hasFilterValues = Object.values(filterParams).some(
      (value) => value !== ''
    );
    setIsClearable(hasFilterValues);

    if (Object.keys(filterParams).length === 0) {
      setEmail('');
      setFirstName('');
      setLastName('');
      setRoleId(null);
      setIsActive(null);
    }
  }, [filterParams]);

  return (
    <div className='all-user-filter-element-container'>
      <Col className='each-filter-form-elem-single-at-user-mgt'>
        <label>First Name</label>
        <Input
          size='large'
          value={firstName}
          onChange={handleFilterByFirstName}
          placeholder='Enter First Name'
        />
      </Col>

      <Col className='each-filter-form-elem-single-at-user-mgt'>
        <label>Last Name</label>
        <Input
          size='large'
          value={lastName}
          onChange={handleFilterByLastName}
          placeholder='Enter Last Name'
        />
      </Col>

      <Col className='each-filter-form-elem-single-at-user-mgt'>
        <label>Email Id</label>
        <Input
          size='large'
          placeholder='Enter Email Id'
          value={email}
          onChange={handleFilterByEmail}
        />
      </Col>

      <Col className='each-filter-form-elem-single-at-user-mgt'>
        <label>Role</label>
        <Select
          size='large'
          placeholder='Select Any Role'
          value={roleId}
          options={
            organizationType &&
            organizationType?.toLowerCase() === ORGANIZATION_TYPE_REVIEWER
              ? TOI_ORGANIZATION_WITH_TYPE_REVIEWER_OPTIONS
              : organizationType?.toLowerCase() === ORGANIZATION_TYPE_SUBMITTER
              ? ORGANIZATION_WITH_TYPE_SUBMITTER_OPTIONS
              : []
          }
          onChange={handleFilterByRoleId}
          allowClear
        />
      </Col>

      <Col className='each-filter-form-elem-single-at-user-mgt'>
        <label>Status</label>
        <Select
          size='large'
          placeholder='Select Any Status'
          value={isActive}
          options={ORGANIZATION_STATUS_SELECT_OPTIONS}
          onChange={handleFilterByStatus}
          allowClear
        />
      </Col>

      <Row className='user-filter-btn-container'>
        <Button
          size='large'
          className='global-close-btn-style'
          onClick={isClearable ? handleClearFilters : handleClearFilters}
        >
          {isClearable ? CLEAR : CLOSE}
        </Button>

        <Button
          size='large'
          disabled={!isClearable}
          className='global-primary-btn-style'
          onClick={handleFilterFunc}
        >
          Apply
        </Button>
      </Row>
    </div>
  );
};

export default UserFilters;
