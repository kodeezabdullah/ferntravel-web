import type { ReactNode } from 'react';

interface AuthCardProps {
  children: ReactNode;
}

export default function AuthCard({ children }: AuthCardProps) {
  return (
    <div
      className="w-full rounded-3xl px-5 py-4"
      style={{
        background: 'rgba(255, 255, 255, 0.055)',
        border: '1px solid rgba(255, 255, 255, 0.10)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      {children}
    </div>
  );
}
