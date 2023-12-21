export const isValidEmail = (email) => {
  const pattern =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z]{2,})+$/;

  if (!pattern.test(email)) {
    return {
      isValid: false,
      warning: "Email is not correctly formatted",
    };
  }

  return { isValid: true };
};

export const isValidName = (name) => {
  if (typeof name !== "string" || name?.trim() === "") {
    return { isValid: false, warning: "Name is required" };
  }
  const cleanedName = name.replace(/\s+/g, " ").trim();

  if (/[\d]/.test(cleanedName)) {
    return { isValid: false, warning: "Name should not contain numbers" };
  }

  if (/[^a-zA-Z\s]/.test(cleanedName)) {
    return {
      isValid: false,
      warning: "Name should not contain special characters",
    };
  }

  if (cleanedName.length > 100) {
    return { isValid: false, warning: "Name should not exceed 100 characters" };
  }

  return { isValid: true };
};

export const isValidOrgOrDomainName = (name) => {
  if (typeof name !== "string" || name.trim() === "") {
    return { isValid: false, warning: "Name is required" };
  }
  const cleanedName = name.replace(/\s+/g, " ").trim();

  if (cleanedName.length > 100) {
    return { isValid: false, warning: "Name should not exceed 100 characters" };
  }

  return { isValid: true };
};

export const isValidPhoneNumber = (phoneNumber) => {
  if (typeof phoneNumber !== "string" || phoneNumber.trim() === "") {
    return { isValid: false, warning: "Phone number is required" };
  }
  const cleanedNumber = phoneNumber.replace(/\D/g, "");

  const isValidFormat = /^\d{10}$/.test(cleanedNumber);

  if (!isValidFormat) {
    return { isValid: false, warning: "Invalid phone number format" };
  }

  if (cleanedNumber.length !== 10) {
    return { isValid: false, warning: "Phone number should have 10 digits" };
  }
  return { isValid: true };
};

export const replaceMultipleSpacesWithSingleSpace = (str) => {
  if (!str) {
    return "";
  }
  return str?.trim().replace(/\s+/g, " ");
};
