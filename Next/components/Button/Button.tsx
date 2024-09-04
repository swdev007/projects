export interface CustomButtonProps {
  type?: 'button' | 'submit' | 'reset';
  buttonType?: string;
  label?: string;
  loading?: boolean;
  disabled?: boolean;
  children?: any;
  onClick?: () => void;
  fullWidth?: boolean;
}
const Button = ({
  label = '',
  buttonType,
  loading = false,
  type = 'button',
  disabled = false,
  children,
  onClick,
  fullWidth = false,
}: CustomButtonProps) => {
  return (
    <button
      className={`button ${fullWidth && 'isFull'} ${buttonType}`}
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {children}
      {label}
      {loading && (
        <div className='button__loader'>
          <span></span>
          <span></span>
          <span></span>
        </div>
      )}
    </button>
  );
};

export default Button;
