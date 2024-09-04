import * as yup from 'yup';
export const messageBoxSchema = yup.object().shape({
  name: yup.string().trim().required('Name is required.'),
  message: yup.string().trim().required('Message is required.'),
  email: yup
    .string()
    .email('Please enter a valid email.')
    .required('Email is required.')
    .trim(),
  phoneNumber: yup.string().trim(),
});
