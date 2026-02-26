// utils/validator.js

export const isValidUsername = (username) => {
  const usernameRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]{4,12}$/;
  return usernameRegex.test(username);
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

    // 2. Specific username format check
    if (key === "username" && !isValidUsername(value)) {
      return "Username must be 4-12 characters and include both letters and numbers.";
    }

    // 3. Password length check
    if (key === "password" && !isValidPassword(value)) {
      return "Password must be between 4 and 8 characters long!";
    }
  }
  return null;
};
