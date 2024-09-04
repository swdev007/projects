'use client';
import { useForm, FieldValues } from 'react-hook-form';
import Input from '@/components/Input/Input';
import Button from '@/components/Button/Button';
import { yupResolver } from '@hookform/resolvers/yup';
import { ApiService } from '../../_lib/services/apiServices';
import { useState } from 'react';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { setAuthUserInput } from '@/app/_lib/GlobalRedux/Slices/auth.slice';
import { toast } from 'react-toastify';
import style from '../auth.module.scss';
import { AuthTab } from '@/app/_lib/enum/modal.enum';
import { forgotPasswordSchema } from '@/app/_lib/formSchema/forgotPassword';
import { showErrorToast } from '@/app/_lib/utils/helpers';
export default function ForgotPassword({
  isModal = false,
  setModalPage = () => {},
}: {
  isModal?: boolean;
  setModalPage?: any;
}) {
  // local state
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm({
    resolver: yupResolver(forgotPasswordSchema),
    mode: 'onSubmit',
  });
  const apiService = new ApiService();

  async function requestCode(data: FieldValues) {
    try {
      data.email = data.email.toLowerCase();
      setLoading(true);
      let payload = {
        data,
        url: 'auth/request-reset-password',
      };
      await apiService.post(payload);
      dispatch(setAuthUserInput({ email: data?.email }));
      toast.success('Code is sent to your email.');

      setModalPage(AuthTab.RESET_PASSWORD);
    } catch (err: any) {
      showErrorToast(err);
    } finally {
      setLoading(false);
    }
  }
  const goToLogIn = () => {
    if (loading) {
      return;
    }
    setModalPage(AuthTab.LOG_IN);
  };

  return (
    <div className={style.auth__wrap}>
      <h2>Reset Password</h2>
      <br />
      <form>
        <Input
          type='text'
          placeholder='Email'
          register={register}
          registerName='email'
          errorMessage={errors?.email?.message}
        />

        <Button
          disabled={loading || isSubmitting}
          loading={loading || isSubmitting}
          label='Request Code'
          fullWidth={true}
          type='submit'
          onClick={handleSubmit(requestCode)}
        />
        <div className={style.auth__infoText}>
          Go back to{' '}
          <Link href={''} onClick={() => goToLogIn()}>
            Login
          </Link>
        </div>
      </form>
    </div>
  );
}
