import Image from "next/image";
import DOC_icon from "../icons/document_icon.svg";
import PDF_icon from "../icons/Pdf.svg";

import {
  ValidateUserName,
  validateOrgDomain,
  validateAnEmail,
  validateOrgName,
  validatePhoneNumber,
} from "./formValidations";

export const FORM_NAME_VALUES = {
  domain: "domain",
  email: "email",
  isActive: "isActive",
  name: "name",
  number: "phoneNumber",
  address: "address",
  first_name: "firstName",
  last_name: "lastName",
  roleId: "roleId",
};

export const ORGANIZATION_FORM_FIELD_RULES = {
  org_name: [
    { required: true, message: "Please Add Organization Name" },
    { validator: validateOrgName },
  ],
  org_email: [{ required: true }, { validator: validateAnEmail }],
  domain: [
    { required: true, message: "Please Add Domain Name" },
    { validator: validateOrgDomain },
  ],

  number: [
    { required: true, message: "Please Add Phone Number" },
    { validator: validatePhoneNumber },
  ],
};

export const API_RESPONSE_MESSAGES = {
  org_added: "Organization Added Successfully",
  org_updated: "Organization Updated Successfully",
  org_deleted: "Organization Deleted Successfully",
  err_rest_api: "Something went wrong",
  user_added: "User Added Successfully",
  user_updated: "User Updated Successfully",
};

export const TOTAL_ITEMS_PER_PAGE = 5;
export const ORG_COLUMN_FOR_USER_MGT = {
  title: "Organization",
  dataIndex: "name",
  key: "name",
};
export const ROLE_COLUMN_FOR_USER_MGT = {
  title: "Role",
  dataIndex: "role",
  key: "role",
};

export const USER_FORM_FIELD_RULES = {
  first_name: [
    { required: true, message: "First Name is Required" },
    { validator: ValidateUserName },
  ],
  last_name: [
    { required: true, message: "Last Name is Required" },
    { validator: ValidateUserName },
  ],
  user_email: [
    { required: true, message: "Email is Required" },
    { validator: validateAnEmail },
  ],
  user_role: [{ required: false, message: "Role is Required" }],
};

export const CREATE_ORDER_FORM_KEY_NAMES = {
  firstName: "firstName",
  lastName: "lastName",
  dob: "dob",
  gender: "gender",
  email: "email",
  primaryPhoneNumber: "primaryPhoneNumber",
  secondaryPhoneNumber: "secondaryPhoneNumber",
  language: "language",
  address: "address",
  race: "race",
  diagnosis: "diagnosis",
  chemoStatus: "chemoTherapyStatus",
  orderingProvider: "orderingProvider",
  referringProvider: "referringProvider",
  physicianRef: "isReferringPhysician",
  pcpNumber: "pcpName",
  radiologyStatus: "isRadiologyStatus",
  radiologyFacility: "radiologyFacility",
  radiologyDocs: "radiologyDocs",
  pathologyStatus: "isPathologyStatus",
  pathologyFacility: "pathologyFacility",
  pathologyDocs: "pathologyDocs",
  labStatus: "isLabStatus",
  labFacility: "labFacility",
  labDocs: "labDocs",
  prevAuthorization: "prevAuthorization",
  singleMedicialReleaseForm: "singleMedicialReleaseForm",
  healthPlan: "healthPlan",
  lob: "lob",
  medicareId: "medicareId",
  primarySubscriberNumber: "primarySubscriberNumber",
  primaryGroupNumber: "primaryGroupNumber",
  secondarySubscriberNumber: "secondarySubscriberNumber",
  secondaryGroupNumber: "secondaryGroupNumber",
  primaryStartDate: "primaryStartDate",
  primaryEndDate: "primaryEndDate",
  secondaryStartDate: "secondaryStartDate",
  secondaryEndDate: "secondaryEndDate",
  secondaryInsurance: "secondaryInsurance",
  copyOfInsuranceCard: "copyOfInsuranceCard",
};

