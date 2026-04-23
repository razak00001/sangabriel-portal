'use client';

import { X } from 'lucide-react';

/**
 * Modal Component
 * A premium overlay system with glassmorphism and standardized transitions.
 */
export default function Modal({ 
  isOpen, 
  onClose, 
  title, 
  subtitle, 
  icon: Icon, 
  children, 
  maxWidth = '500px' 
}) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9998] animate-fadeIn"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="fixed inset-0 flex items-center justify-center p-4 z-[9999] pointer-events-none">
        {/* Modal Card */}
        <div 
          className="glass w-full overflow-hidden flex flex-col pointer-events-auto animate-fadeIn shadow-2xl border border-white/20"
          style={{ maxWidth, maxHeight: '92vh' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <header className="relative bg-gradient-to-br from-indigo-500 to-indigo-700 p-8 text-white">
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 size-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
              aria-label="Close"
            >
              <X size={20} strokeWidth={2.5} />
            </button>
            
            <div className="flex items-center gap-5">
              {Icon && (
                <div className="size-14 rounded-2xl bg-white/20 flex items-center justify-center text-white shadow-inner">
                  <Icon size={28} strokeWidth={2.5} />
                </div>
              )}
              <div className="overflow-hidden">
                <h2 className="text-2xl font-black tracking-tight leading-tight">
                  {title}
                </h2>
                {subtitle && (
                  <p className="text-sm font-bold text-white/80 mt-0.5 uppercase tracking-wider">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>
          </header>

          {/* Body */}
          <div className="p-8 overflow-y-auto flex-1 bg-white">
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
