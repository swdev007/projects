import * as yup from 'yup';

export const signUpSchema = yup.object().shape({
  name: yup.string(),
  password: yup
    .string()
    .trim()
    .required('Password is required')
    .matches(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,
      'Password must contain at least 8 characters, a number, a special character, a lowercase character, and an uppercase character'
    ),
  confirmPassword: yup
    .string()
    .trim()
    .required('Confirm Password is required')
    .oneOf([yup.ref('password')], 'Passwords do not match.'),

  email: yup
    .string()
    .email('Please enter a valid email')
    .required('Email is required')
    .trim(),
  role: yup.string().trim(),
  phoneNumber: yup.string().trim(),
});
