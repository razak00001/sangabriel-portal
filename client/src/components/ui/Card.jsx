'use client';

/**
 * Card Component
 * A reusable container with glassmorphism and standardized padding.
 */
export default function Card({ children, className = '', onClick, hover = false }) {
  return (
    <div 
      className={`glass p-6 ${hover ? 'card-hover' : ''} ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
