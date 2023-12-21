import { formatPhoneNumberToUSFormat } from "./commonFunctions";
import dayjs from "dayjs";

export const TABLE_FOR_ORGANIZATION_MANAGEMENT = [
  {
    title: "ID #",
    dataIndex: "id",
    key: "id",
    className: "organization-table-id-cell-text-color",
    render: (text) => {
      return <span>{`#${text}`}</span>;
    },
  },
  {
    title: "Organizations",
    dataIndex: "name",
    key: "name",
    className: "org-table-common-cell-customization",
  },
  {
    title: "Email Id",
    dataIndex: "email",
    key: "email",
    className: "organization-table-email-column",
  },
  {
    title: "Phone Number",
    dataIndex: "phoneNumber",
    key: "phoneNumber",
    className: "org-table-common-cell-customization",
    render: (text) => {
      return <span>{formatPhoneNumberToUSFormat(text)}</span>;
    },
  },
  {
    title: "Address",
    dataIndex: "address",
    key: "address",
    className: "org-address-cell-customization",
  },
  {
    title: "Domain",
    dataIndex: "domain",
    key: "domain",
    className: "org-table-common-cell-customization",
  },
  {
    title: "Status",
    dataIndex: "isActive",
    key: "isActive",
    render: (text) => (
      <span
        className={
          text
            ? "organization-table-status-active"
            : "organization-table-status-inactive"
        }
      >
        {text ? "Active" : "InActive"}
      </span>
    ),
  },
];

export const TABLE_FOR_USER_MANAGEMENT = [
  {
    title: "ID #",
    dataIndex: "id",
    key: "id",
    className: "users-table-id-cell-text-color",
    render: (text) => {
      return <span>{`#${text}`}</span>;
    },
  },
  {
    title: "First Name",
    dataIndex: "firstName",
    key: "firstName",
    className: "user-table-common-cell-customization",
  },
  {
    title: "Last Name",
    dataIndex: "lastName",
    key: "lastName",
    className: "user-table-common-cell-customization",
  },
  {
    title: "Email Id",
    dataIndex: "email",
    key: "email",
    className: "users-table-email-column",
  },
  {
    title: "Status",
    dataIndex: "isActive",
    key: "isActive",
    render: (text) => (
      <span
        className={
          text ? "users-table-status-active" : "users-table-status-inactive"
        }
      >
        {text ? "Active" : "InActive"}
      </span>
    ),
  },
];

export const TABLE_FOR_ORDER_MANAGEMENT = [
  {
    title: "Order ID #",
    dataIndex: "id",
    key: "id",
    className: "order-table-id-cell-text-color",
    render: (text) => {
      return <span>{`#${text}`}</span>;
    },
  },
  {
    title: "First Name",
    dataIndex: "firstName",
    key: "firstName",
    className: "order-table-common-cell-customization",
    render: (_, record) => {
      return <span>{record?.patient?.firstName}</span>;
    },
  },
  {
    title: "Last Name",
    dataIndex: "lastName",
    key: "lastName",
    className: "order-table-common-cell-customization",
    render: (_, record) => {
      return <span>{record?.patient?.lastName}</span>;
    },
  },
  {
    title: "DOB",
    dataIndex: "dateOfBirth",
    key: "dateOfBirth",
    className: "order-table-common-cell-customization",
    render: (_, record) => {
      return <span>{dayjs(record?.patient?.dob).format("MM-DD-YYYY")}</span>;
    },
  },
  {
    title: "Primary Number",
    dataIndex: "primaryPhoneNumber",
    key: "primaryPhoneNumber",
    className: "order-table-common-cell-customization",
    render: (_, record) => {
      return (
        <span>
          {record?.patient?.primaryPhoneNumber
            ? formatPhoneNumberToUSFormat(record?.patient?.primaryPhoneNumber)
            : "N/A"}
        </span>
      );
    },
  },
  {
    title: "Created By",
    dataIndex: "createdBy",
    key: "createdBy",
    className: "order-table-common-cell-customization",
  },
  {
    title: "Status",
    dataIndex: "currentStatus",
    key: "status",
    render: (text) => (
      <span className={`order-mgt-table-status-${text}`}>{text}</span>
    ),
  },
];

export const TABLE_FOR_DISPLAYING_SEARCHED_PATIENT = [
  {
    title: "First Name",
    dataIndex: "firstName",
    key: "firstName",
    className: "co-tab-1-common-cell-customization",
  },
  {
    title: "Last Name",
    dataIndex: "lastName",
    key: "lastName",
    className: "co-tab-1-common-cell-customization",
  },
  {
    title: "DOB",
    dataIndex: "dob",
    key: "dob",
    className: "co-tab-1-common-cell-customization",
  },
  {
    title: "Gender",
    dataIndex: "gender",
    key: "gender",
    className: "co-tab-1-common-cell-customization",
  },
  {
    title: "Address",
    dataIndex: "address",
    key: "address",
    className: "co-tab-1-common-cell-customization",
    width: 180,
  },
  {
    title: "Primary Number",
    dataIndex: "primaryPhoneNumber",
    key: "primaryPhoneNumber",
    className: "co-tab-1-common-cell-customization",
    render: (text) => {
      return (
        <span>
          {text ? formatPhoneNumberToUSFormat(text) : "Not Available"}
        </span>
      );
    },
  },
];
