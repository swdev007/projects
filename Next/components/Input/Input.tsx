import React, { useState } from 'react';
import eyeClose from '../../assets/images/eye-close.svg';
import eyeOpen from '../../assets/images/eye-open.svg';
import { CustomInputProps } from '../../app/_lib/interfaces/interfaces';
import style from './Input.module.scss';
import Image from 'next/image';

const Input: React.FC<CustomInputProps> = ({
  label,
  type,
  value,
  placeholder,
  errorMessage = '',
  register,
  registerName = '',
  disabled = false,
  min = '',
  marginBottom = true,
  readOnly = false,
  prefixIcon = '',
  textArea = false,
}: CustomInputProps) => {
  const [isPasswordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };
  return (
    <div
      className={`${style.inputField} ${
        type === 'password' && style.inputPassword
      } ${!marginBottom && style.noSpacing}`}
    >
      <div className={style.inputField__inner}>
        {textArea ? (
          <textarea
            type={isPasswordVisible ? 'text' : type}
            placeholder={placeholder}
            value={value}
            name={registerName}
            disabled={disabled}
            {...register(registerName)}
          />
        ) : (
          <input
            type={isPasswordVisible ? 'text' : type}
            placeholder={placeholder}
            value={value}
            name={registerName}
            disabled={disabled}
            {...register(registerName)}
          />
        )}

        {type === 'password' && (
          <div className={`${style.inputField__visibility}`}>
            <Image
              src={!isPasswordVisible ? eyeOpen : eyeClose}
              alt='eye'
              onClick={togglePasswordVisibility}
            />
          </div>
        )}
      </div>
      {errorMessage && <span>{errorMessage}</span>}
    </div>
  );
};

export default Input;
