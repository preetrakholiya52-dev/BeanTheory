import React from 'react';
import HoverLink from '../ui/HoverLink';

export default function Footer() {
  return (
    <footer className="w-full py-12 px-6 md:px-16 flex flex-col md:flex-row items-center justify-between bg-[#050302] text-bean-white/40 text-xs font-sans uppercase tracking-[0.2em] border-t border-bean-white/10 z-10 pointer-events-auto">
      <div>© 2026 Bean Theory. All Rights Reserved.</div>
      
      <div className="flex gap-8 mt-8 md:mt-0">
        <HoverLink>Instagram</HoverLink>
        <HoverLink>Twitter</HoverLink>
        <HoverLink>Journal</HoverLink>
      </div>
    </footer>
  );
}
