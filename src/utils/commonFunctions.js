export const formatPhoneNumberToUSFormat = (number) => {
  if (!number) {
    return;
  }
  const numSting = number.toString();

  const countryCode = "1";
  const areaCode = numSting.slice(0, 3);
  const middleNumber = numSting.slice(3, 6);
  const lastNumber = numSting.slice(6);

  return `+${countryCode} (${areaCode})-${middleNumber}-${lastNumber}`;
};

export const capitalizeWords = (inputString) => {
  if (!inputString || inputString?.trim() === "") {
    return;
  }
  const resultString = inputString.replace(/\b[a-zA-Z]/g, function (match) {
    return match.toLocaleUpperCase();
  });
  return resultString;
};

export const getRoleById = (id) => {
  if (!id) {
    return;
  } else if (id === 1) {
    return "Admin";
  } else if (id === 2) {
    return "Member";
  } else return "Not A Valid Role";
};

export const formatPhoneNumberForInput = (value) => {
  if (!value || value?.toString()?.trim() === "") {
    return;
  }

  value = value.toString();
  console.log(value);
  const cleanNumber = value.replace(/\D/g, "");

  if (cleanNumber.length === 3) {
    return `(${cleanNumber.slice(0, 3)})-`;
  } else if (cleanNumber.length === 6) {
    return `(${cleanNumber.slice(0, 3)})-${cleanNumber.slice(3, 6)}-`;
  } else if (cleanNumber.length === 10) {
    return `(${cleanNumber.slice(0, 3)})-${cleanNumber.slice(
      3,
      6
    )}-${cleanNumber.slice(6, 10)}`;
  }
};
