const Button = ({ children, className = "btn-primary", ...props }) => (
  <button className={className} {...props}>
    {children}
  </button>
);

export default Button;