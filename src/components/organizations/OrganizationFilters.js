import React, { useEffect, useState } from 'react';
import '../../styles/organizations/organizationFilter.css';
import { Button, Col, Input, InputNumber, Row, Select } from 'antd';
import { ORGANIZATION_STATUS_SELECT_OPTIONS } from '@/utils/options';
import { useDispatch } from 'react-redux';
import { getOrganizationsFunc } from '@/store/organizationSlice';
import { CLEAR, CLOSE, TOTAL_ITEMS_PER_PAGE } from '@/utils/constant.util';

const OrganizationFilters = ({ onClose, page, searchText }) => {
  const dispatch = useDispatch();
  const [isClearable, setIsClearable] = useState(false);
  const [filterParams, setFilterparams] = useState({});
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [domain, setDomain] = useState('');
  const [isActive, setIsActive] = useState('');

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

  const handleFilterByNumber = (value) => {
    if (
      value?.toString()?.trim() === '' ||
      value?.toString()?.trim()?.length <= 0 ||
      !value
    ) {
      setPhoneNumber('');
      setFilterparams((prevFilterparams) => {
        const { phoneNumber, ...rest } = prevFilterparams;
        return { ...rest };
      });
      return;
    }

    setPhoneNumber(value);
    setFilterparams((prevFilterparams) => ({
      ...prevFilterparams,
      phoneNumber: value,
    }));
  };

  const handleFilterByDomain = (e) => {
    const value = e.target.value;
    if (value?.trim() === '' || !value) {
      setDomain('');
      setFilterparams((prevFilterparams) => {
        const { domain, ...rest } = prevFilterparams;
        return { ...rest };
      });
      return;
    }
    setDomain(e.target.value);
    setFilterparams((prevFilterparams) => ({
      ...prevFilterparams,
      domain: e.target.value,
    }));
  };

  const handleFilterByStatus = (value) => {
    if (value === '') {
      setIsActive('');
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
    dispatch(
      getOrganizationsFunc({
        filters: filterParams,
        page: page,
        perPage: TOTAL_ITEMS_PER_PAGE,
        searchText,
      })
    );
  };

  const handleClearFilters = () => {
    setFilterparams({});
    setEmail('');
    setPhoneNumber('');
    setDomain('');
    setIsActive('');
    setIsClearable(false);
    dispatch(
      getOrganizationsFunc({
        page: page,
        perPage: TOTAL_ITEMS_PER_PAGE,
        searchText,
      })
    );
  };

  const onFilterClose = () => {
    if (!email && !phoneNumber && !domain && !isActive) {
      setFilterparams({});
      setEmail('');
      setPhoneNumber('');
      setDomain('');
      setIsActive('');
      setIsClearable(false);
      dispatch(
        getOrganizationsFunc({
          page: page,
          perPage: TOTAL_ITEMS_PER_PAGE,
          searchText,
        })
      );
      onClose();
      return;
    }
    onClose();
  };

  useEffect(() => {
    const hasFilterValues = Object.values(filterParams).some(
      (value) => value !== ''
    );
    setIsClearable(hasFilterValues);
  }, [filterParams]);
  return (
    <div className="all-organization-filter-element-container">
      <Col className="each-filter-form-elem-single-at-org">
        <label>Email Id</label>
        <Input
          size="large"
          placeholder="Enter Email Id"
          value={email}
          onChange={handleFilterByEmail}
        />
      </Col>

      <Col className="each-filter-form-elem-single-at-org">
        <label>Phone Number</label>
        <InputNumber
          className="org-filter-number-input-elem"
          size="large"
          value={phoneNumber}
          placeholder="Enter Phone Number"
          onChange={handleFilterByNumber}
        />
      </Col>

      <Col className="each-filter-form-elem-single-at-org">
        <label>Domain</label>
        <Input
          size="large"
          placeholder="Enter Domain"
          value={domain}
          onChange={handleFilterByDomain}
        />
      </Col>

      <Col className="each-filter-form-elem-single-at-org">
        <label>Status</label>
        <Select
          size="large"
          placeholder="Select Any Status"
          value={isActive}
          options={ORGANIZATION_STATUS_SELECT_OPTIONS}
          onChange={handleFilterByStatus}
        />
      </Col>

      <Row className="org-filter-btn-container">
        <Button
          size="large"
          className="close-filter-btn-drawer-at-org"
          onClick={isClearable ? handleClearFilters : onFilterClose}
        >
          {isClearable ? CLEAR : CLOSE}
        </Button>

        <Button
          size="large"
          disabled={!isClearable}
          className="apply-filter-btn-at-org"
          onClick={handleFilterFunc}
        >
          Apply
        </Button>
      </Row>
    </div>
  );
};

export default OrganizationFilters;
