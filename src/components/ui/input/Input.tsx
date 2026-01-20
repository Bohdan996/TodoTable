import React from "react";
import clsx from 'clsx';

import "./Input.scss";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  variant?: "transparent" | "outline";
  color?: "primary" | "danger";
  inputSize?: "sm" | "md" | "lg";
  fullWidth?: boolean;
};

export const Input: React.FC<InputProps> = ({
  variant = "transparent",
  color = "primary",
  inputSize = "md",
  fullWidth = false,
  ...props
}) => {
  return (
    <input
      autoFocus
      className={clsx('Input', { 'Input--fullWidth': fullWidth })}
      data-variant={variant}
      data-color={color}
      data-input-size={inputSize}
      {...props}
    />
  );
};
