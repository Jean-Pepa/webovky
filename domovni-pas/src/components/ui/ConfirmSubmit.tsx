"use client";

import { useFormStatus } from "react-dom";

export function ConfirmSubmit({
  children,
  message,
  className = "btn-danger btn-sm",
}: {
  children: React.ReactNode;
  message: string;
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={className}
      onClick={(e) => {
        if (!confirm(message)) e.preventDefault();
      }}
    >
      {children}
    </button>
  );
}
