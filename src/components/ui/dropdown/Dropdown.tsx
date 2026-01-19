import { useEffect, useRef, useState } from 'react';
import { ThreeDotsIcon } from '@/assets/icons';
import Button from '../button';

import './Dropdown.scss';

type DropdownProps = {
  children: React.ReactNode;
};

export default function Dropdown({ children }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const toggle = () => setOpen(prev => !prev);
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
      <Button
        content={<ThreeDotsIcon />}
        size="sm"
        color="secondary"
        action={toggle}
      />

      {open && (
        <div className="Dropdown__menu">
          {children}
        </div>
      )}
    </div>
  );
}
