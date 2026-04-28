import React from 'react';
import { cn } from '../../utils/cn';

/**
 * Card Component
 * A high-end reusable container with multiple variants.
 */
export default function Card({ 
  children, 
  className, 
  onClick, 
  hover = false,
  variant = 'glass', // 'glass' | 'bento' | 'flat' | 'outline'
  animate = true,
  padding = 'p-5 sm:p-10',
  ...props
}) {
  return (
    <div 
      className={cn(
        "rounded-[2.5rem] transition-all duration-500",
        // Variants
        variant === 'glass' && "glass",
        variant === 'bento' && "bento-card",
        variant === 'flat' && "bg-white border border-gray-100 shadow-sm",
        variant === 'outline' && "bg-transparent border-2 border-gray-100",
        
        // Behaviors
        padding,
        hover && "hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/10",
        onClick && "cursor-pointer active:scale-[0.98]",
        animate && "animate-slide-up",
        className
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
}
