export const patterns = {
  email: /^\S+@\S+\.\S+$/,
  phone: /^[0-9+\-\s()]{7,15}$/,
  password: /^(?=.*[a-zA-Z])(?=.*\d).{6,}$/,
};

export const validateField = (name, value) => {
  const v = (value ?? '').toString().trim();

  switch (name) {
    case 'firstName':
    case 'lastName':
      if (!v) return 'This field is required';
      if (v.length > 50) return 'Too long (max 50)';
      return '';

    case 'email':
      if (!v) return 'Email is required';
      if (!patterns.email.test(v)) return 'Invalid email address';
      return '';

    case 'phone':
    case 'contactPhone':
      if (!v) return 'Phone number is required';
      if (!patterns.phone.test(v)) return 'Invalid phone number';
      return '';

    case 'password':
    case 'newPassword':
      if (!v) return 'Password is required';
      if (!patterns.password.test(v))
        return 'Min 6 chars, with at least one letter and one number';
      return '';

    case 'currentPassword':
    case 'confirmPassword':
      if (!v) return 'This field is required';
      return '';

    case 'title':
      if (!v) return 'Title is required';
      if (v.length < 5) return 'Title must be at least 5 characters';
      if (v.length > 120) return 'Title cannot exceed 120 characters';
      return '';

    case 'description':
      if (!v) return 'Description is required';
      if (v.length < 10) return 'Please add at least 10 characters';
      if (v.length > 1000) return 'Description cannot exceed 1000 characters';
      return '';

    case 'category':
      if (!v) return 'Please choose a category';
      return '';

    case 'urgency':
      if (!v) return 'Please choose urgency';
      return '';

    case 'location':
      if (!v) return 'Location is required';
      if (v.length > 150) return 'Location too long';
      return '';

    case 'requiredDate': {
      if (!v) return 'Required date is required';
      const d = new Date(v);
      if (isNaN(d.getTime())) return 'Invalid date';
      // Not in the past (allow today)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (d < today) return 'Date cannot be in the past';
      return '';
    }

    default:
      return '';
  }
};

/**
 * Validate all fields of a form.
 * @param {Object} values
 * @param {String[]} fields
 * @returns {{[k:string]:string}} errors map
 */
export const validateForm = (values, fields) => {
  const errors = {};
  fields.forEach((f) => {
    const msg = validateField(f, values[f]);
    if (msg) errors[f] = msg;
  });
  return errors;
};