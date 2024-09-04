import * as yup from 'yup';
export const resetPasswordSchema = yup.object().shape({
  code: yup.string().trim().required('Code is required'),
  newPassword: yup
    .string()
    .trim()
    .required('New password is required')
    .matches(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,
      'Password must contain at least 8 characters, a number, a special character, a lowercase character, and an uppercase character'
    ),
});
