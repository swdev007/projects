import * as yup from 'yup';
export const logInSchema = yup.object().shape({
  email: yup
    .string()
    .email('Please enter a valid email')
    .required('Email is required')
    .trim(),
  password: yup.string().trim().required('Password is required'),
});
