import { Button as REButton } from "@react-email/components";
import * as React from "react";

interface ButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
}

export function Button({ href, children, variant = "primary" }: ButtonProps) {
  const styles =
    variant === "primary"
      ? "bg-indigo-600 text-white"
      : "bg-white text-indigo-600 border border-indigo-600";

  return (
    <REButton
      href={href}
      className={`${styles} rounded-md text-sm font-semibold no-underline text-center block py-3 px-6`}
    >
      {children}
    </REButton>
  );
}
