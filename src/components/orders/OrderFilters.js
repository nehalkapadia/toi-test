import React, { useEffect, useState } from "react";
import "../../styles/orders/orderFilters.css";
import { Button, Col, DatePicker, Input, InputNumber, Row, Select } from "antd";
import { useDispatch } from "react-redux";
import { DATE_FORMAT_STARTING_FROM_MONTH, DATE_FORMAT_STARTING_FROM_YEAR, TOTAL_ITEMS_PER_PAGE } from "@/utils/constant.util";
import dayjs from "dayjs";
import { getAllCreatedOrderData } from "@/store/orderSlice";

const OrderFilters = ({ page, userId, Orderstatus, onClose }) => {
  const dispatch = useDispatch();
  const [isClearable, setIsClearable] = useState(false);
  const [filterParams, setFilterparams] = useState({});
  const [orderId, setOrderId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [gender, setGender] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState(null);

  const handleFilterByOrderId = (value) => {
    if (value?.toString()?.trim() === "" || !value) {
      setOrderId("");
      setFilterparams((prevFilterparams) => {
        const { orderId, ...rest } = prevFilterparams;
        return { ...rest };
      });
      return;
    }

    setOrderId(value);
    setFilterparams((prevFilterparams) => ({
      ...prevFilterparams,
      orderId: value,
    }));
  };

  const handleFilterByFirstName = (e) => {
    const value = e.target.value;
    if (value?.trim() === "" || !value) {
      setFirstName("");
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
    if (value?.trim() === "" || !value) {
      setLastName("");
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
    if (dateString === "" || !dateString) {
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

  const handleFilterByGender = (e) => {
    const value = e.target.value;
    if (value?.trim() === "" || !value) {
      setGender("");
      setFilterparams((prevFilterparams) => {
        const { gender, ...rest } = prevFilterparams;
        return { ...rest };
      });
      return;
    }
    setGender(e.target.value);
    setFilterparams((prevFilterparams) => ({
      ...prevFilterparams,
      gender: e.target.value,
    }));
  };

  const handleFilterFunc = () => {
    dispatch(
      getAllCreatedOrderData({
        filters: {
          userId,
          status: Orderstatus[0],
          ...filterParams,
        },
        page,
        pageSize: TOTAL_ITEMS_PER_PAGE,
        orderBy: "updatedAt",
        ascending: false,
      })
    );
  };

  const handleClearFilters = () => {
    setFilterparams({});
    setFirstName("");
    setLastName("");
    setDateOfBirth(null);
    setGender("");
    setOrderId("");
    setIsClearable(false);
    dispatch(
      getAllCreatedOrderData({
        filters: {
          userId,
          status: Orderstatus[0],
        },
        page,
        pageSize: TOTAL_ITEMS_PER_PAGE,
        orderBy: "updatedAt",
        ascending: false,
      })
    );
  };

  const onFilterClose = () => {
    if (!firstName && !lastName && !dateOfBirth && !gender && !orderId) {
      setFilterparams({});
      setGender('');
      setOrderId('');
      setFirstName('');
      setLastName('');
      setDateOfBirth('');
      setIsClearable(false);
      dispatch(
        getAllCreatedOrderData({
          filters: {
            userId,
            status: Orderstatus[0],
          },
          page,
          pageSize: TOTAL_ITEMS_PER_PAGE,
          orderBy: "updatedAt",
          ascending: false,
        })
      );
      onClose();
      return;
    }
    onClose();
  };

  useEffect(() => {
    const hasFilterValues = Object.values(filterParams).some(
      (value) => value !== ""
    );
    setIsClearable(hasFilterValues);
  }, [filterParams]);

  return (
    <div className="order-mgt-filter-element-container">
      <Col className="each-filter-form-elem-single-at-order-mgt">
        <label>Order ID #</label>
        <InputNumber
          className="input-number-at-order-mgt-filter"
          size="large"
          value={orderId}
          onChange={handleFilterByOrderId}
          placeholder="Enter Order ID"
        />
      </Col>
      <Col className="each-filter-form-elem-single-at-order-mgt">
        <label>First Name</label>
        <Input
          size="large"
          value={firstName}
          onChange={handleFilterByFirstName}
          placeholder="Enter First Name"
        />
      </Col>

      <Col className="each-filter-form-elem-single-at-order-mgt">
        <label>Last Name</label>
        <Input
          size="large"
          value={lastName}
          onChange={handleFilterByLastName}
          placeholder="Enter Last Name"
        />
      </Col>

      <Col className="each-filter-form-elem-single-at-order-mgt">
        <label>Date Of Birth</label>
        <DatePicker
          placeholder="Select Date of Birth"
          size="large"
          defaultValue={null}
          format={DATE_FORMAT_STARTING_FROM_MONTH}
          value={dateOfBirth ? dayjs(dateOfBirth) : ""}
          onChange={handleFilterByDateOfBirth}
        />
      </Col>

      <Col className="each-filter-form-elem-single-at-order-mgt">
        <label>Gender</label>
        <Input
          size="large"
          value={gender}
          onChange={handleFilterByGender}
          placeholder="Enter Gender"
        />
      </Col>

      <Row className="order-filter-btn-container">
        <Button
          size="large"
          className="close-filter-btn-drawer-at-order-mgt"
          onClick={isClearable ? handleClearFilters : onFilterClose}
        >
          {isClearable ? "Clear" : "Close"}
        </Button>

        <Button
          size="large"
          disabled={!isClearable}
          className="apply-filter-btn-at-order-mgt"
          onClick={handleFilterFunc}
        >
          Apply
        </Button>
      </Row>
    </div>
  );
};

export default OrderFilters;
