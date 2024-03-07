import React, { useEffect, useState } from 'react';
import '../../styles/orders/orderFilters.css';
import { Button, Col, DatePicker, Input, Row, Select } from 'antd';
import { useDispatch } from 'react-redux';
import {
  CLEAR,
  CLOSE,
  DATE_FORMAT_STARTING_FROM_MONTH,
  DATE_FORMAT_STARTING_FROM_YEAR,
  TOTAL_ITEMS_PER_PAGE,
} from '@/utils/constant.util';
import dayjs from 'dayjs';
import { getAllCreatedOrderData } from '@/store/orderSlice';
import { GENDER_OPTIONS } from '@/utils/options';
import { TOI_RESPONSE_DROPDOWN_OPTIONS_FOR_FILTER } from '@/utils/options';

const OrderFilters = ({
  setPage,
  userId,
  Orderstatus,
  onClose,
  filterParams,
  setFilterparams,
  isClearable,
  setIsClearable,
  checkedOrderTypes,
}) => {
  const dispatch = useDispatch();

  const [hsMemberID, setHsMemberID] = useState('');
  const [firstName, setFirstName] = useState('');
  const [gender, setGender] = useState(null);
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(null);
  const [toiResponse, setToiResponse] = useState(null);

  const handleFilterByMemberId = (e) => {
    const value = e.target.value;
    if (value?.trim() === '' || !value) {
      setHsMemberID('');
      setFilterparams((prevFilterparams) => {
        const { hsMemberID, ...rest } = prevFilterparams;
        return { ...rest };
      });
      return;
    }

    setHsMemberID(e.target.value);
    setFilterparams((prevFilterparams) => ({
      ...prevFilterparams,
      hsMemberID: e.target.value,
    }));
  };

  const handleFilterByFirstName = (e) => {
    const value = e.target.value;
    if (value?.trim() === '' || !value) {
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
      firstName: e.target.value,
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

  const handleFilterByDateOfBirth = (_, dateString) => {
    if (dateString === '' || !dateString) {
      setDateOfBirth(null);
      setFilterparams((prevFilterparams) => {
        const { dob, ...rest } = prevFilterparams;
        return { ...rest };
      });
      return;
    }
    setDateOfBirth(dateString);
    setFilterparams((prevFilterparams) => ({
      ...prevFilterparams,
      dob: dayjs(dateString).format(DATE_FORMAT_STARTING_FROM_YEAR),
    }));
  };

  const handleFilterByGender = (value) => {
    if (value === undefined || value === null) {
      setGender(null);
      setFilterparams((prevFilterparams) => {
        const { gender, ...rest } = prevFilterparams;
        return { ...rest };
      });
      return;
    }
    setGender(value);
    setFilterparams((prevFilterparams) => ({
      ...prevFilterparams,
      gender: value,
    }));
  };

  const handleFilterByTOIResponse = (value) => {
    if (value === undefined || value === null) {
      setToiResponse(null);
      setFilterparams((prevFilterparams) => {
        const { toiStatus: toiResponse, ...rest } = prevFilterparams;
        return { ...rest };
      });
      return;
    }
    setToiResponse(value);
    setFilterparams((prevFilterparams) => ({
      ...prevFilterparams,
      toiStatus: value,
    }));
  };

  const getAllOrderDataAtFilter = async (filterParams = {}) => {
    const payload = {
      filters: {
        userId,
        status: Orderstatus,
        orderTypes: checkedOrderTypes,
        ...filterParams,
      },
      page: 1,
      pageSize: TOTAL_ITEMS_PER_PAGE,
      orderBy: 'updatedAt',
      ascending: false,
    };
    await dispatch(getAllCreatedOrderData(payload));
  };

  const handleFilterFunc = async () => {
    setPage(1);
    await getAllOrderDataAtFilter(filterParams);
  };

  const handleClearFilters = (e) => {
    const closeBtnClicked = e.target.textContent;
    setPage(1);
    setFilterparams({});
    setFirstName('');
    setLastName('');
    setDateOfBirth(null);
    setGender(null);
    setHsMemberID('');
    setToiResponse(null);
    setIsClearable(false);
    getAllOrderDataAtFilter({});
    if (closeBtnClicked === CLOSE) {
      onClose();
    }
  };

  useEffect(() => {
    const hasFilterValues = Object.values(filterParams).some(
      (value) => value !== ''
    );
    setIsClearable(hasFilterValues);
    if (Object.keys(filterParams)?.length === 0) {
      setFirstName('');
      setLastName('');
      setDateOfBirth(null);
      setGender(null);
      setHsMemberID('');
      setToiResponse(null);
    }
  }, [filterParams]);

  return (
    <div className='order-mgt-filter-element-container'>
      <Col className='each-filter-form-elem-single-at-order-mgt'>
        <label>Member ID #</label>
        <Input
          className='input-number-at-order-mgt-filter'
          size='large'
          value={hsMemberID}
          onChange={handleFilterByMemberId}
          placeholder='Enter Member ID'
        />
      </Col>
      <Col className='each-filter-form-elem-single-at-order-mgt'>
        <label>First Name</label>
        <Input
          size='large'
          value={firstName}
          onChange={handleFilterByFirstName}
          placeholder='Enter First Name'
        />
      </Col>

      <Col className='each-filter-form-elem-single-at-order-mgt'>
        <label>Last Name</label>
        <Input
          size='large'
          value={lastName}
          onChange={handleFilterByLastName}
          placeholder='Enter Last Name'
        />
      </Col>

      <Col className='each-filter-form-elem-single-at-order-mgt'>
        <label>Date Of Birth</label>
        <DatePicker
          placeholder='Select Date of Birth'
          size='large'
          defaultValue={null}
          format={DATE_FORMAT_STARTING_FROM_MONTH}
          value={dateOfBirth ? dayjs(dateOfBirth) : ''}
          onChange={handleFilterByDateOfBirth}
        />
      </Col>

      <Col className='each-filter-form-elem-single-at-order-mgt'>
        <label>Gender</label>
        <Select
          size='large'
          value={gender}
          onChange={handleFilterByGender}
          placeholder='Select Gender'
          options={GENDER_OPTIONS}
          allowClear
        />
      </Col>

      <Col className='each-filter-form-elem-single-at-order-mgt'>
        <label>TOI Response</label>
        <Select
          size='large'
          value={toiResponse}
          options={TOI_RESPONSE_DROPDOWN_OPTIONS_FOR_FILTER}
          onChange={handleFilterByTOIResponse}
          placeholder='Enter TOI Response'
          allowClear
        />
      </Col>

      <Row className='order-filter-btn-container'>
        <Button
          size='large'
          className='close-filter-btn-drawer-at-order-mgt'
          onClick={isClearable ? handleClearFilters : handleClearFilters}
        >
          {isClearable ? CLEAR : CLOSE}
        </Button>

        <Button
          size='large'
          disabled={!isClearable}
          className='apply-filter-btn-at-order-mgt'
          onClick={handleFilterFunc}
        >
          Apply
        </Button>
      </Row>
    </div>
  );
};

export default OrderFilters;
