import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'secondary' | 'outline';
  className?: string;
}

export const Badge = ({
  children,
  variant = 'default',
  className = '',
}: BadgeProps) => {
  const variants = {
    default: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300',
    secondary: 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300',
    outline: 'border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-300',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
};