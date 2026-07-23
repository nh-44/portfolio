import React from 'react';

export default function BatLogo({ className = "w-9 h-5 hover:brightness-125 transition-all cursor-pointer" }) {
  return (
    <img 
      src="/bat-logo.png" 
      alt="Naveen Logo" 
      className={`object-contain inline-block filter drop-shadow-[0_0_6px_rgba(234,179,8,0.3)] ${className}`}
    />
  );
}
