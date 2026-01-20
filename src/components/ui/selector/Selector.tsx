import { useState, useRef, useEffect } from "react";
import { type Control, Controller } from "react-hook-form";
import { textTrimmer } from "@/utils/texts";
import Tooltip from "../tooltip";

import './Selector.scss'

type Option = {
  id: string;
  label: string;
};

type CustomSelectProps = {
  name: string;
  control: Control<any>;
  options: Option[];
  defaultValue?: string;
};

export default function CustomSelect({
  name,
  control,
  options,
  defaultValue,
}: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const MAX_TEXT_LENGTH = 30;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue ?? options[0]?.id ?? ""}
      render={({ field }) => (
        <div className="Selector" ref={wrapperRef}>
          <div
            className="Selector__selected"
            onClick={() => setOpen((prev) => !prev)}
          >
            <Tooltip 
              content={options.find((o) => o.id === field.value)?.label || "Select"}
              dontShow={!options.find((o) => o.id === field.value)?.label?.length ||
                ((options.find((o) => o.id === field.value)?.label?.length || 0) < MAX_TEXT_LENGTH)}
            >
              {textTrimmer(options.find((o) => o.id === field.value)?.label || "Select", MAX_TEXT_LENGTH)}
            </Tooltip>
            <span className="Selector__arrow">▾</span>
          </div>

          {open && (
            <ul className="Selector__options">
              {options.map((option) => (
                <li
                  key={option.id}
                  className="Selector__option"
                  onClick={() => {
                    field.onChange(option.id);
                    setOpen(false);
                  }}
                >
                  <Tooltip 
                    content={option.label}
                    dontShow={option.label?.length < MAX_TEXT_LENGTH}
                  >
                    {textTrimmer(option.label, MAX_TEXT_LENGTH)}
                  </Tooltip>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    />
  );
}
