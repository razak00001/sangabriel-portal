import React from 'react';
import { cn } from '../../utils/cn';

/**
 * Input Component
 * A premium input system with smooth focus transitions and validation states.
 */
export default function Input({ 
  label, 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  required = false,
  icon: Icon,
  className,
  id,
  error,
  success,
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
      <div className="relative group/input">
        {Icon && (
          <div className={cn(
            "absolute left-5 top-1/2 -translate-y-1/2 transition-all duration-300 pointer-events-none z-10",
            error ? "text-rose-500" : "text-gray-400 group-focus-within/input:text-indigo-500"
          )}>
            <Icon size={18} strokeWidth={2.5} />
          </div>
        )}
        <input 
          id={id}
          type={type}
          required={required}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={cn(
            "input-premium w-full",
            Icon && "pl-14",
            error && "border-rose-200 bg-rose-50/30 focus:border-rose-500 focus:ring-rose-500/10",
            success && "border-emerald-200 bg-emerald-50/30 focus:border-emerald-500 focus:ring-emerald-500/10"
          )}
          {...props}
        />
      </div>
      {error && (
        <p className="text-[10px] font-black text-rose-500 ml-1.5 uppercase tracking-widest animate-slide-up">
          {error}
        </p>
      )}
    </div>
  );
}
