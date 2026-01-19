import type React from 'react';
import clsx from 'clsx';

import './Button.scss';

type ButtonProps = {
  content: React.ReactNode;
  action?: () => void;
  type?: 'button' | 'submit';
  fullWidth?: boolean;
  variant?: "fill" | "transparent" | "outline";
  color?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
  contentPosition?: "left" | "center" | "right"
};

export default function Button({
  content,
  action,
  type = 'button',
  fullWidth = false,
  variant = 'transparent',
  color = 'primary',
  size = 'md',
  contentPosition = 'center'
}: ButtonProps) {
  return (
    <button 
      className={clsx('Button', { 'Button--fullWidth': fullWidth })}
      data-variant={variant}
      data-color={color}
      data-size={size}
      data-content-position={contentPosition}
      onClick={action}
      type={type}
    >
      {content}
    </button>
  )
}