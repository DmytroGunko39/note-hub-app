import css from './Logo.module.css';

interface LogoProps {
  size?: number;
  className?: string;
  // Accessible name for standalone use; omit when "NoteHub" text is next to it
  label?: string;
}

// Same artwork as app/icon.svg (keep the two in sync)
export default function Logo({ size = 28, className, label }: LogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      width={size}
      height={size}
      className={className ? `${css.logo} ${className}` : css.logo}
      {...(label
        ? { role: 'img', 'aria-label': label }
        : { 'aria-hidden': true, focusable: false })}
    >
      <rect width="32" height="32" rx="7" fill="#7c3aed" />
      <path
        fill="#fff"
        d="M5 24V8h3l4 9V8h3v16h-3l-4-9v9zM17 8h3v6.5h4V8h3v16h-3v-6.5h-4V24h-3z"
      />
    </svg>
  );
}
