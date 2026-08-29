import "./button.css";

type AuthButtonProps = {
  label: string;
  disabled?: boolean;
};

function AuthButton({ label, disabled = false }: AuthButtonProps) {
  return (
    <button type="submit" className="primary-btn" disabled={disabled}>
      {label}
    </button>
  );
}

export default AuthButton;
