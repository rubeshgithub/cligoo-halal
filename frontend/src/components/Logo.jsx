import React from 'react';

const Logo = ({ size = 28, className = '' }) => (
  <div className={`flex items-center gap-2 ${className}`}>
    <div
      className="rounded-xl flex items-center justify-center font-display font-extrabold text-white"
      style={{
        width: size + 8, height: size + 8,
        background: 'linear-gradient(135deg, #3E8F8B, #F5C7A1)',
        fontSize: size * 0.55,
        boxShadow: '0 6px 16px -6px rgba(255,106,53,0.55)'
      }}
    >
      C
    </div>
    <span className="font-display font-extrabold tracking-tight" style={{ fontSize: size * 0.85, color: '#1F3B40' }}>
      CLIGOO
    </span>
  </div>
);

export default Logo;
