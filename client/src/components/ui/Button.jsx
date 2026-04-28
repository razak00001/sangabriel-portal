import React from 'react';
import { cn } from '../../utils/cn';

/**
 * Button Component
 * A high-end button system with premium variants and smooth transitions.
 */
export default function Button({ 
  children, 
  variant = 'primary', // 'primary' | 'secondary' | 'glass' | 'danger' | 'outline' | 'ghost'
  size = 'md', // 'sm' | 'md' | 'lg'
  type = 'button',
  disabled = false,
  onClick,
  className,
  loading = false,
  icon: Icon,
  ...props 
}) {
  const sizes = {
    sm: 'px-4 py-2 text-[10px]',
    md: 'px-6 py-3.5 text-sm',
    lg: 'px-8 py-5 text-lg'
  };

  const variants = {
    primary: 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 hover:shadow-indigo-600/30',
    secondary: 'bg-white text-gray-900 border border-gray-100 shadow-sm hover:bg-gray-50',
    glass: 'glass border-white/50 text-gray-900 hover:bg-white/80',
    danger: 'bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-100',
    outline: 'bg-transparent border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50',
    ghost: 'bg-transparent text-gray-500 hover:bg-gray-100 hover:text-gray-900'
  };

  return (
    <button 
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={cn(
        "flex items-center justify-center gap-2.5",
        "rounded-2xl font-black uppercase tracking-widest",
        "transition-all duration-300 active:scale-95",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        sizes[size],
        variants[variant],
        className
      )}
      {...props}
    >
      {loading ? (
        <div className="flex items-center justify-center gap-2">
          <div className="size-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
          <span className="animate-pulse">Processing</span>
        </div>
      ) : (
        <>
          {Icon && <Icon size={size === 'sm' ? 14 : 18} strokeWidth={2.5} />}
          {children}
        </>
      )}
    </button>
  );
}
