'use client';
import css from './CustomSelect.module.css';
import { useState, useRef, useEffect, ChangeEvent } from 'react';

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  id?: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
  options: Option[];
  onChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
}

export default function CustomSelect({
  id,
  name,
  defaultValue,
  required,
  options,
  onChange,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(defaultValue ?? options[0]?.value ?? '');
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedLabel = options.find(o => o.value === selected)?.label ?? selected;

  useEffect(() => {
    if (!isOpen) return;

    const onClickOutside = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setIsOpen(false);
    };
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('click', onClickOutside);
    document.addEventListener('keydown', onEscape);
    return () => {
      document.removeEventListener('click', onClickOutside);
      document.removeEventListener('keydown', onEscape);
    };
  }, [isOpen]);

  const pick = (value: string) => {
    setSelected(value);
    setIsOpen(false);
    onChange?.({ target: { name, value } } as unknown as ChangeEvent<HTMLSelectElement>);
  };

  return (
    <div className={css.container} ref={containerRef}>
      <input type="hidden" name={name} value={selected} required={required} />
      <button
        type="button"
        id={id}
        className={`${css.trigger} ${isOpen ? css.triggerOpen : ''}`}
        onClick={() => setIsOpen(v => !v)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {selectedLabel}
        <span className={`${css.chevron} ${isOpen ? css.chevronOpen : ''}`} aria-hidden="true" />
      </button>

      {isOpen && (
        <ul className={css.listbox} role="listbox">
          {options.map(opt => (
            <li key={opt.value} role="option" aria-selected={opt.value === selected}>
              <button
                type="button"
                className={`${css.option} ${opt.value === selected ? css.optionSelected : ''}`}
                onClick={() => pick(opt.value)}
              >
                {opt.label}
                {opt.value === selected && (
                  <span className={css.check} aria-hidden="true" />
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
