import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn';

/**
 * Modal Component
 * A high-end overlay system with smooth entrance animations and premium styling.
 */
export default function Modal({ 
  isOpen, 
  onClose, 
  title, 
  subtitle, 
  icon: Icon, 
  children, 
  maxWidth = 'max-w-xl',
  className
}) {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-md animate-in fade-in duration-500"
        onClick={onClose}
      />
      
      {/* Modal Card */}
      <div 
        className={cn(
          "relative bg-white w-full shadow-2xl border border-gray-100 rounded-[2.5rem] overflow-hidden flex flex-col",
          "animate-slide-up z-10",
          maxWidth,
          className
        )}
        style={{ maxHeight: '90vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <header className="relative bg-slate-950 p-10 text-white overflow-hidden shrink-0">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-3xl rounded-full translate-x-20 -translate-y-20 pointer-events-none" />
          
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 size-10 rounded-2xl bg-white/5 hover:bg-white/15 flex items-center justify-center transition-all hover:rotate-90 active:scale-90 text-white/40 hover:text-white border-none cursor-pointer"
            aria-label="Close"
          >
            <X size={20} strokeWidth={2.5} />
          </button>
          
          <div className="flex items-center gap-6 relative z-10">
            {Icon && (
              <div className="size-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg border border-white/10 shrink-0">
                <Icon size={28} strokeWidth={2.5} />
              </div>
            )}
            <div className="overflow-hidden">
              <h2 className="text-3xl font-black tracking-tight leading-tight m-0">
                {title}
              </h2>
              {subtitle && (
                <p className="text-[10px] font-black text-indigo-300 mt-2 uppercase tracking-[0.2em] m-0">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
        </header>

        {/* Body */}
        <div className="p-10 overflow-y-auto custom-scrollbar bg-white">
          {children}
        </div>
      </div>
    </div>
  );
}
