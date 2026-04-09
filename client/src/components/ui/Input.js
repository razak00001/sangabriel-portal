'use client';

export default function Input({ 
  label, 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  required = false,
  icon: Icon,
  ...props 
}) {
  return (
    <div style={{ marginBottom: '1.25rem' }}>
      {label && (
        <label style={{ 
          display: 'block',
          marginBottom: '0.5rem',
          fontSize: '0.875rem',
          fontWeight: '600',
          color: '#374151'
        }}>
          {label}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        {Icon && (
          <Icon size={18} style={{ 
            position: 'absolute',
            left: '0.875rem',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#9ca3af',
            pointerEvents: 'none'
          }} />
        )}
        <input 
          type={type}
          required={required}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          style={{ 
            width: '100%',
            padding: Icon ? '0.75rem 0.875rem 0.75rem 2.75rem' : '0.75rem 0.875rem',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            fontSize: '0.9375rem',
            outline: 'none',
            fontFamily: 'inherit',
            boxSizing: 'border-box',
            transition: 'border-color 0.2s'
          }}
          onFocus={(e) => e.target.style.borderColor = '#6366f1'}
          onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
          {...props}
        />
      </div>
    </div>
  );
}
