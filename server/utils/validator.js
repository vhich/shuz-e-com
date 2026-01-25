// utils/validator.js

export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates password length (min 4, max 8)
 */
export const isValidPassword = (password) => {
  return password.length >= 4 && password.length <= 8;
};

export const validateFields = (fields) => {
  for (const [key, value] of Object.entries(fields)) {
    // 1. Basic empty check
    if (!value || (typeof value === "string" && value.trim() === "")) {
      const fieldName = key
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (str) => str.toUpperCase());
      return `${fieldName} is required!`;
    }

    // 2. Specific email format check
    if (key === "email" && !isValidEmail(value)) {
      return "Please enter a valid email address!";
    }

    // 3. Password length check
    if (key === "password" && !isValidPassword(value)) {
      return "Password must be between 4 and 8 characters long!";
    }
  }
  return null;
};
