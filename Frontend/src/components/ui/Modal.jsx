import { X } from "lucide-react";

function Modal({ open, onClose, title, size = "md", children }) {
  if (!open) {
    return null;
  }

  const sizes = {
    sm: "max-w-sm",
    md: "max-w-lg",
    lg: "max-w-2xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4 backdrop-blur-sm">
      <div className={`w-full ${sizes[size] || sizes.md} rounded-lg bg-white shadow-xl`}>
        <div className="flex items-center justify-between border-b border-ink/10 p-4">
          <h2 className="font-display font-semibold text-ink">{title}</h2>

          <button onClick={onClose} className="rounded p-1 text-ink-soft hover:bg-ink/[0.06]">
            <X size={20} />
          </button>
        </div>

        <div className="max-h-[75vh] overflow-y-auto p-4">{children}</div>
      </div>
    </div>
  );
}

export default Modal;
