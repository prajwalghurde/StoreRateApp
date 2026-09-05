import React, { useEffect, useState } from "react";

const ToastMessage = ({ message, type = "error", duration = 3000 }) => {
  const [visible, setVisible] = useState(!!message);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), duration);
      return () => clearTimeout(timer);
    }
  }, [message, duration]);

  if (!visible) return null;

  const baseStyles = "px-4 py-3 rounded shadow-md animate-fade-in-out";
  const typeStyles =
    type === "success"
      ? "bg-green-100 border border-green-400 text-green-700"
      : "bg-red-100 border border-red-400 text-red-700";

  return (
    <div className="fixed top-5 right-5 z-50">
      <div className={`${baseStyles} ${typeStyles}`} role="alert">
        <span className="block sm:inline">{message}</span>
      </div>
    </div>
  );
};

export default ToastMessage;
