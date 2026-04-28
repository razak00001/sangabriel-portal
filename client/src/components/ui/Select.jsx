import React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../utils/cn';

/**
 * Select Component
 * A premium dropdown system with custom styling and smooth transitions.
 */
export default function Select({ 
  label, 
  value, 
  onChange, 
  options = [],
  icon: Icon,
  className,
  id,
  error,
  required,
  ...props 
}) {
  return (
    <div className={cn("flex flex-col gap-2.5", className)}>
      {label && (
        <label 
          htmlFor={id} 
          className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] ml-1.5"
        >
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <div className="relative group/select">
        {Icon && (
          <div className={cn(
            "absolute left-5 top-1/2 -translate-y-1/2 transition-all duration-300 pointer-events-none z-10",
            error ? "text-rose-500" : "text-gray-400 group-focus-within/select:text-indigo-500"
          )}>
            <Icon size={18} strokeWidth={2.5} />
          </div>
        )}
        
        <select 
          id={id}
          value={value}
          onChange={onChange}
          required={required}
          className={cn(
            "input-premium w-full appearance-none cursor-pointer pr-12",
            Icon && "pl-14",
            error && "border-rose-200 bg-rose-50/30 focus:border-rose-500"
          )}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-focus-within/select:text-indigo-500 transition-all duration-300">
          <ChevronDown size={18} strokeWidth={2.5} />
        </div>
      </div>
      {error && (
        <p className="text-[10px] font-black text-rose-500 ml-1.5 uppercase tracking-widest animate-slide-up">
          {error}
        </p>
      )}
    </div>
  );
}
