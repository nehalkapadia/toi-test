import React from 'react';
import '../styles/orderManagementDropdown.css';
import { Checkbox, Dropdown, Row } from 'antd';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa6';

const OrderManagementDropdowns = ({
  dropdownTitle,
  dropdownOpen,
  setDropdownOpen,
  dropdownOptions,
  ValuesArray,
  setValuesArray,
  setPage,
}) => {
  const handleOrderTypeCheckbox = (orderType) => {
    if (ValuesArray?.includes(orderType)) {
      setValuesArray(ValuesArray.filter((elem) => elem !== orderType));
    } else {
      setValuesArray([...ValuesArray, orderType]);
    }
    setPage(1);
  };

  const items = [];

  dropdownOptions?.forEach((elem, index) => {
    items.push({
      label: (
        <Checkbox onChange={() => handleOrderTypeCheckbox(elem?.value)}>
          {elem?.label}
        </Checkbox>
      ),
      key: index + 1,
      className: 'filter-checkbox-for-order-type-at-om',
    });
  });

  const handleDropdownChange = (nextOpen, info) => {
    if (info.source === 'trigger' || nextOpen) {
      setDropdownOpen(nextOpen);
    }
  };
  return (
    <>
      <Dropdown
        menu={{ items }}
        trigger={['click']}
        placement='bottom'
        onOpenChange={handleDropdownChange}
        className='order-status-type-dropdown-order-mgt'
        open={dropdownOpen}
      >
        <Row className='order-type-container-at-order-mgt'>
          <h3 className='order-type-at-order-mgt'>{dropdownTitle}</h3>
          {dropdownOpen ? <FaAngleUp /> : <FaAngleDown />}
        </Row>
      </Dropdown>
    </>
  );
};

export default OrderManagementDropdowns;
