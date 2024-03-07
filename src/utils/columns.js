import {
  customizedStringFunc,
  formatPhoneNumberToUSFormat,
} from './commonFunctions';
import dayjs from 'dayjs';
import { DATE_FORMAT_STARTING_FROM_MONTH } from './constant.util';
import { Tooltip } from 'antd';

export const TABLE_FOR_ORGANIZATION_MANAGEMENT = [
  {
    title: 'ID #',
    dataIndex: 'id',
    key: 'id',
    className: 'organization-table-id-cell-text-color',
  },
  {
    title: 'Organizations',
    dataIndex: 'name',
    key: 'name',
    className: 'org-table-common-cell-customization',
  },
  {
    title: 'Email Id',
    dataIndex: 'email',
    key: 'email',
    className: 'organization-table-email-column',
  },
  {
    title: 'Phone Number',
    dataIndex: 'phoneNumber',
    key: 'phoneNumber',
    className: 'org-table-common-cell-customization',
    render: (text) => {
      return <span>{formatPhoneNumberToUSFormat(text)}</span>;
    },
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
    className: 'org-address-cell-customization',
  },
  {
    title: 'Domain',
    dataIndex: 'domain',
    key: 'domain',
    className: 'org-table-common-cell-customization',
  },
  {
    title: 'Status',
    dataIndex: 'isActive',
    key: 'isActive',
    render: (text) => (
      <span
        className={
          text
            ? 'organization-table-status-active'
            : 'organization-table-status-inactive'
        }
      >
        {text ? 'Active' : 'InActive'}
      </span>
    ),
  },
];

export const TABLE_FOR_USER_MANAGEMENT = [
  {
    title: 'ID #',
    dataIndex: 'id',
    key: 'id',
    className: 'users-table-id-cell-text-color',
  },
  {
    title: 'First Name',
    dataIndex: 'firstName',
    key: 'firstName',
    className: 'user-table-common-cell-customization',
  },
  {
    title: 'Last Name',
    dataIndex: 'lastName',
    key: 'lastName',
    className: 'user-table-common-cell-customization',
  },
  {
    title: 'Email Id',
    dataIndex: 'email',
    key: 'email',
    className: 'users-table-email-column',
  },
  {
    title: 'Status',
    dataIndex: 'isActive',
    key: 'isActive',
    render: (text) => (
      <span
        className={
          text ? 'users-table-status-active' : 'users-table-status-inactive'
        }
      >
        {text ? 'Active' : 'InActive'}
      </span>
    ),
  },
];

export const TABLE_FOR_ORDER_MANAGEMENT = [
  {
    title: 'Order ID #',
    dataIndex: 'id',
    key: 'id',
    className: 'order-table-id-cell-text-color',
  },
  {
    title: 'First Name',
    dataIndex: 'firstName',
    key: 'firstName',
    className: 'order-table-common-cell-customization',
    render: (_, record) => {
      return <span>{record?.patientDemography?.firstName}</span>;
    },
  },
  {
    title: 'Last Name',
    dataIndex: 'lastName',
    key: 'lastName',
    className: 'order-table-common-cell-customization',
    render: (_, record) => {
      return <span>{record?.patientDemography?.lastName}</span>;
    },
  },
  {
    title: 'Member ID',
    dataIndex: 'memberId',
    key: 'memberId',
    className: 'order-table-common-cell-customization',
    render: (_, record) => {
      return <span>{record?.patientDemography?.hsMemberID}</span>;
    },
  },
  {
    title: 'Date of Visit',
    dataIndex: 'dateOfVisit',
    key: 'dateOfVisit',
    className: 'order-table-common-cell-customization',
    render: (_, record) => {
      return (
        <span>
          {record?.medicalHistory?.dateOfVisit
            ? dayjs(record?.medicalHistory?.dateOfVisit).format(
                DATE_FORMAT_STARTING_FROM_MONTH
              )
            : 'NA'}
        </span>
      );
    },
  },
  {
    title: 'Latest Updated Date',
    dataIndex: 'updatedAt',
    key: 'updatedAt',
    className: 'order-table-common-cell-customization',
    render: (_, record) => {
      return (
        <span>
          {dayjs(record?.updatedAt).format(DATE_FORMAT_STARTING_FROM_MONTH)}
        </span>
      );
    },
  },
  {
    title: 'Created By',
    dataIndex: 'userData',
    key: 'userData',
    className: 'order-table-common-cell-customization',
    render: (data) => (
      <span>
        {data?.firstName} {data?.lastName}
      </span>
    ),
  },
  {
    title: 'Order Types',
    dataIndex: 'orderTypeData',
    key: 'orderTypeData',
    render: (orderTypeData) => (
      <span
        className={`order-mgt-table-order-type-${orderTypeData?.name
          ?.split(' ')
          ?.join('-')
          ?.toLowerCase()}`}
      >
        {orderTypeData?.name}
      </span>
    ),
  },
  {
    title: 'Order Status',
    dataIndex: 'currentStatus',
    key: 'status',
    render: (text) => (
      <span className={`order-mgt-table-status-${text}`}>{text}</span>
    ),
  },
  {
    title: 'TOI Response',
    dataIndex: 'toiResponse',
    key: 'toiResponse',
    className: 'order-table-common-cell-customization',
    render: (_, record) => {
      return <span>{record?.toiStatus || 'NA'}</span>;
    },
  },

  {
    title: 'Comments',
    dataIndex: 'comments',
    key: 'comments',
    className: 'order-table-common-cell-customization',
    render: (_, record) => {
      return (
        <Tooltip title={record?.orderStatusHistoryData?.[0]?.comment}>
          <span>
            {customizedStringFunc(
              record?.orderStatusHistoryData?.[0]?.comment,
              20
            ) || 'NA'}
          </span>
        </Tooltip>
      );
    },
  },
];

export const TABLE_FOR_CPT_CODES_AT_ORDER_DETAILS_TAB = [
  {
    title: 'CPT Code',
    dataIndex: 'cptCode',
    key: 'cptCode',
    width: '120px',
    className: 'order-details-cpt-code-table-cell-customization',
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
    width: '300px',
    className: 'order-details-cpt-code-table-cell-customization',
  },
  {
    title: 'Dose/Unit',
    dataIndex: 'dose',
    key: 'dose',
    width: '150px',
    className: 'order-details-cpt-code-table-cell-customization',
  },
];

export const TABLE_FOR_CPT_CODES_AT_ORDER_DETAILS_CHEMO = [
  {
    title: 'CPT Code',
    dataIndex: 'cptCode',
    key: 'cptCode',
    width: '110px',
    className: 'order-details-cpt-code-table-cell-customization',
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
    width: '300px',
    className: 'order-details-cpt-code-table-cell-customization',
  },
  {
    title: 'Dose/Unit',
    dataIndex: 'dose',
    key: 'dose',
    width: '120px',
    className: 'order-details-cpt-code-table-cell-customization',
  },
  {
    title: 'Route',
    dataIndex: 'route',
    key: 'route',
    width: '150px',
    className: 'order-details-cpt-code-table-cell-customization',
  },
  {
    title: 'Frequency',
    dataIndex: 'frequency',
    key: 'frequency',
    width: '150px',
    className: 'order-details-cpt-code-table-cell-customization',
  },
  {
    title: 'Cycle',
    dataIndex: 'cycle',
    key: 'cycle',
    width: '150px',
    className: 'order-details-cpt-code-table-cell-customization',
  },
];
