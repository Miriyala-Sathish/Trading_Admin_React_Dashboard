import { useState } from 'react';

const useFormValidation = (formConfig, initialData = {}) => {
  const initialFormData = Object.keys(formConfig.fields).reduce((acc, field) => {
    acc[field] = initialData[field] || '';
    return acc;
  }, {});
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});

  const validateField = (name, value, checkRequired = false) => {
    const fieldConfig = formConfig.fields[name];
    if (!fieldConfig) return {};

    const newErrors = {};

    if (checkRequired && fieldConfig.required && !value.trim()) {
      newErrors[name] = `${fieldConfig.label} is required`;
      return newErrors;
    }

    switch (fieldConfig.type) {
      case 'text':
        let trimmedValue = value.trim();
        if (name === 'name' || name === 'name_main_user' || name === 'tradingViewId' || name === 'tradingId_main_user') {
          value = trimmedValue;
        }
        if (fieldConfig.pattern && value && !fieldConfig.pattern.test(value)) {
          newErrors[name] = fieldConfig.errorMessage;
        }
        if (fieldConfig.maxLength && value.length > fieldConfig.maxLength) {
          newErrors[name] = `${fieldConfig.label} must be ${fieldConfig.maxLength} characters or less`;
        }
        break;

      case 'email':
        if (fieldConfig.pattern && value && !fieldConfig.pattern.test(value)) {
          newErrors[name] = fieldConfig.errorMessage;
        }
        if (fieldConfig.maxLength && value.length > fieldConfig.maxLength) {
          newErrors[name] = `${fieldConfig.label} must be ${fieldConfig.maxLength} characters or less`;
        }
        break;

      case 'tel':
        if (fieldConfig.pattern && value && !fieldConfig.pattern.test(value)) {
          newErrors[name] = fieldConfig.errorMessage;
        }
        if (fieldConfig.maxLength && value.length > fieldConfig.maxLength) {
          newErrors[name] = `${fieldConfig.label} must be ${fieldConfig.maxLength} characters or less`;
        }
        break;

      case 'date':
        if (value) {
          const date = new Date(value);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          if (isNaN(date.getTime())) {
            newErrors[name] = `Invalid ${fieldConfig.label.toLowerCase()} format`;
          } else if (fieldConfig.notFuture && date > today) {
            newErrors[name] = fieldConfig.errorMessage;
          } else if (fieldConfig.notPast && date < today) {
            newErrors[name] = fieldConfig.errorMessage;
          }
        }
        break;

      case 'number':
        if (value && (!/^\d+$/.test(value) || parseInt(value) <= 0)) {
          newErrors[name] = `${fieldConfig.label} must be a positive integer`;
        }
        if (fieldConfig.max && value && parseInt(value) > fieldConfig.max) {
          newErrors[name] = `${fieldConfig.label} must be ${fieldConfig.max} or less`;
        }
        break;

      default:
        break;
    }

    return newErrors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: (name === 'name' || name === 'name_main_user' || name === 'tradingViewId' || name === 'tradingId_main_user') ? value.trim() : value,
    }));
    // Validate non-empty fields during live input
    const fieldErrors = value ? validateField(name, value) : {};
    setErrors((prev) => ({
      ...prev,
      [name]: fieldErrors[name] || '', // Clear error if validation passes
    }));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Backspace') {
      const { name, value } = e.target;
      const newValue = value.slice(0, -1);
      const trimmedNewValue = (name === 'name' || name === 'name_main_user' || name === 'tradingViewId' || name === 'tradingId_main_user') ? newValue.trim() : newValue;

      // Update formData with the new value
      setFormData((prev) => ({
        ...prev,
        [name]: trimmedNewValue,
      }));

      // Clear error if the field is empty or invalid after backspace
      if (!trimmedNewValue || (formConfig.fields[name]?.pattern && !formConfig.fields[name].pattern.test(trimmedNewValue))) {
        setErrors((prev) => ({
          ...prev,
          [name]: '',
        }));
      } else {
        // Validate the new value to update errors if needed
        const fieldErrors = validateField(name, trimmedNewValue);
        setErrors((prev) => ({
          ...prev,
          [name]: fieldErrors[name] || '', // Clear error if validation passes
        }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formConfig.fields).forEach((field) => {
      const fieldErrors = validateField(field, formData[field], true);
      Object.assign(newErrors, fieldErrors);
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setErrors({});
  };

  return { formData, errors, handleInputChange, handleKeyDown, validateForm, resetForm };
};

export default useFormValidation;