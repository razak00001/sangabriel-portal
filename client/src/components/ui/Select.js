'use client';

export default function Select({ 
  label, 
  value, 
  onChange, 
  options = [],
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
            pointerEvents: 'none',
            zIndex: 1
          }} />
        )}
        <select 
          value={value}
          onChange={onChange}
          style={{ 
            width: '100%',
            padding: Icon ? '0.75rem 0.875rem 0.75rem 2.75rem' : '0.75rem 0.875rem',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            fontSize: '0.9375rem',
            outline: 'none',
            fontFamily: 'inherit',
            boxSizing: 'border-box',
            appearance: 'none',
            background: '#ffffff',
            cursor: 'pointer',
            transition: 'border-color 0.2s'
          }}
          onFocus={(e) => e.target.style.borderColor = '#6366f1'}
          onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div style={{ 
          position: 'absolute',
          right: '0.875rem',
          top: '50%',
          transform: 'translateY(-50%)',
          pointerEvents: 'none',
          color: '#9ca3af'
        }}>
          ▼
        </div>
      </div>
    </div>
  );
}
