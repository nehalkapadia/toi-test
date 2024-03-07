import Image from 'next/image';
import DOC_icon from '../icons/document_icon.svg';
import PDF_icon from '../icons/Pdf.svg';

import {
  ValidateUserName,
  validateOrgDomain,
  validateAnEmail,
  validateOrgName,
  validatePhoneNumber,
} from './formValidations';

export const ADMIN_ROLE_NUMBER_VALUE = 1;
export const USER_ROLE_NUMBER_VALUE = 2;

export const FORM_NAME_VALUES = {
  domain: 'domain',
  email: 'email',
  isActive: 'isActive',
  name: 'name',
  number: 'phoneNumber',
  address: 'address',
  first_name: 'firstName',
  last_name: 'lastName',
  roleId: 'roleId',
};

export const ORGANIZATION_FORM_FIELD_RULES = {
  org_name: [
    { required: true, message: 'Please Add Organization Name' },
    { validator: validateOrgName },
  ],
  org_email: [
    { required: true, message: 'Please Add Organization Email' },
    { validator: validateAnEmail },
  ],
  domain: [
    { required: true, message: 'Please Add Domain Name' },
    { validator: validateOrgDomain },
  ],

  number: [
    { required: true, message: 'Please Add Phone Number' },
    { validator: validatePhoneNumber },
  ],
};

export const API_RESPONSE_MESSAGES = {
  org_added: 'Organization Added Successfully',
  org_updated: 'Organization Updated Successfully',
  org_deleted: 'Organization Deleted Successfully',
  err_rest_api: 'Something went wrong, Please try again later',
  user_added: 'User Added Successfully',
  user_updated: 'User Updated Successfully',
};

export const TOTAL_ITEMS_PER_PAGE = 5;
export const ORG_COLUMN_FOR_USER_MGT = {
  title: 'Organization',
  dataIndex: 'name',
  key: 'name',
};
export const ROLE_COLUMN_FOR_USER_MGT = {
  title: 'Role',
  dataIndex: 'role',
  key: 'role',
};

export const USER_FORM_FIELD_RULES = {
  first_name: [
    { required: true, message: 'First Name is Required' },
    { validator: ValidateUserName },
  ],
  last_name: [
    { required: true, message: 'Last Name is Required' },
    { validator: ValidateUserName },
  ],
  user_email: [
    { required: true, message: 'Email is Required' },
    { validator: validateAnEmail },
  ],
  user_role: [{ required: false, message: 'Role is Required' }],
};

export const CREATE_ORDER_FORM_KEY_NAMES = {
  firstName: 'firstName',
  lastName: 'lastName',
  dob: 'dob',
  gender: 'gender',
  email: 'email',
  primaryPhoneNumber: 'primaryPhoneNumber',
  secondaryPhoneNumber: 'secondaryPhoneNumber',
  preferredLanguage: 'preferredLanguage',
  address: 'address',
  hsMemberID: 'hsMemberID',
  race: 'race',
  diagnosis: 'diagnosis',
  chemoStatus: 'chemoTherapyStatus',
  orderingProvider: 'orderingProvider',
  referringProvider: 'referringProvider',
  physicianRef: 'isReferringPhysician',
  pcpNumber: 'pcpName',
  radiologyStatus: 'isRadiologyStatus',
  radiologyFacility: 'radiologyFacility',
  radiologyDocs: 'radiologyDocs',
  pathologyStatus: 'isPathologyStatus',
  pathologyFacility: 'pathologyFacility',
  pathologyDocs: 'pathologyDocs',
  labStatus: 'isLabStatus',
  labFacility: 'labFacility',
  labDocs: 'labDocs',
  prevAuthorization: 'isPreviousAuthorizationStatus',
  singleMedicialReleaseForm: 'singleMedicialReleaseForm',
  healthPlan: 'healthPlan',
  lob: 'lob',
  medicareId: 'medicareId',
  primarySubscriberNumber: 'primarySubscriberNumber',
  primaryGroupNumber: 'primaryGroupNumber',
  secondarySubscriberNumber: 'secondarySubscriberNumber',
  secondaryGroupNumber: 'secondaryGroupNumber',
  primaryStartDate: 'primaryStartDate',
  primaryEndDate: 'primaryEndDate',
  secondaryStartDate: 'secondaryStartDate',
  secondaryEndDate: 'secondaryEndDate',
  secondaryInsurance: 'secondaryInsurance',
  copyOfInsuranceCard: 'copyOfInsuranceCard',
  cptCode: 'cptCode',
  dose: 'dose',
  route: 'route',
  frequency: 'frequency',
  cycle: 'cycle',
  dateOfVisit: 'dateOfVisit',
  chemotherapyOrdered: 'chemotherapyOrdered',
};

