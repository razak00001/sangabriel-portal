'use client';

/**
 * Button Component
 * A standardized button system with multiple variants, using CSS-driven styling.
 */
export default function Button({ 
  children, 
  variant = 'primary', 
  type = 'button',
  disabled = false,
  onClick,
  className = '',
  loading = false,
  ...props 
}) {
  const variantClass = `btn-${variant}`;

  return (
    <button 
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`btn ${variantClass} ${className} ${loading ? 'opacity-70 cursor-wait' : ''}`}
      {...props}
    >
      {loading ? (
        <div className="flex items-center justify-center gap-2">
          <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          {children}
        </div>
      ) : (
        children
      )}
    </button>
  );
}
