import { FieldErrors, FieldValues } from "react-hook-form";
import style from "../../assets/scss/form.module.scss";

export interface TextAreaProps {
  name: string;
  label?: string;
  placeholder: string;
  errors?: FieldErrors<FieldValues | any>;
  register: any;
  extraClass?: string | undefined;
  required?: boolean;
}

export default function TextArea(props: TextAreaProps) {
  const {
    register,
    name,
    label,
    errors,
    placeholder,
    required = false,
  } = props;

  return (
    <div className={style.inputField}>
      {label && (
        <label className="flex">
          {label}
          {required && <span>*</span>}
        </label>
      )}
      <div className={style.inputField__input}>
        <textarea
          {...register(name)}
          placeholder={placeholder}
          rows={4}
        ></textarea>
      </div>
      {errors?.[name] && (
        <div className={style.inputField__error}>
          {errors?.[name]?.message as string}
        </div>
      )}
    </div>
  );
}
