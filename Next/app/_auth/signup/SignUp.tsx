"use client";
import { AuthTab } from "@/app/_lib/enum/modal.enum";
import { signUpSchema } from "@/app/_lib/formSchema/signup";
import { setAuthUserInput } from "@/app/_lib/GlobalRedux/Slices/auth.slice";
import { StoreInterface } from "@/app/_lib/GlobalRedux/store";
import { showErrorToast } from "@/app/_lib/utils/helpers";
import Button from "@/components/Button/Button";
import Input from "@/components/Input/Input";
import PhoneNumberInput from "@/components/Input/PhoneNumberInput";
import { yupResolver } from "@hookform/resolvers/yup";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { ApiService } from "../../_lib/services/apiServices";
import style from "../auth.module.scss";
export default function SignUpPage({
  isModal = false,
  setModalPage = () => {},
}: {
  isModal?: boolean;
  setModalPage?: any;
}) {
  // local state
  const [loading, setLoading] = useState(false);
  // redux
  const authModalData = useSelector(
    (store: StoreInterface) => store.modal.authModal
  );

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    control,
    reset,
  } = useForm({
    resolver: yupResolver(signUpSchema),
    mode: "onSubmit",
    defaultValues: {
      phoneNumber: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  const apiService = new ApiService();
  const dispatch = useDispatch();

  async function signUp(data: FieldValues) {
    try {
      setLoading(true);
      let payload = {
        data,
        url: "auth/register",
      };
      // data.role = 'admin';
      data.email = data.email.toLowerCase();
      data.name = data.email.toLowerCase();
      if (data.phoneNumber == "") {
        delete data.phoneNumber;
      }
      const res: any = await apiService.post(payload);
      const { email } = res?.data;
      dispatch(setAuthUserInput({ email: email.toLowerCase() }));
      toast.success("Verification code is sent to you email.");
      setModalPage(AuthTab.VERIFY_ACCOUNT);
      setLoading(false);
    } catch (err: any) {
      showErrorToast(err);
    } finally {
      setLoading(false);
    }
  }

  function alreadyAnAccount() {
    if (loading) {
      return;
    }
    setModalPage(AuthTab.LOG_IN);
  }

  useEffect(() => {
    reset();
  }, [authModalData]);

  return (
    <div className={style.auth__wrap}>
      <div className={style.auth__intro}>
        <h3>
          Register now to view your vehicle dashboard and offers from dealers!
        </h3>
      </div>
      <form>
        <Input
          type="text"
          placeholder="Email"
          register={register}
          registerName="email"
          errorMessage={errors?.email?.message}
        />
        <Input
          type="password"
          placeholder="Password"
          register={register}
          registerName="password"
          errorMessage={errors?.password?.message}
        />
        <Input
          type="password"
          placeholder="Confirm Password"
          register={register}
          registerName="confirmPassword"
          errorMessage={errors?.confirmPassword?.message}
        />
        <div>
          {authModalData && (
            <PhoneNumberInput
              control={control}
              registerName={"phoneNumber"}
              errorMessage={errors?.phoneNumber?.message}
            />
          )}
        </div>
        <Button
          disabled={loading || isSubmitting}
          loading={loading || isSubmitting}
          label="Sign Up"
          type="submit"
          buttonType={"lg"}
          fullWidth={true}
          onClick={handleSubmit(signUp)}
        />
        <div className={style.auth__infoText}>
          Already an account?{" "}
          <Link href={""} onClick={alreadyAnAccount}>
            Log in
          </Link>
        </div>

        <div className={style.auth__infoContent}>
          We will only contact you if there are more questions before you accept
          your offer.
        </div>
      </form>
    </div>
  );
}