export const CREATE_ORDER_FORM_FIELD_RULES = {
  firstName: [
    { required: true, message: 'First Name is Required' },
    { validator: ValidateUserName },
  ],
  lastName: [
    { required: true, message: 'Last Name is Required' },
    { validator: ValidateUserName },
  ],
  dob: [{ required: true, message: 'Date of Birth is Required' }],
  gender: [{ required: true, message: 'Gender is Required' }],
  number: [
    { required: false, message: 'Please Add Phone Number' },
    { validator: validatePhoneNumber },
  ],
  email: [{ required: false }, { validator: validateAnEmail }],
  preferredLanguage: [{ required: false }],
  address: [{ required: false, message: 'Address is Required' }],
  race: [{ required: false }],
  diagnosis: [{ required: true, message: 'Select Diagnosis Status' }],
  orderingProvider: [
    { required: true, message: 'Ordering Provider is Required' },
  ],
  orderingProviderOptional: [
    { required: false, message: 'Ordering Provider is Required' },
  ],
  referringProvider: [
    { required: true, message: 'Referring Provider is Required' },
  ],
  referringProviderOptional: [
    { required: false, message: 'Referring Provider is Required' },
  ],
  pcpNumber: [{ required: true, message: 'PCP Number is Required' }],
  healthPlan: [{ required: true, message: 'Please Select Health Plan' }],
  lob: [{ required: false, message: 'Please Select LoB' }],
  primarySubscriberNumber: [
    { required: false, message: 'Primary Subscriber Number is Required' },
  ],
  primaryGroupNumber: [
    { required: false, message: 'Primary Group Number is Required' },
  ],
  secondarySubscriberNumber: [
    { required: false, message: 'Secondary Subscriber Number is Required' },
  ],
  secondaryGroupNumber: [
    { required: false, message: 'Secondary Group Number is Required' },
  ],
  copyOfInsuranceCard: [
    { required: false, message: 'Insurance Card Copy is Required' },
  ],
  primaryStartDate: [
    { required: false, message: 'Primary Start Date is Required' },
  ],
  primaryEndDate: [
    { required: false, message: 'Primary End Date is Required' },
  ],
  secondaryStartDate: [
    { required: true, message: 'Secondary Start Date is Required' },
  ],
  secondaryEndDate: [
    { required: true, message: 'Secondary End Date is Required' },
  ],
  medicareId: [{ required: true, message: 'Medicare ID is Required' }],
  hsMemberID: [{ required: true, message: 'Member ID is Required' }],
  cptCode: [{ required: true, message: 'CPT Code is Required' }],
  dose: [{ required: true, message: 'Dose is Required' }],
  route: [{ required: false, message: 'Route is Required' }],
  frequency: [{ required: false, message: 'Frequency is Required' }],
  cycle: [{ required: false, message: 'Cycle is Required' }],
  dateOfVisit: [{ required: true, message: 'Date Of Visit is Required' }],
  chemotherapyOrdered: [
    { required: true, message: 'Chemotherapy Ordered is Required' },
  ],
};

