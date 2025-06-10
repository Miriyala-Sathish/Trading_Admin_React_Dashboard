import { useState } from 'react';

const useTotalDemoValidation = (initialData = {}) => {
  const [formData, setFormData] = useState({
    referralId_total_demo: initialData.referralId_total_demo || '',
    name_total_demo: initialData.name_total_demo || '',
    date_total_demo: initialData.date_total_demo || '',
    tradingViewId_total_demo: initialData.tradingViewId_total_demo || '',
    phoneNumber_total_demo: initialData.phoneNumber_total_demo || '',
    email_total_demo: initialData.email_total_demo || '',
    expiryDate_total_demo: initialData.expiryDate_total_demo || '',
  });
  const [errors, setErrors] = useState({});

  // Validation rules
  const validateField = (name, value) => {
    const newErrors = {};

    switch (name) {
      case 'referralId_total_demo':
        if (!value) {
          newErrors.referralId_total_demo = 'Referral ID is required';
        } else if (!/^[a-zA-Z0-9]+$/.test(value)) {
          newErrors.referralId_total_demo = 'Referral ID must be alphanumeric';
        } else if (value.length > 50) {
          newErrors.referralId_total_demo = 'Referral ID must be 50 characters or less';
        }
        break;

      case 'name_total_demo':
        if (!value) {
          newErrors.name_total_demo = 'Name is required';
        } else if (!/^[a-zA-Z\s]+$/.test(value)) {
          newErrors.name_total_demo = 'Name must contain only letters and spaces';
        } else if (value.length > 100) {
          newErrors.name_total_demo = 'Name must be 100 characters or less';
        }
        break;

      case 'date_total_demo':
        if (!value) {
          newErrors.date_total_demo = 'Date is required';
        } else {
          const date = new Date(value);
          const today = new Date();
          if (isNaN(date.getTime())) {
            newErrors.date_total_demo = 'Invalid date format';
          } else if (date > today) {
            newErrors.date_total_demo = 'Date cannot be in the future';
          }
        }
        break;

      case 'tradingViewId_total_demo':
        if (!value) {
          newErrors.tradingViewId_total_demo = 'Trading View ID is required';
        } else if (!/^[a-zA-Z0-9]+$/.test(value)) {
          newErrors.tradingViewId_total_demo = 'Trading View ID must be alphanumeric';
        } else if (value.length > 50) {
          newErrors.tradingViewId_total_demo = 'Trading View ID must be 50 characters or less';
        }
        break;

      case 'phoneNumber_total_demo':
        if (!value) {
          newErrors.phoneNumber_total_demo = 'Phone number is required';
        } else if (!/^\+?\d{10,15}$/.test(value)) {
          newErrors.phoneNumber_total_demo = 'Phone number must be 10-15 digits, optionally starting with +';
        }
        break;

      case 'email_total_demo':
        if (!value) {
          newErrors.email_total_demo = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors.email_total_demo = 'Invalid email format';
        } else if (value.length > 100) {
          newErrors.email_total_demo = 'Email must be 100 characters or less';
        }
        break;

      case 'expiryDate_total_demo':
        if (!value) {
          newErrors.expiryDate_total_demo = 'Expiry date is required';
        } else {
          const expiryDate = new Date(value);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          if (isNaN(expiryDate.getTime())) {
            newErrors.expiryDate_total_demo = 'Invalid expiry date format';
          } else if (expiryDate < today) {
            newErrors.expiryDate_total_demo = 'Expiry date cannot be in the past';
          }
        }
        break;

      default:
        break;
    }

    return newErrors;
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const fieldErrors = validateField(key, formData[key]);
      Object.assign(newErrors, fieldErrors);
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    const fieldErrors = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: fieldErrors[name] || null,
    }));
  };

  const resetForm = () => {
    setFormData({
      referralId_total_demo: '',
      name_total_demo: '',
      date_total_demo: '',
      tradingViewId_total_demo: '',
      phoneNumber_total_demo: '',
      email_total_demo: '',
      expiryDate_total_demo: '',
    });
    setErrors({});
  };

  return { formData, errors, handleInputChange, validateForm, resetForm };
};

export default useTotalDemoValidation;