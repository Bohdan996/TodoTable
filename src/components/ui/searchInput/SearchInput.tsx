import { useState, useEffect } from "react";

import { SearchIcon } from "@/assets/icons";
import { useDebounce } from "@/hooks/useDebounce";
import { Input, type InputProps } from "../input/Input";

import "./SearchInput.scss";

type SearchInputProps = Omit<InputProps, "onChange" | "value"> & {
  value?: string;
  onChange?: (value: string) => void;
  debounceTime?: number;
};

export default function SearchInput({
  value: propValue = "",
  onChange,
  debounceTime = 300,
  placeholder = "Search...",
  ...props
}: SearchInputProps) {
  const [value, setValue] = useState(propValue);
  const debouncedValue = useDebounce(value, debounceTime);

  useEffect(() => {
    onChange?.(debouncedValue);
  }, [debouncedValue, onChange]);

  return (
    <div className="SearchInput">
      <span className="SearchInput__icon" aria-hidden="true">
        <SearchIcon />
      </span>
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        
        {...props}
      />
    </div>
  );
}
