"use client";
import { CheckCircle, XCircle, AlertCircle, X } from "lucide-react";

interface AlertMessageProps {
  type: "success" | "error" | "warning";
  message: string;
  onClose?: () => void;
}

export default function AlertMessage({
  type,
  message,
  onClose,
}: AlertMessageProps) {
  const styles = {
    success: {
      wrapper: "bg-emerald-50 border-emerald-200 text-emerald-800",
      icon: "text-emerald-500",
      IconComp: CheckCircle,
    },
    error: {
      wrapper: "bg-red-50 border-red-200 text-red-800",
      icon: "text-red-500",
      IconComp: XCircle,
    },
    warning: {
      wrapper: "bg-amber-50 border-amber-200 text-amber-800",
      icon: "text-amber-500",
      IconComp: AlertCircle,
    },
  };

  const s = styles[type];
  const Icon = s.IconComp;

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-lg border ${s.wrapper} animate-fade-in`}
    >
      <Icon className={`w-4 h-4 ${s.icon} flex-shrink-0 mt-0.5`} />
      <p className="text-sm flex-1">{message}</p>
      {onClose && (
        <button
          onClick={onClose}
          className="opacity-60 hover:opacity-100 transition-opacity flex-shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
