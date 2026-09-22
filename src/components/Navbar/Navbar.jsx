import React from 'react';
import { Menu } from 'lucide-react';
import HoverLink from '../ui/HoverLink';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full px-6 py-6 md:px-16 md:py-8 flex justify-between items-center z-50 mix-blend-difference pointer-events-auto">
      {/* Brand Logo */}
      <div className="text-xl md:text-2xl font-display uppercase tracking-[0.2em] font-bold text-bean-white">
        <HoverLink>Bean Theory</HoverLink>
      </div>
      
      {/* Desktop Links */}
      <div className="hidden md:flex gap-12 font-sans text-xs tracking-[0.2em] uppercase font-semibold text-bean-white">
        <HoverLink>Coffee</HoverLink>
        <HoverLink>Origin</HoverLink>
        <HoverLink>Store</HoverLink>
      </div>
      
      {/* Mobile Menu Icon */}
      <button className="md:hidden text-bean-white cursor-pointer" data-cursor="" aria-label="Open menu">
        <Menu className="w-6 h-6" />
      </button>
    </nav>
  );
}
