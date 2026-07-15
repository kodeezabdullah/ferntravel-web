import type { ReactNode, InputHTMLAttributes } from 'react';

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  /** Optional element rendered inside the right edge of the input (e.g. eye icon) */
  rightSlot?: ReactNode;
}

export default function AuthInput({ label, id, rightSlot, className, ...rest }: AuthInputProps) {
  return (
    <div className="flex flex-col gap-1.5 mb-4">
      <label
        htmlFor={id}
        className="text-[13px] font-medium"
        style={{ color: 'rgba(255,255,255,0.65)', fontFamily: 'var(--font-inter), sans-serif' }}
      >
        {label}
      </label>

      <div className="relative flex items-center">
        <input
          id={id}
          {...rest}
          className={`w-full rounded-xl px-4 py-3 text-[14px] text-white outline-none transition-all duration-150 ${className ?? ''}`}
          style={{
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.10)',
            fontFamily: 'var(--font-inter), sans-serif',
            caretColor: '#f2a93b',
            // placeholder color handled via global style below
          }}
          placeholder={rest.placeholder}
        />
        {rightSlot && (
          <div className="absolute right-3 flex items-center">{rightSlot}</div>
        )}
      </div>
    </div>
  );
}
