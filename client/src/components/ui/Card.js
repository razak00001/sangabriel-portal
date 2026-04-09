'use client';

export default function Card({ children, padding = '1.5rem', hover = false, onClick }) {
  return (
    <div 
      className="glass" 
      style={{ 
        padding,
        cursor: onClick ? 'pointer' : 'default',
        transition: hover ? 'transform 0.2s, box-shadow 0.2s' : 'none'
      }}
      onClick={onClick}
      onMouseEnter={(e) => {
        if (hover) {
          e.currentTarget.style.transform = 'translateY(-2px)';
        }
      }}
      onMouseLeave={(e) => {
        if (hover) {
          e.currentTarget.style.transform = 'translateY(0)';
        }
      }}
    >
      {children}
    </div>
  );
}
