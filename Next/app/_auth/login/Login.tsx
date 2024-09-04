'use client';
import { useForm, FieldValues } from 'react-hook-form';
import Input from '@/components/Input/Input';
import { logInSchema } from '../../_lib/formSchema/login';
import Button from '@/components/Button/Button';
import { yupResolver } from '@hookform/resolvers/yup';
import { ApiService } from '../../_lib/services/apiServices';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { StorageService } from '@/app/_lib/services/storageServices';
import { StorageEnums } from '@/app/_lib/enum/storage';
import { useDispatch, useSelector } from 'react-redux';
import { StoreInterface } from '@/app/_lib/GlobalRedux/store';
import { useRouter } from 'next/navigation';
import {
  setAuthUserInput,
  setUserData,
} from '@/app/_lib/GlobalRedux/Slices/auth.slice';
import { toast } from 'react-toastify';
import style from '../auth.module.scss';
import { AuthTab } from '@/app/_lib/enum/modal.enum';
import { setAuthModal } from '@/app/_lib/GlobalRedux/Slices/modal.slice';
import { ErrorEnum } from '@/app/_lib/enum/errors.enum';
import { showErrorToast } from '@/app/_lib/utils/helpers';
import { setCookie } from 'cookies-next';
export default function LoginPage({
  isModal = false,
  setModalPage = () => {},
}: {
  isModal?: boolean;
  setModalPage?: any;
}) {
  // local state
  const [loading, setLoading] = useState(false);
  const modal = useSelector((store: StoreInterface) => store.modal);
  const dispatch = useDispatch();
  const router = useRouter();

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
  } = useForm({
    resolver: yupResolver(logInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onSubmit',
  });
  const apiService = new ApiService();
  const storageService = new StorageService();
  async function login(data: FieldValues) {
    try {
      setLoading(true);
      data.email = data.email.toLowerCase();
      let payload = {
        data,
        url: 'auth/sign-in',
      };
      const res = await apiService.post(payload);
      dispatch(setUserData({ user: {}, isLoggedIn: true }));
      storageService.setKey(StorageEnums.CREDENTIALS, res?.data);
      setCookie(StorageEnums.CREDENTIALS, res?.data?.accessToken);
      router.replace('/dashboard');
    } catch (err: any) {
      setLoading(false);
      if (
        err?.response?.status == '403' &&
        ErrorEnum.NOT_VERIFIED == err?.response?.data?.message
      ) {
        toast.error(err?.response?.data?.message ?? err?.message);
        dispatch(setAuthUserInput({ email: data?.email }));
        setModalPage(AuthTab.VERIFY_ACCOUNT);
      } else {
        showErrorToast(err);
      }
    }
  }

  function registerAnAccount() {
    if (loading) {
      return;
    }
    setModalPage(AuthTab.SIGN_UP);
  }

  function resetPassword() {
    if (loading) {
      return;
    }
    setModalPage(AuthTab.FORTGOT_PASSWORD);
  }

  useEffect(() => {
    if (modal?.authModal) {
      reset();
    }
  }, [modal?.authModal]);

  return (
    <div
      className={style.auth__wrap}
      // onKeyUp={(e) => {
      //   handleSubmit(login)();
      // }}
    >
      <div className={style.auth__intro}>
        <h2>Login</h2>
      </div>
      <br />
      <form>
        <Input
          type='text'
          placeholder='Email'
          register={register}
          registerName='email'
          errorMessage={errors?.email?.message}
        />
        <Input
          type='password'
          placeholder='Password'
          register={register}
          registerName='password'
          errorMessage={errors?.password?.message}
        />

        <Button
          disabled={loading || isSubmitting}
          loading={loading || isSubmitting}
          label='Login'
          buttonType='lg'
          fullWidth={true}
          type={'submit'}
          onClick={handleSubmit(login)}
        />
        <div className={style.auth__infoText}>
          Need an account?{' '}
          <Link href={''} onClick={registerAnAccount}>
            Register
          </Link>
        </div>
        <div className={style.auth__infoText}>
          <Link href={''} onClick={resetPassword}>
            Reset Password
          </Link>
        </div>
        <div className={style.auth__infoText}>
          <i>**Submit a vehicle request before creating an account.</i>
        </div>
      </form>
    </div>
  );
}
