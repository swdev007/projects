import * as yup from "yup";
import { ErrorMessages } from "./errors.enums";

export const loginValidationSchema = yup.object().shape({
  email: yup
    .string()
    .email(ErrorMessages.VALID_EMAIL)
    .required(ErrorMessages.REQUIRED),
  password: yup.string().required(ErrorMessages.REQUIRED),
});

export const forgotPasswordSchema = yup.object().shape({
  email: yup
    .string()
    .email(ErrorMessages.VALID_EMAIL)
    .required(ErrorMessages.REQUIRED),
});

export const resetPasswordSchema = yup.object().shape({
  uniqueCode: yup
    .string()
    .required(ErrorMessages.REQUIRED)
    .min(6, ErrorMessages.CODE_LENGTH)
    .max(6, ErrorMessages.CODE_LENGTH),
  newPassword: yup
    .string()
    .min(8, ({ min }) => `Password must be at least ${min} characters`)
    .matches(
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[#?!@$%^&*-]).{8,}$/,
      () => ErrorMessages.PASSWORD_REGEX
    )
    .required(ErrorMessages.REQUIRED),
});

export const searchUsersSchema = yup.object().shape({
  search: yup.string().trim(),
  startDate: yup.string().default(""),
  endDate: yup.string().default(""),
});

export const profileSchema = yup.object().shape({
  firstName: yup
    .string()
    .trim()
    .required(ErrorMessages.REQUIRED)
    .min(2, "Minimum length should be 2 characters long"),
  lastName: yup
    .string()
    .trim()
    .required(ErrorMessages.REQUIRED)
    .min(2, "Minimum length should be 2 characters long"),
  email: yup
    .string()
    .email(ErrorMessages.VALID_EMAIL)
    .required(ErrorMessages.REQUIRED),
  zipCode: yup.string().trim(),
  myStylist: yup.string().trim(),
  notes: yup.string().trim(),
  phoneNumber: yup.lazy((value) =>
    value
      ? yup
          .string()
          .trim()
          .matches(/^\(\d{3}\) \d{3}-\d{4}$/gm, "Phone Number format incorrect")
      : yup.string().trim()
  ),
  address: yup.string().trim(),
  referralCode: yup.string().trim(),
  shoppingRecsUrl: yup.string().url('Enter a valid url').trim(),
});
