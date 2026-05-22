import { useState, useEffect, useCallback, createContext, useContext } from 'react'
import { HiOutlineCheckCircle, HiOutlineXCircle, HiOutlineX } from 'react-icons/hi'

// ---- Context ----
const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random()
    setToasts((prev) => [...prev, { id, message, type }])
  }, [])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used within ToastProvider')
  return context
}

// ---- Container ----
function ToastContainer({ toasts, removeToast }) {
  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  )
}

// ---- Single Toast ----
function ToastItem({ toast, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3500)
    return () => clearTimeout(timer)
  }, [onClose])

  const isSuccess = toast.type === 'success'
  const Icon = isSuccess ? HiOutlineCheckCircle : HiOutlineXCircle

  return (
    <div className={`glass-card px-5 py-3 flex items-center gap-3 min-w-[280px] animate-[slideIn_0.3s_ease-out] ${
      isSuccess ? 'border-green-200' : 'border-red-200'
    }`}>
      <Icon className={`w-5 h-5 flex-shrink-0 ${isSuccess ? 'text-green-500' : 'text-red-500'}`} />
      <span className="text-sm text-gray-700 flex-1">{toast.message}</span>
      <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
        <HiOutlineX className="w-4 h-4" />
      </button>
    </div>
  )
}
