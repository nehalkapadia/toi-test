export const ORGANIZATION_STATUS_SELECT_OPTIONS = [
  {
    value: true,
    label: 'Active',
  },
  {
    value: false,
    label: 'InActive',
  },
];

export const ROLES_SELECT_OPTIONS_FOR_USER_ADD = [
  {
    value: 1,
    label: 'Admin',
  },
  {
    value: 2,
    label: 'Member',
  },
];

export const DEFAULT_SELECT_VALUES_FOR_ORDER_MGT = [
  { value: 'all', label: 'All' },
];

export const ORDER_MANAGEMENT_ORDER_TYPES_OPTIONS = [
  {
    value: 'chemo auth',
    label: 'Chemo Auth',
  },
  {
    value: 'office visit',
    label: 'Office Visit',
  },
  {
    value: 'rad onc',
    label: 'Rad Onc',
  },
];

export const ORDER_MANAGEMENT_ORDER_STATUS_OPTIONS = [
  {
    value: 'draft',
    label: 'Draft',
  },
  {
    value: 'submitted',
    label: 'Submitted',
  },
  {
    value: 'completed',
    label: 'Completed',
  },
  {
    value: 'deleted',
    label: 'Deleted',
  },
];

export const ORDER_MANAGEMENT_FILTER_STATUS_OPTIONS = [
  {
    value: 'draft',
    label: 'Draft',
  },
  {
    value: 'completed',
    label: 'Completed',
  },
  {
    value: 'submitted',
    label: 'Submitted',
  },
];

export const OrderManagementCreateOrderTabs = (
  tab1,
  tab2,
  tab3,
  tab4,
  tab5
) => {
  const tabs = [
    {
      label: 'Patient Demographics',
      value: 'patientDemographics',
      disabled: tab1,
    },
    {
      label: 'Medical History & Records',
      value: 'medicalHistory',
      disabled: tab2,
    },
    {
      label: 'Insurance information',
      value: 'insuranceInfo',
      disabled: tab3,
    },
    {
      label: 'Order Details',
      value: 'orderDetails',
      disabled: tab4,
    },
    {
      label: 'Patient Documents',
      value: 'patientDocuments',
      disabled: tab5,
    },
  ];

  return tabs;
};

export const patientDocsCategoryForChemo = (
  writtenOrdersCategory,
  mdNotesCategory
) => {
  const patDocsCategory = [
    {
      value: 'written orders for treatment',
      label: 'Written Orders For Treatment',
      disabled: writtenOrdersCategory,
    },
    {
      value: 'md notes',
      label: 'MD Notes',
      disabled: mdNotesCategory,
    },
  ];

  return patDocsCategory;
};

export const patientDocsCategoryForOfficeVisit = (referralCategory) => {
  const patDocsCate = [
    {
      value: 'md notes',
      label: 'Referral',
      disabled: referralCategory,
    },
  ];

  return patDocsCate;
};

export const patientDocsCategoryForRadiation = (
  mdNotesCategory
) => {
  const patDocsCategory = [
    {
      value: 'md notes',
      label: 'MD Notes',
      disabled: mdNotesCategory,
    },
  ];

  return patDocsCategory;
};

export const INSURANCE_INFO_HEALTH_PLAN_OPTIONS = [
  {
    value: 'healthsun',
    label: 'HealthSun',
  },
];

export const INSURANCE_INFO_LOB_OPTIONS = [
  {
    value: 'medicare',
    label: 'Medicare',
  },
  {
    value: 'medicaid',
    label: 'Medicaid',
  },
  {
    value: 'commercial',
    label: 'Commercial (PPO, HMO)',
  },
];

export const DISPLAY_DIFFERENT_TABS_OF_ORDER_MANAGEMENT = [
  {
    key: 1,
    label: 'Patient Demographics',
  },
  {
    key: 2,
    label: 'Medical History & Records',
  },
  {
    key: 3,
    label: 'Insurance information',
  },
  {
    key: 4,
    label: 'Order Details',
  },
  {
    key: 5,
    label: 'Patient Documents',
  },
];

export const GENDER_OPTIONS = [
  {
    value: 'M',
    label: 'M',
  },
  {
    value: 'F',
    label: 'F',
  },
  {
    value: 'Unknown',
    label: 'Unknown',
  },
];

export const TOI_RESPONSE_DROPDOWN_OPTIONS_FOR_FILTER = [
  {
    value: 'Pending UM review',
    label: 'Pending UM review',
  },
  {
    value: 'Submitted',
    label: 'Order Submitted',
  },
  {
    value: 'Pending additional information',
    label: 'Pending additional information',
  },
  {
    value: 'Response received from payers (Check attachments)',
    label: 'Response received from payers (Check attachments)',
  },
];
