'use client';
import React from 'react';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import { Controller } from 'react-hook-form';
import './PhoneNumberInput.scss';
export default function PhoneNumberInput({
  control,
  registerName,
  errorMessage,
}: {
  control: any;
  registerName: string;
  errorMessage: any;
}) {
  return (
    <div className={'number-input'}>
      <Controller
        name={registerName}
        control={control}
        rules={{
          required: 'Phone number is required',
        }}
        render={({ field, fieldState }) => (
          <>
            <PhoneInput
              {...field}
              defaultCountry={'us'}
              countrySelectorStyleProps={{
                buttonStyle: {},
              }}
            />
            {fieldState?.error && <span>{fieldState.error.message}</span>}
          </>
        )}
      />
    </div>
  );
}
