import * as yup from 'yup';
export const verifyAccountSchema = yup.object().shape({
  code: yup.string().trim().required('Code is required'),
});
