import React, { useRef } from 'react';
import gsap from 'gsap';
import { productsData } from '../../data/products';
import ProductRow from './ProductRow';

export default function CoffeeCollection() {
  const sectionRef = useRef(null);
  
  const handleHover = (color) => {
    gsap.to(sectionRef.current, {
      backgroundColor: color,
      duration: 0.8,
      ease: 'power2.out',
    });
  };

  const handleLeave = () => {
    gsap.to(sectionRef.current, {
      backgroundColor: '#090909', // return to default bean-bg
      duration: 0.8,
      ease: 'power2.out',
    });
  };

  return (
    <section 
      ref={sectionRef}
      id="collection"
      className="relative w-full py-24 md:py-40 flex flex-col pointer-events-auto transition-colors z-10"
      style={{ backgroundColor: '#090909' }}
    >
       <div className="px-6 md:px-16 mb-20">
         <h2 className="text-xs md:text-sm font-sans tracking-[0.4em] uppercase text-bean-accent mb-6 font-semibold">
           Signature Series
         </h2>
         <h3 className="text-5xl md:text-7xl lg:text-8xl font-display uppercase text-bean-cream tracking-wide">
           The Collection
         </h3>
       </div>

       <div className="w-full border-t border-bean-white/10 flex flex-col">
         {productsData.map((product) => (
           <ProductRow 
             key={product.id} 
             product={product} 
             onHover={() => handleHover(product.color)}
             onLeave={handleLeave}
           />
         ))}
       </div>
    </section>
  );
}
