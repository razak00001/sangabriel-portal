'use client';

import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, subtitle, icon: Icon, children, maxWidth = '500px' }) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        style={{ 
          position: 'fixed', 
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)', 
          backdropFilter: 'blur(4px)',
          zIndex: 9998,
          animation: 'fadeIn 0.2s ease'
        }}
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div 
        style={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          zIndex: 9999,
          pointerEvents: 'none'
        }}
      >
        {/* Modal Content */}
        <div 
          style={{ 
            width: '100%',
            maxWidth,
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            pointerEvents: 'auto',
            animation: 'slideUp 0.3s ease',
            maxHeight: '90vh',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div style={{ 
            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
            padding: '1.75rem 2rem',
            position: 'relative'
          }}>
            <button 
              onClick={onClose}
              type="button"
              style={{ 
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                border: 'none',
                background: 'rgba(255, 255, 255, 0.2)',
                color: '#ffffff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                fontWeight: '600',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
            >
              ×
            </button>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {Icon && (
                <div style={{ 
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff'
                }}>
                  <Icon size={24} strokeWidth={2.5} />
                </div>
              )}
              <div>
                <h2 style={{ 
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: '#ffffff',
                  margin: 0,
                  marginBottom: subtitle ? '0.25rem' : 0
                }}>
                  {title}
                </h2>
                {subtitle && (
                  <p style={{ 
                    fontSize: '0.875rem',
                    color: 'rgba(255, 255, 255, 0.9)',
                    margin: 0
                  }}>
                    {subtitle}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Body */}
          <div style={{ 
            padding: '2rem',
            overflowY: 'auto',
            flex: 1
          }}>
            {children}
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}} />
    </>
  );
}