export const getFileTypeForUploadedDocs = (fileName) => {
  const doctype = fileName?.split('.').pop().toLocaleLowerCase();

  switch (doctype) {
    case 'pdf':
      return (
        <Image className='attachment-icons' src={PDF_icon} alt={doctype} />
      );
    case 'doc':
      return (
        <Image className='attachment-icons' src={DOC_icon} alt={doctype} />
      );
    default:
      return (
        <Image className='attachment-icons' src={DOC_icon} alt={doctype} />
      );
  }
};

export const getFormattedDocumentName = (inputStr) => {
  if (!inputStr) {
    return;
  }
  const formattedName = inputStr.replace(/documents\//g, '');
  return formattedName;
};

export const NOT_SELECTED_ANY_CATEGORY_ERROR_MESSAGE =
  'Please Select Any Category First';
export const SAME_SELECTED_CATEGORY_ERROR_MESSAGE =
  'This Category is already selected';
export const SAME_SELECTED_CATEGORY_ERROR_MESSAGE1 =
  'You Have already Uploaded Document for this Category';
export const SELECT_MANDATORY_FIELD_ERROR_MESSAGE =
  'Please Select All the Mandatory Fields';
export const NPI_NUMBER_VALIDATION_ERROR_MESSAGE =
  'Please Enter Valid NPI Number';
export const MEDICARE_CONDITIONAL_VALIDATION = 'medicare';
export const DATE_FORMAT_STARTING_FROM_YEAR = 'YYYY-MM-DD';
export const DATE_FORMAT_STARTING_FROM_MONTH = 'MM/DD/YYYY';
export const DUMMAY_ARR_FOR_ORDER_DETAILS = [0, 0, 0, 0, 0];
export const ERROR_WHEN_CREATING_ORGANIZATION = 'Error When Creating Org';

export const ORG_LABEL = {
  org_name: 'Organization',
  org_email: 'Organization Email',
  domain: 'Domain',
  number: 'Phone Number',
  email: 'Email ID',
  address: 'Address',
};

export const ORG_MESSAGES = {
  address_not_available: 'Address Not Available',
};

export const ACTIVE_STATUS = 'Active';
export const INACTIVE_STATUS = 'Inactive';
export const CANCEL = 'Cancel';
export const CLOSE = 'Close';
export const CLEAR = 'Clear';
export const ARE_YOU_SURE_WANT_TO_CANCEL_ORDER =
  'Are you sure you want to cancel this Order?';
export const MEDICARE_ID = '';
export const CASE_ID = '';

export const ORDER_STATUS = {
  draft: 'draft',
  submitted: 'submitted',
  completed: 'completed',
  cancel: 'cancel',
};

export const SMALL_SUCCESS = 'success';
export const ALLOWED_FILE_TYPE_FOR_UPLOAD = [
  'image/jpeg',
  'image/png',
  'application/pdf',
];
export const ERROR_MESSAGE_FOR_UPLOADED_FILE_TYPE =
  '"You can only upload JPG, PNG, or PDF files!"';
export const MAX_FILE_SIZE_FOR_UPLOAD = 10 * 1024 * 1024;
export const ERROR_MESSAGE_FOR_FILE_SIZE = 'File size must be within 10 MB!';

// While Uploading Documents it show the category name as key.
// Do not change it otherwise whole upload patient file functionality will break.
export const DOCUMENTS_UPLOAD_IN_RADIOLOGY_CATEGORY = 'radiology status';
export const DOCUMENTS_UPLOAD_IN_PATHOLOGY_CATEGORY = 'pathology status';
export const DOCUMENTS_UPLOAD_IN_LAB_STATUS_CATEGORY = 'lab status';
export const DOCUMENTS_UPLOAD_IN_PREV_AUTH_CATEGORY =
  'previous authorization status';
export const DOCUMENTS_UPLOAD_IN_MEDICAL_RELEASE_CATEGORY =
  'single medical release form';
export const DOCUMENTS_UPLOAD_IN_INSURANCE_COPY_CATEGORY =
  'copy of insurance card';
export const DOCUMENTS_UPLOAD_IN_SECONDARY_INSURANCE_CATEGORY =
  'secondary insurance';
export const DOCUMENTS_UPLOAD_IN_WRITTEN_ORDERS_CATEGORY =
  'written orders for treatment';
export const DOCUMENTS_UPLOAD_IN_MD_NOTES_CATEGORY = 'md notes';
export const DOCUMENT_PATIENT_AUTHORIZATION = 'patient auth document';
// Categories ending here.

export const MAX_UPLOAD_DOCUMENTS_PER_CATEGORY = 5;
export const MAX_UPLOAD_DOCUMENTS_OV_RAD_ORDER_TYPE = 2;
export const ERROR_MESSAGE_FOR_MAX_UPLOAD_DOCS =
  'Maximum 5 Documents can be uploaded!';

export const MEDICAL_AND_INSURANCE_FILE_UPLOAD_CATEGORIES = [
  { key: 'radiologyFiles', value: DOCUMENTS_UPLOAD_IN_RADIOLOGY_CATEGORY },
  { key: 'pathologyFiles', value: DOCUMENTS_UPLOAD_IN_PATHOLOGY_CATEGORY },
  { key: 'labStatusFiles', value: DOCUMENTS_UPLOAD_IN_LAB_STATUS_CATEGORY },
  {
    key: 'prevAuthorizationFiles',
    value: DOCUMENTS_UPLOAD_IN_PREV_AUTH_CATEGORY,
  },
  {
    key: 'medicalReleaseFiles',
    value: DOCUMENTS_UPLOAD_IN_MEDICAL_RELEASE_CATEGORY,
  },
  {
    key: 'insuranceCardCopyFiles',
    value: DOCUMENTS_UPLOAD_IN_INSURANCE_COPY_CATEGORY,
  },
  {
    key: 'secondaryInsuranceFiles',
    value: DOCUMENTS_UPLOAD_IN_SECONDARY_INSURANCE_CATEGORY,
  },
];

export const PATIENT_DOCUMENTS_FILE_UPLOAD_CATEGORIES = [
  {
    key: 'writtenOrdersFiles',
    value: DOCUMENTS_UPLOAD_IN_WRITTEN_ORDERS_CATEGORY,
  },
  { key: 'mdNotesFiles', value: DOCUMENTS_UPLOAD_IN_MD_NOTES_CATEGORY },
  { key: 'patientAuthDocFiles', value: DOCUMENT_PATIENT_AUTHORIZATION },
];
export const ARE_YOU_SURE_WANT_DRAFT_ORDER =
  'Are you sure you want to save this Order as Draft?';
export const ORDER_MODAL_OK_TEXT = 'Yes';
export const ORDER_MODAL_CANCEL_TEXT = 'No';
export const MISSING_REQUIRED_FIELDS = 'Missing Required Fields';
export const ARE_YOU_SURE_YOU_WANT_TO_SUBMIT_THE_ORDER_MESSAGE =
  'Are you sure you want to submit this Order ?';
export const ORDER_HAS_BEEN_CANCELED = 'This Order has been canceled';

export const MEDICAL_HISTORY_FIELDS_ONLY = {
  Chemo: [
    'diagnosis',
    'chemoTherapyStatus',
    'orderingProvider',
    'referringProvider',
    'isReferringPhysician',
    'pcpName',
    'diagnosisId',
    'dateOfVisit',
    'chemotherapyOrdered',
  ],
  'Office Visit': ['diagnosis', 'dateOfVisit'],
  Radiation: ['diagnosis', 'dateOfVisit'],
};

export const MEDICAL_RECORD__FIELDS_ONLY = {
  Chemo: [
    'isRadiologyStatus',
    'isPathologyStatus',
    'isLabStatus',
    'isPreviousAuthorizationStatus',
    'labFacility',
    'pathologyFacility',
    'radiologyFacility',
  ],
  'Office Visit': [],
  Radiation: [],
};

export const ALL_PROVIDERS_MAX_LENGTH_COUNT = 10;
export const PHONE_NUMBER_MAX_LENGTH_COUNT = 10;
export const MEDICAL_HISTORY_AND_RECORD_CREATED_MESSAGE =
  'Medical History and Record has been created successfully';
export const MEDICAL_HISTORY_AND_RECORD_UPDATED_MESSAGE =
  'Medical History and Record has been updated successfully';
export const SUCCESS_TEXT_ONLY = 'success';
export const ERROR_TEXT_ONLY = 'error';

export const CREATE_NEW_RECORD_AT_PATIENT_DEMO =
  ' Please continue creating a new record';
export const SELECT_AT_LIST_RADIOLOGY_FILE =
  'Please select at least one radiology file';
export const SELECT_AT_LIST_PATHOLOGY_FILE =
  'Please select at least one pathology file';
export const SELECT_AT_LIST_LAB_FILE = 'Please select at least one lab file';
export const SELECT_AT_LIST_PREV_AUTH_FILE =
  'Please select at least one previous authorization file';
export const SELECT_AT_LIST_MEDICAL_RELEASE_FILE =
  'Please select at least one medical release file';
export const SELECT_AT_LIST_INSURANCE_CARD_FILE =
  'Please select at least one insurance card file';
export const SELECT_AT_LIST_SECONDARY_INSURANCE_FILE =
  'Please select at least one secondary insurance file';
export const SELECT_AT_LIST_WRITTEN_ORDER_FILE =
  'Please select at least one written order file';
export const SELECT_AT_LIST_MD_NOTES_FILE =
  'Please select at least one md notes file';
export const LOGGED_IN_SUCCESSFULLY_MESSAGE = 'Logged-In Successfully';
export const EDIT = 'Edit';
export const CREATE = 'Create';
export const ARE_YOU_SURE_WANT_TO_DELETE_ORDER =
  'Are you sure you want to delete this Order?';
export const NA = 'N/A';
export const PCP_AND_REFERRING_PROVIDER_NOT_SAME_WARNING =
  'PCP and Referring Provider should not be same';
export const FIRST_VALIDATE_REFERRING_NUMBER =
  'Please first validate referring provider, then try again.';
export const FIRST_VALIDATE_PCP_NUMBER =
  'Please first validate PCP, OR Click the Checkbox.';
export const TOGGLER_KEYS_FOR_MEDICAL_TAB = [
  'chemoTherapyStatus',
  'isRadiologyStatus',
  'isPathologyStatus',
  'isLabStatus',
  'isPreviousAuthorizationStatus',
];
export const INSURANCE_INFO_ALL_FIELDS_ARRAY = [
  'healthPlan',
  'lob',
  'medicareId',
  'primarySubscriberNumber',
  'primaryGroupNumber',
  'secondarySubscriberNumber',
  'secondaryGroupNumber',
  'primaryStartDate',
  'primaryEndDate',
  'secondaryStartDate',
  'secondaryEndDate',
  'patientId',
];

export const ALL_DATE_RELATED_FIELDS_FOR_CREATE_ORDER = [
  'dob',
  'primaryStartDate',
  'primaryEndDate',
  'secondaryStartDate',
  'secondaryEndDate',
  'dateOfVisit',
  'chemotherapyOrdered',
];
export const FALSE_PROVIDER_NUMBER_FOR_MEDICAL_TAB = '0000000000';
export const SEARCH_PATIENT_FIELDS_NAME = [
  'firstName',
  'lastName',
  'dob',
  'gender',
  'hsMemberID',
];
export const MIN_FIELDS_FOR_ENABLE_SEARCH_AT_PATIENT_DEMO = [
  'firstName',
  'lastName',
  'dob',
  'gender',
];
export const PROVIDER_DETAILS = 'Provider Details';
export const VALIDATE_PROVIDER_DETAILS = 'Validate Provider Details';
export const YES = 'Yes';
export const NO = 'No';
export const PLEASE_FILL_MEDICAL_HISTORY_AND_RECORD_TAB =
  'Please fill medical history and record data';
export const PLEASE_FILL_INSURANCE_INFO_TAB =
  'Please fill insurance information data';
export const PLEASE_FILL_ORDER_DETAILS_TAB = 'Please fill order details tab';
export const ADD_BUTTON_TEXT = 'Add';
export const UPDATE_BUTTON_TEXT = 'Update';
export const PERCENTAGE_TEXT_FOR_100 = '100%';
export const PERCENTAGE_TEXT_FOR_80 = '80%';
export const SEARCH_RESULT_SUCCESS = 'Search Results fetched Successfully';
export const PATIENT_NO_RECORD_FOUND = 'No Record Found for entered details';
export const LOGGED_IN_EMAIL_UPDATE_TEXT =
  'Are you sure you want to update email? If you proceed with the email update, you will need to log in again using the newly updated email address.';
export const INACTIVE_YOURSELF =
  'Are you sure you want to inactive yourself? If you proceed with the inactivation, you will not be able to log in to the system.';
export const ERROR_IN_FILE_DOWNLOADING = 'Error in file downloading';
export const DEFAULT_ORDER_TYPE = 'Chemo';
export const CHEMO_ORDER_TYPE = 'Chemo';
export const OFFICE_VISIT_ORDER_TYPE = 'Office Visit';
export const RADIATION_ORDER_TYPE = 'Radiation';
export const HEALTH_PLAN_DEFAULT_VALUE = 'healthsun';
export const USER_CANT_ACCESS_OR_EXIST =
  'The user is either inaccessible or does not exist!';
export const PLEASE_LOGOUT_AND_LOGIN_BACK = 'Please login back.';
export const RADIOLOGY = 'radiology';
export const PATHOLOGY = 'pathology';
export const LAB = 'lab';
export const PREVIOUS_AUTHORIZATION = 'previous authorization';
export const TITLE_MAPPING = {
  '/login': 'TOI | Login',
  '/': 'TOI | Login',
  '/privacy-policy': 'TOI | Privacy Policy',
  '/order-management': 'TOI | Dashboard',
  '/organization-management': 'TOI | Dashboard',
  '/user-management': 'TOI | User Management',
  '/order-management/create': 'TOI | Order Management',
};
export const PLEASE_SELECT_ONE_CPT_CODE = 'Please Select One CPT Code';
export const BTN_TEXT_FOR_DRAFT_IN_LOWER_CASE = 'yes';
export const BTN_TEXT_FOR_NEXT_IN_LOWER_CASE = 'next';
export const THIS_CPT_CODE_ALREADY_EXIST =
  'You have already added this CPT Code';
export const CPT_CODE_DESCRIPTION_MAX_LENGTH = 50;
export const MAX_CPT_CODE_TO_BE_UPLOADED = 25;
export const MAX_CPT_CODE_UPLOAD_WARNING =
  'You can add maximum of 25 CPT Codes';
export const USER_ROLE_HAS_BEEN_CHANGED = "The user's role has been changed.";
export const SECONDARY_DATES_OBJECT_ONLY = [
  'secondaryStartDate',
  'secondaryEndDate',
];
export const ORDER_TYPES_ARRAY = ['Chemo', 'Office Visit', 'Radiation'];
export const TYPE_TEXT_FOR_ORDER_TYPE = 'type';
export const MEDICAL_HISTORY_PROVIDER_TYPES = {
  orderingProvider: 'orderingProvider',
  referringProvider: 'referringProvider',
  pcpName: 'pcpName',
};
export const WELCOME_TO_TOI = 'The Oncology Institute of Hope & Innovation';
export const PHYSICIAN_PORTAL = 'Physician Portal';