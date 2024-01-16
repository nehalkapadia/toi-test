import { formatPhoneNumberToUSFormat } from "./commonFunctions";
import dayjs from "dayjs";
import { DATE_FORMAT_STARTING_FROM_MONTH } from "./constant.util";

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
      return <span>{record?.patientDemography?.firstName}</span>;
    },
  },
  {
    title: "Last Name",
    dataIndex: "lastName",
    key: "lastName",
    className: "order-table-common-cell-customization",
    render: (_, record) => {
      return <span>{record?.patientDemography?.lastName}</span>;
    },
  },
  {
    title: "DOB",
    dataIndex: "dateOfBirth",
    key: "dateOfBirth",
    className: "order-table-common-cell-customization",
    render: (_, record) => {
      return <span>{dayjs(record?.patientDemography?.dob).format("MM-DD-YYYY")}</span>;
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
            ? formatPhoneNumberToUSFormat(record?.patientDemography?.primaryPhoneNumber)
            : "N/A"}
        </span>
      );
    },
  },
  {
    title: "Owner",
    dataIndex: "ownerData",
    key: "ownerData",
    className: "order-table-common-cell-customization",
    render: (data) => (
      <span>
        {data?.firstName} {data?.lastName}
      </span>
    ),
  },
  {
    title: "Created By",
    dataIndex: "userData",
    key: "userData",
    className: "order-table-common-cell-customization",
    render: (data) => (
      <span>
        {data?.firstName} {data?.lastName}
      </span>
    ),
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
    render: (_, record) => {
      return <span>{record?.firstName}</span>;
    },
  },
  {
    title: "Last Name",
    dataIndex: "lastName",
    key: "lastName",
    className: "co-tab-1-common-cell-customization",
    render: (_, record) => {
      return <span>{record?.lastName}</span>;
    },
  },
  {
    title: "DOB",
    dataIndex: "dob",
    key: "dob",
    className: "co-tab-1-common-cell-customization",
    render: (_, record) => {
      return (
        <span>
          {dayjs(record?.dob).format(
            DATE_FORMAT_STARTING_FROM_MONTH
          )}
        </span>
      );
    },
  },
  {
    title: "Gender",
    dataIndex: "gender",
    key: "gender",
    className: "co-tab-1-common-cell-customization",
    render: (_, record) => {
      return <span>{record?.gender}</span>;
    },
  },
  {
    title: "MRN Number",
    dataIndex: "mrn",
    key: "mrn",
    className: "co-tab-1-common-cell-customization",
    render: (_, record) => {
      return <span>{record?.mrn}</span>;
    },
  },
  {
    title: "Address",
    dataIndex: "address",
    key: "address",
    className: "co-tab-1-common-cell-customization",
    width: 180,
    render: (_, record) => {
      return <span>{record?.address}</span>;
    },
  },
  {
    title: "Primary Number",
    dataIndex: "primaryPhoneNumber",
    key: "primaryPhoneNumber",
    className: "co-tab-1-common-cell-customization",
    render: (_, record) => {
      return (
        <span>
          {record?.primaryPhoneNumber
            ? formatPhoneNumberToUSFormat(
                record?.primaryPhoneNumber
              )
            : "Not Available"}
        </span>
      );
    },
  },
];
