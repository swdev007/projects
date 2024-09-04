import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../Redux/Slices/Toast.slice";
import style from "../../assets/scss/auth.module.scss";
import AuthWrapper from "../../components/AuthWrapper/AuthWrapper";
import CustomButton from "../../components/Button/Button";
import ButtonLoader from "../../components/ButtonLoader/ButtonLoader";
import Input from "../../components/input/Input";
import UseApiService, { API_URL } from "../../services/api.service";
import { SuccessMessages } from "../../utils/errors.enums";
import { handleError } from "../../utils/helpers";
import { forgotPasswordSchema } from "../../utils/schema";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(forgotPasswordSchema),
  });
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const forgetPassword = async (data: FieldValues) => {
    try {
      const obj = {
        url: API_URL.REQUEST_RESET_PASSWORD,
        data: data,
      };
      setLoading(true);
      await UseApiService().post(obj);
      dispatch(showToast(SuccessMessages.CODE_SENT));
      setLoading(false);
      navigate("/enter-code", { replace: true });
    } catch (error) {
      setLoading(false);
      dispatch(showToast(handleError(error)));
    }
  };

  const goToLogin = () => {
    navigate("/", { replace: true });
  };

  return (
    <AuthWrapper>
      <>
      <div className={` ${style.login__innerContent} flex flexCol justifyCenter`}>
        <h1>Reset your password</h1>
        <form onSubmit={handleSubmit(forgetPassword)}>
          <Input
            label={"EMAIL"}
            register={register}
            name={"email"}
            type="text"
            errors={errors}
            placeholder="Enter your email"
            autocomplete={"on"}
            required={true}
          />
          <div className={style.login__actions}>
            <CustomButton
              title="SEND RESET CODE"
              type="submit"
              disabled={loading}
              onClick={handleSubmit(forgetPassword)}
            >
              {loading && <ButtonLoader />}
            </CustomButton>
            <CustomButton
              title="RETURN TO LOG IN"
              type="button"
              className={"primary"}
              onClick={goToLogin}
            />
          </div>
        </form>
      </div>
      </>
    </AuthWrapper>
  );
}
