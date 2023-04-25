import { forwardRef } from 'react';
// {errors.email && <span role="alert">{errors.email.message}</span>}
type InputProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  label: string;
  error?: string;
};

const Password = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, ...props }, ref) => (
    <div>
      <label>{label}</label>
      <input
        type="password"
        ref={ref}
        {...props}
        className="block w-full px-3 py-2 mt-1 text-sm placeholder-gray-400 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 disabled:bg-gray-50 disabled:text-gray-500 disabled:border-gray-200 disabled:shadow-none invalid:border-pink-500 invalid:text-pink-600 focus:invalid:border-pink-500 focus:invalid:ring-pink-500"
      />
      {error && <span role="alert">{error}</span>}
    </div>
  )
);

Password.displayName = 'Password';
export default Password;
