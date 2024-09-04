import React from "react";

interface ClickButtonProps {
  onClick: Function;
  title: string;
  disabled?: boolean;
  children?: React.ReactNode;
  type?: "submit" | "button";
  className?: "primary" | "";
}
const CustomButton = ({
  onClick,
  title,
  children,
  type,
  className = "",
  disabled,
}: ClickButtonProps) => {
  let buttonAction = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <button
      className={`button ${className} ${disabled ? "disabled" : ""}`}
      type={type}
      disabled={disabled}
      onClick={() => {
        buttonAction();
      }}
    >
      {title}
      {children ? children : <></>}
    </button>
  );
};

export default CustomButton;