export const CREATE_ORDER_FORM_FIELD_RULES = {
  firstName: [
    { required: true, message: "First Name is Required" },
    { validator: ValidateUserName },
  ],
  lastName: [
    { required: true, message: "Last Name is Required" },
    { validator: ValidateUserName },
  ],
  dob: [{ required: true, message: "Date of Birth is Required" }],
  gender: [{ required: true, message: "Gender is Required" }],
  number: [
    { required: false, message: "Please Add Phone Number" },
    { validator: validatePhoneNumber },
  ],
  email: [{ required: false }, { validator: validateAnEmail }],
  language: [{ required: false }],
  address: [{ required: true, message: "Address is Required" }],
  race: [{ required: false }],
  diagnosis: [{ required: true, message: "Select Diagnosis Status" }],
  orderingProvider: [
    { required: true, message: "Ordering Provider is Required" },
  ],
  referringProvider: [
    { required: true, message: "Referring Provider is Required" },
  ],
  pcpNumber: [{ required: true, message: "PCP Number is Required" }],
  healthPlan: [{ required: false, message: "Please Select Health Plan" }],
  lob: [{ required: true, message: "Please Select LoB" }],
  primarySubscriberNumber: [
    { required: true, message: "Primary Subscriber Number is Required" },
  ],
  primaryGroupNumber: [
    { required: true, message: "Primary Group Number is Required" },
  ],
  secondarySubscriberNumber: [
    { required: false, message: "Secondary Subscriber Number is Required" },
  ],
  secondaryGroupNumber: [
    { required: false, message: "Secondary Group Number is Required" },
  ],
  copyOfInsuranceCard: [
    { required: true, message: "Insurance Card Copy is Required" },
  ],
  primaryStartDate: [
    { required: true, message: "Primary Start Date is Required" },
  ],
  primaryEndDate: [{ required: true, message: "Primary End Date is Required" }],
  secondaryStartDate: [
    { required: true, message: "Secondary Start Date is Required" },
  ],
  secondaryEndDate: [
    { required: true, message: "Secondary End Date is Required" },
  ],
  medicareId: [{ required: true, message: "Medicare ID is Required" }],
};

export const getFileTypeForUploadedDocs = (fileName) => {
  const doctype = fileName?.split(".").pop().toLocaleLowerCase();

  switch (doctype) {
    case "pdf":
      return (
        <Image className="attachment-icons" src={PDF_icon} alt={doctype} />
      );
    case "doc":
      return (
        <Image className="attachment-icons" src={DOC_icon} alt={doctype} />
      );
    default:
      return (
        <Image className="attachment-icons" src={DOC_icon} alt={doctype} />
      );
  }
};

export const getFormattedDocumentName = (inputStr) => {
  if (!inputStr) {
    return;
  }
  const formattedName = inputStr.replace(/documents\//g, "");
  return formattedName;
};

export const NOT_SELECTED_ANY_CATEGORY_ERROR_MESSAGE =
  "Please Select Any Category First";
export const SAME_SELECTED_CATEGORY_ERROR_MESSAGE =
  "This Category is already selected";
export const SAME_SELECTED_CATEGORY_ERROR_MESSAGE1 =
  "You Have already Uploaded Document for this Category";
export const SELECT_MANDATORY_FIELD_ERROR_MESSAGE =
  "Please Select All the Mandatory Fields";
export const NPI_NUMBER_VALIDATION_ERROR_MESSAGE =
  "Please Enter Valid NPI Number";
export const MEDICARE_CONDITIONAL_VALIDATION = "medicare";
export const DATE_FORMAT_STARTING_FROM_YEAR = "YYYY-MM-DD";
export const DATE_FORMAT_STARTING_FROM_MONTH = "MM-DD-YYYY";
export const DUMMAY_ARR_FOR_ORDER_DETAILS = [0, 0, 0, 0, 0];
