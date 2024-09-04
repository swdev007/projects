import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Credentials } from "../../Models/Credentials.Model";
import { updateTokens } from "../../Redux/Slices/Profile.slice";
import { showToast } from "../../Redux/Slices/Toast.slice";
import style from "../../assets/scss/auth.module.scss";
import AuthWrapper from "../../components/AuthWrapper/AuthWrapper";
import CustomButton from "../../components/Button/Button";
import ButtonLoader from "../../components/ButtonLoader/ButtonLoader";
import Input from "../../components/input/Input";
import UseApiService, {
  API_URL,
  IDataObject,
} from "../../services/api.service";
import { handleError } from "../../utils/helpers";
import { loginValidationSchema } from "../../utils/schema";
import { StorageEnum } from "../../utils/storage.enums";

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginValidationSchema),
  });

  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const login = async (data: FieldValues) => {
    try {
      const obj: IDataObject = {
        url: API_URL.LOGIN,
        data: data,
      };
      setLoading(true);
      const res = await UseApiService().post(obj);
      const credentials = new Credentials(res.data);
      dispatch(updateTokens({ ...credentials }));
      setLoading(false);
      localStorage.setItem(
        StorageEnum.CREDENTIALS,
        JSON.stringify(credentials)
      );
      navigate("/user/list");
    } catch (error) {
      setLoading(false);
      dispatch(showToast(handleError(error)));
    }
  };

  return (
    <AuthWrapper>
      <>
        <div
          className={` ${style.login__innerContent} flex flexCol justifyCenter`}
        >
          <h1>Log in to access your Lookbook.</h1>
          <form onSubmit={handleSubmit(login)}>
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
            <Input
              label={"PASSWORD"}
              register={register}
              name={"password"}
              type="password"
              errors={errors}
              placeholder={"Enter your password"}
              required={true}
            />
            <div className={`${style.login__actions} flex `}>
              <CustomButton
                title="LOG IN"
                type="submit"
                disabled={loading}
                onClick={handleSubmit(login)}
              >
                {loading && <ButtonLoader />}
              </CustomButton>
            </div>
          </form>
        </div>
        <Link to="forgot-password" className={style.login__forgot}>
          Forgot password?
        </Link>
      </>
    </AuthWrapper>
  );
}
