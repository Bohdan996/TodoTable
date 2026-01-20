import { useEffect, useRef, useState } from 'react';
import { ThreeDotsIcon } from '@/assets/icons';
import Tooltip from '../tooltip';
import Button from '../button';

import './Dropdown.scss';

type DropdownProps = {
  children: React.ReactNode;
  variant?: 'transparent' | 'outline' | 'fill',
  size?: 'sm' | 'md' | 'lg',
  color?: 'primary' | 'secondary',
};

export default function Dropdown({ 
  children,
  variant,
  size = 'sm',
  color = 'secondary'

}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const toggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    setOpen(prev => !prev);
  }

  const close = () => setOpen(false);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) {
        close();
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  return (
    <div className="Dropdown" ref={ref}>
      <Tooltip
        content="Options"
      >
        <Button
          content={<ThreeDotsIcon 
            color={color === 'primary'
              ? '#3b82f6'
              : '#000'
            }
            size={size === 'md'
              ? '1.25rem'
              : 16
            }
          />}
          size={size}
          variant={variant}
          color={color}
          action={toggle}
        />
      </Tooltip>

      {open && (
        <div className="Dropdown__menu">
          {children}
        </div>
      )}
    </div>
  );
}
