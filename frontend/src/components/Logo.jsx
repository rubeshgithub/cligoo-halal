import React from 'react';

const Logo = ({ size = 36, showText = true, className = '' }) => (
  <div className={`flex items-center gap-2 ${className}`}>
    <img
      src="/cligoo-logo.jpeg"
      alt="CLIGOO"
      width={size}
      height={size}
      className="object-contain shrink-0"
      style={{ width: size, height: size }}
    />
    {showText && (
      <div className="flex flex-col leading-none">
        <span
          className="font-display font-extrabold tracking-tight text-[#1F3B40]"
          style={{ fontSize: size * 0.58 }}
        >
          CLIGOO
        </span>
        <span
          className="font-semibold tracking-[0.15em] mt-0.5"
          style={{ fontSize: size * 0.22 }}
        >
          <span style={{ color: '#2EA84A' }}>CLICK</span>
          <span style={{ color: '#9CA3AF' }}> &amp; </span>
          <span style={{ color: '#B85C3E' }}>GOO</span>
        </span>
      </div>
    )}
  </div>
);

export default Logo;
