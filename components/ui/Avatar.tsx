import { clsx } from 'clsx';

interface AvatarProps {
  name: string;
  imageUrl?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function getColorFromName(name: string): string {
  const colors = [
    'bg-brand-500',
    'bg-emerald-500',
    'bg-amber-500',
    'bg-rose-500',
    'bg-purple-500',
    'bg-cyan-500',
    'bg-indigo-500',
    'bg-pink-500',
  ];

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length];
}

export function Avatar({ name, imageUrl, size = 'md', className }: AvatarProps) {
  const sizeClasses = {
    sm: 'h-6 w-6 text-xs',
    md: 'h-8 w-8 text-sm',
    lg: 'h-10 w-10 text-base',
  };

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={name}
        className={clsx(
          'rounded-full object-cover border-2 border-black',
          sizeClasses[size],
          className
        )}
      />
    );
  }

  return (
    <div
      className={clsx(
        'inline-flex items-center justify-center rounded-full font-bold text-white border-2 border-black',
        sizeClasses[size],
        getColorFromName(name),
        className
      )}
      title={name}
    >
      {getInitials(name)}
    </div>
  );
}
