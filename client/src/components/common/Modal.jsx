const Modal = ({ title = "Modal", children }) => (
  <div className="card">
    <h4>{title}</h4>
    {children}
  </div>
);

export default Modal;