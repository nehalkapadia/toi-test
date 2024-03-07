import React, { useEffect, useState } from 'react';
import '../../styles/organizations/organizationFilter.css';
import { Button, Col, Input, InputNumber, Row, Select } from 'antd';
import { ORGANIZATION_STATUS_SELECT_OPTIONS } from '@/utils/options';
import { useDispatch } from 'react-redux';
import { getOrganizationsFunc } from '@/store/organizationSlice';
import { CLEAR, CLOSE, TOTAL_ITEMS_PER_PAGE } from '@/utils/constant.util';

const OrganizationFilters = ({
  onClose,
  setPage,
  searchText,
  filterParams,
  setFilterParams,
  isClearable,
  setIsClearable,
}) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [domain, setDomain] = useState('');
  const [isActive, setIsActive] = useState(null);

  const handleFilterByEmail = (e) => {
    const value = e.target.value;
    if (value?.trim() === '' || !value) {
      setEmail('');
      setFilterParams((prevFilterparams) => {
        const { email, ...rest } = prevFilterparams;
        return { ...rest };
      });

      return;
    }
    setEmail(e.target.value);
    setFilterParams((prevFilterparams) => ({
      ...prevFilterparams,
      email: e.target.value,
    }));
  };

  const handleFilterByNumber = (value) => {
    if (
      value?.toString()?.trim() === '' ||
      value?.toString()?.trim()?.length <= 0 ||
      !value
    ) {
      setPhoneNumber('');
      setFilterParams((prevFilterparams) => {
        const { phoneNumber, ...rest } = prevFilterparams;
        return { ...rest };
      });
      return;
    }

    setPhoneNumber(value);
    setFilterParams((prevFilterparams) => ({
      ...prevFilterparams,
      phoneNumber: value?.toString(),
    }));
  };

  const handleFilterByDomain = (e) => {
    const value = e.target.value;
    if (value?.trim() === '' || !value) {
      setDomain('');
      setFilterParams((prevFilterparams) => {
        const { domain, ...rest } = prevFilterparams;
        return { ...rest };
      });
      return;
    }
    setDomain(e.target.value);
    setFilterParams((prevFilterparams) => ({
      ...prevFilterparams,
      domain: e.target.value,
    }));
  };

  const handleFilterByStatus = (value) => {
    if (value === undefined || value === null) {
      setIsActive(null);
      setFilterParams((prevFilterparams) => {
        const { isActive, ...rest } = prevFilterparams;
        return { ...rest };
      });
      return;
    }
    setIsActive(value);
    setFilterParams((prevFilterparams) => ({
      ...prevFilterparams,
      isActive: value,
    }));
  };

  const handleFilterFunc = () => {
    setPage(1);
    dispatch(
      getOrganizationsFunc({
        filters: filterParams,
        page: 1,
        perPage: TOTAL_ITEMS_PER_PAGE,
        searchText,
      })
    );
  };

  const handleClearFilters = (e) => {
    const closeBtnClicked = e.target.textContent;
    setPage(1);
    setFilterParams({});
    setEmail('');
    setPhoneNumber('');
    setDomain('');
    setIsActive(null);
    setIsClearable(false);
    dispatch(
      getOrganizationsFunc({
        page: 1,
        perPage: TOTAL_ITEMS_PER_PAGE,
        searchText,
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
    if (Object.keys(filterParams)?.length === 0) {
      setEmail('');
      setPhoneNumber('');
      setDomain('');
      setIsActive(null);
    }
  }, [filterParams]);
  return (
    <div className='all-organization-filter-element-container'>
      <Col className='each-filter-form-elem-single-at-org'>
        <label>Email Id</label>
        <Input
          size='large'
          placeholder='Enter Email Id'
          value={email}
          onChange={handleFilterByEmail}
        />
      </Col>

      <Col className='each-filter-form-elem-single-at-org'>
        <label>Phone Number</label>
        <InputNumber
          className='org-filter-number-input-elem hide-spinner'
          size='large'
          value={phoneNumber}
          placeholder='Enter Phone Number'
          onChange={handleFilterByNumber}
        />
      </Col>

      <Col className='each-filter-form-elem-single-at-org'>
        <label>Domain</label>
        <Input
          size='large'
          placeholder='Enter Domain'
          value={domain}
          onChange={handleFilterByDomain}
        />
      </Col>

      <Col className='each-filter-form-elem-single-at-org'>
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

      <Row className='org-filter-btn-container'>
        <Button
          size='large'
          className='close-filter-btn-drawer-at-org'
          onClick={isClearable ? handleClearFilters : handleClearFilters}
        >
          {isClearable ? CLEAR : CLOSE}
        </Button>

        <Button
          size='large'
          disabled={!isClearable}
          className='apply-filter-btn-at-org'
          onClick={handleFilterFunc}
        >
          Apply
        </Button>
      </Row>
    </div>
  );
};

export default OrganizationFilters;
