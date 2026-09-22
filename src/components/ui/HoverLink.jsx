import React from 'react';

export default function HoverLink({ children, href = "#", className = "" }) {
  return (
    <a 
      href={href} 
      data-cursor="" // Tell CustomCursor to expand slightly
      className={`relative inline-block group overflow-hidden ${className}`}
    >
      <span className="relative z-10">{children}</span>
      
      {/* Animated Underline */}
      <span className="absolute bottom-0 left-0 w-full h-[1px] bg-current origin-bottom-right scale-x-0 transition-transform duration-500 ease-out group-hover:origin-bottom-left group-hover:scale-x-100"></span>
    </a>
  );
}
