export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(String(email).toLowerCase());
};

export const validatePassword = (password) => {
  // 8-16 characters, at least one uppercase, one special character
  if (password.length < 8 || password.length > 16) return false;
  const uppercaseRegex = /[A-Z]/;
  const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
  return uppercaseRegex.test(password) && specialCharRegex.test(password);
};

export const validateName = (name) => {
  // Min 20 characters, Max 60 characters
  return name.length >= 20 && name.length <= 60;
};

export const validateAddress = (address) => {
  // Max 400 characters
  return address.length <= 400;
};
