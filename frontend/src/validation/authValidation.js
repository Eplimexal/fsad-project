const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const authSchema = {
  name: {
    required: true,
    minLength: 2,
    label: 'Full name',
  },
  email: {
    required: true,
    pattern: emailRegex,
    label: 'Email',
  },
  password: {
    required: true,
    minLength: 6,
    label: 'Password',
  },
  confirmPassword: {
    required: true,
    label: 'Confirm password',
  },
  role: {
    required: true,
    label: 'Role',
  },
};

export const validateField = (field, value, values = {}) => {
  const rule = authSchema[field];
  if (!rule) return '';

  const trimmed = String(value ?? '').trim();

  if (rule.required && !trimmed) {
    return `${rule.label} is required`;
  }

  if (rule.minLength && trimmed.length < rule.minLength) {
    return `${rule.label} must be at least ${rule.minLength} characters`;
  }

  if (rule.pattern && !rule.pattern.test(trimmed)) {
    return 'Enter a valid email address';
  }

  if (field === 'confirmPassword' && trimmed !== values.password) {
    return 'Passwords do not match';
  }

  return '';
};

export const validateFields = (fields, values) => {
  const errors = {};
  fields.forEach((field) => {
    const error = validateField(field, values[field], values);
    if (error) {
      errors[field] = error;
    }
  });
  return errors;
};
