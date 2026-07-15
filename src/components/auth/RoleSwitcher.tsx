'use client';

interface RoleSwitcherProps {
  options: [string, string];
  value: string;
  onChange: (v: string) => void;
}

export default function RoleSwitcher({ options, value, onChange }: RoleSwitcherProps) {
  return (
    <div
      className="flex w-full rounded-full p-1 mb-7"
      style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.10)' }}
    >
      {options.map((opt) => {
        const active = value === opt;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className="flex-1 rounded-full py-2 text-[13px] font-semibold transition-all duration-200"
            style={
              active
                ? {
                    background: '#f2a93b',
                    color: '#1a1a1a',
                    fontFamily: 'var(--font-inter), sans-serif',
                  }
                : {
                    background: 'transparent',
                    color: 'rgba(255,255,255,0.55)',
                    fontFamily: 'var(--font-inter), sans-serif',
                  }
            }
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}
