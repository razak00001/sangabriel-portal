'use client';

import { ChevronDown } from 'lucide-react';

/**
 * Select Component
 * A standardized dropdown system with labels and icons, using CSS-driven styling.
 */
export default function Select({ 
  label, 
  value, 
  onChange, 
  options = [],
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
      <div className="relative group">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none z-10 transition-colors group-focus-within:text-primary">
            <Icon size={18} />
          </div>
        )}
        
        <select 
          id={id}
          value={value}
          onChange={onChange}
          className={`input-field appearance-none cursor-pointer pr-10 ${Icon ? 'pl-11' : ''}`}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted group-focus-within:text-primary transition-colors">
          <ChevronDown size={18} />
        </div>
      </div>
    </div>
  );
}
