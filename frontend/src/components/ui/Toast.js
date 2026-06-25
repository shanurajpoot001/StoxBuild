import React, { createContext, useCallback, useContext, useState } from "react";

const ToastContext = createContext({ showToast: () => {} });

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast-container" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`toast-item ${t.type}`}>
            {t.type === "success" && <span>✓</span>}
            {t.type === "error" && <span>✕</span>}
            {t.type === "info" && <span>ℹ</span>}
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
