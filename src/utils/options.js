export const ORGANIZATION_STATUS_SELECT_OPTIONS = [
  {
    value: "",
    label: "Select Any Status",
  },
  {
    value: true,
    label: "Active",
  },
  {
    value: false,
    label: "InActive",
  },
];

export const ROLES_SELECT_OPTIONS_FOR_USER_ADD = [
  {
    value: "",
    label: "Select Any Role",
  },
  {
    value: 1,
    label: "Admin",
  },
  {
    value: 2,
    label: "Member",
  },
];

export const DEFAULT_SELECT_VALUES_FOR_ORDER_MGT = [
  { value: "all", label: "All" },
];

export const ORDER_MANAGEMENT_ORDER_STATUS_OPTIONS = [
  {
    value: "draft",
    label: "Draft",
  },
  {
    value: "complete",
    label: "Complete",
  },
  {
    value: "submitted",
    label: "Submitted",
  },
];

export const ORDER_MANAGEMENT_FILTER_STATUS_OPTIONS = [
  {
    value: "",
    label: "Select Any Status",
  },
  {
    value: "draft",
    label: "Draft",
  },
  {
    value: "complete",
    label: "Complete",
  },
  {
    value: "submitted",
    label: "Submitted",
  },
];

export const ORDER_MANAGEMENT_HEALTH_PLAN_OPTIONS = [
  {
    value: "",
    label: "Select Any Plan",
  },
  {
    value: "value1",
    label: "Value1",
  },
  {
    value: "complete",
    label: "Complete",
  },
  {
    value: "submitted",
    label: "Submitted",
  },
];

export const ORDER_MANAGEMENT_DIAGNOSIS_OPTIONS = [
  {
    value: "",
    label: "Select Any Option",
  },
  {
    value: "value1",
    label: "Value1",
  },
  {
    value: "complete",
    label: "Complete",
  },
  {
    value: "submitted",
    label: "Submitted",
  },
];

export const OrderManagementCreateOrderTabs = (tab2, tab3, tab4) => {
  const tabs = [
    {
      label: "Patient Demographics",
      value: "patientDemographics",
      disabled: false,
    },
    {
      label: "Medical History & Records",
      value: "medicalHistory",
      disabled: tab2,
    },
    {
      label: "Insurance information",
      value: "insuranceInfo",
      disabled: tab3,
    },
    {
      label: "Patient Documents",
      value: "patientDocuments",
      disabled: tab4,
    },
  ];

  return tabs;
};

export const CREATE_ORDER_PATIENT_DOCS_TAB_FILE_TYPE = [
  {
    value: "writtenOrdersForTreatment",
    label: "Written Orders For Treatment",
  },
  {
    value: "mdNotes",
    label: "MD Notes",
  },
  {
    value: "mostRecentLabs",
    label: "Most Recent Labs",
  },
  {
    value: "mostRecentPathology",
    label: "Most Recent Pathology",
  },
  {
    value: "imagingDetails",
    label: "Imaging Details",
  },
];

export const MEDICAL_HISTORY_DIAGNOSIS_OPTIONS = [
  {
    value: "",
    label: "Select Any Option",
  },
  {
    value: "value1",
    label: "Value1",
  },
  {
    value: "value2",
    label: "Value2",
  },
];

export const INSURANCE_INFO_HEALTH_PLAN_OPTIONS = [
  {
    value: "",
    label: "Select Any Option",
  },
  {
    value: "value1",
    label: "Value-1",
  },
];

export const INSURANCE_INFO_LOB_OPTIONS = [
  {
    value: "",
    label: "Select Any Option",
  },
  {
    value: "medicare",
    label: "Medicare",
  },
];

export const DISPLAY_DIFFERENT_TABS_OF_ORDER_MANAGEMENT = [
  {
    key:1,
    label: "Patient Demographics",
  },
  {
    key:2,
    label: "Medical History & Records",
  },
  {
    key:3,
    label: "Insurance information",
  },
  {
    key:4,
    label: "Patient Documents",
  }
]
