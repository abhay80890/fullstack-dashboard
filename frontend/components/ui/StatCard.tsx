'use client';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  positive?: boolean;
  icon: React.ReactNode;
  gradient: string;
}

export default function StatCard({ title, value, change, positive, icon, gradient }: StatCardProps) {
  return (
    <div className="card p-6 animate-fade-in">
      <div className="flex items-start justify-between mb-4">
        <div
          className="flex items-center justify-center w-12 h-12 rounded-xl"
          style={{ background: gradient }}
        >
          {icon}
        </div>
        {change && (
          <span
            className="text-xs font-medium px-2 py-1 rounded-full"
            style={{
              background: positive ? 'rgba(0,212,170,0.1)' : 'rgba(255,77,109,0.1)',
              color: positive ? 'var(--accent-green)' : 'var(--accent-red)',
            }}
          >
            {positive ? '↑' : '↓'} {change}
          </span>
        )}
      </div>
      <p className="text-3xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{value}</p>
      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{title}</p>
    </div>
  );
}
