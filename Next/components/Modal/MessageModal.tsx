'use client';
import { setMessageModal } from '@/app/_lib/GlobalRedux/Slices/modal.slice';
import { StoreInterface } from '@/app/_lib/GlobalRedux/store';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../Button/Button';
import Input from '../Input/Input';
import style from '../../app/_auth/auth.module.scss';
import PhoneNumberInput from '../Input/PhoneNumberInput';
import { messageBoxSchema } from '@/app/_lib/formSchema/messageBox';
import { toast } from 'react-toastify';

export default function MessageModal() {
  const messageModal = useSelector((store: StoreInterface) => store.modal);
  const [loading, setLoading] = useState(false);
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    control,
    clearErrors,
    reset,
  } = useForm({
    resolver: yupResolver(messageBoxSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
      phoneNumber: '',
    },
    mode: 'onSubmit',
  });

  const dispatch = useDispatch();

  const submitMessage = (data: any) => {
    toast.success('Message Sent');
    dispatch(setMessageModal(false));
  };

  useEffect(() => {
    if (messageModal) {
      reset();
    }
  }, [messageModal]);
  return (
    <div className={style.auth__wrap}>
      <div className={style.auth__intro}>
        <h2>Contact Us</h2>
      </div>
      <br />
      {messageModal && (
        <form>
          <Input
            type='text'
            placeholder='Name'
            register={register}
            registerName='name'
            errorMessage={errors?.name?.message}
          />
          <Input
            type='text'
            placeholder='Email'
            register={register}
            registerName='email'
            errorMessage={errors?.email?.message}
          />
          {messageModal && (
            <PhoneNumberInput
              control={control}
              registerName={'phoneNumber'}
              errorMessage={errors?.phoneNumber?.message}
            />
          )}
          <Input
            type='text'
            placeholder='Message'
            register={register}
            registerName='message'
            textArea={true}
            errorMessage={errors?.message?.message}
          />

          <Button
            disabled={loading || isSubmitting}
            loading={loading || isSubmitting}
            label='Submit'
            buttonType='lg'
            fullWidth={true}
            type={'submit'}
            onClick={handleSubmit(submitMessage)}
          />
        </form>
      )}
    </div>
  );
}
