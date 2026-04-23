'use client';

/**
 * Input Component
 * A standardized input with labels and optional icons, using CSS-driven styling.
 */
export default function Input({ 
  label, 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  required = false,
  icon: Icon,
  className = '',
  id,
  ...props 
}) {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label htmlFor={id} className="input-label">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none transition-colors">
            <Icon size={18} />
          </div>
        )}
        <input 
          id={id}
          type={type}
          required={required}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`input-field ${Icon ? 'pl-11' : ''}`}
          {...props}
        />
      </div>
    </div>
  );
}
