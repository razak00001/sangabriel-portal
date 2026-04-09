'use client';

export default function Button({ 
  children, 
  variant = 'primary', 
  type = 'button',
  disabled = false,
  onClick,
  fullWidth = false,
  ...props 
}) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
          color: '#ffffff',
          boxShadow: '0 4px 6px -1px rgba(99, 102, 241, 0.3)',
          hoverShadow: '0 6px 8px -1px rgba(99, 102, 241, 0.4)'
        };
      case 'secondary':
        return {
          background: '#f3f4f6',
          color: '#374151',
          boxShadow: 'none',
          hoverBackground: '#e5e7eb'
        };
      case 'danger':
        return {
          background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
          color: '#ffffff',
          boxShadow: '0 4px 6px -1px rgba(239, 68, 68, 0.3)',
          hoverShadow: '0 6px 8px -1px rgba(239, 68, 68, 0.4)'
        };
      default:
        return {
          background: '#f3f4f6',
          color: '#374151'
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <button 
      type={type}
      disabled={disabled}
      onClick={onClick}
      style={{ 
        width: fullWidth ? '100%' : 'auto',
        padding: '0.75rem 1.5rem',
        fontSize: '0.9375rem',
        fontWeight: '600',
        borderRadius: '8px',
        background: styles.background,
        color: styles.color,
        border: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontFamily: 'inherit',
        opacity: disabled ? 0.6 : 1,
        transition: 'transform 0.2s, box-shadow 0.2s, background 0.2s',
        boxShadow: styles.boxShadow || 'none'
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          if (styles.hoverShadow) {
            e.target.style.transform = 'translateY(-1px)';
            e.target.style.boxShadow = styles.hoverShadow;
          }
          if (styles.hoverBackground) {
            e.target.style.background = styles.hoverBackground;
          }
        }
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = 'translateY(0)';
        e.target.style.boxShadow = styles.boxShadow || 'none';
        if (styles.hoverBackground) {
          e.target.style.background = styles.background;
        }
      }}
      {...props}
    >
      {children}
    </button>
  );
}
