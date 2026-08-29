import "./input.css";

type AuthInputProps = {
  label: string;
  type?: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

function AuthInput({
  label,
  type = "text",
  name,
  value,
  onChange,
}: AuthInputProps) {
  return (
    <div className="auth-field">
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

export default AuthInput;
