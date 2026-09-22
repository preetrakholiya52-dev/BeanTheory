import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function getBrewProfile(roast, sweetness, energy) {
  if (roast > 60 && energy > 60) {
    return {
      name: 'DARK MATTER',
      roastText: 'Dark Roast',
      flavor: 'Dark Chocolate, Caramel, Smoked Walnut',
      energyText: 'INTENSE',
      description: 'An unapologetically intense roast for those who embrace the void.',
      bgColor: '#1a110d',
      beanColor: '#0a0a0a'
    };
  } else if (sweetness > 60 && roast < 50) {
    return {
      name: 'VELVET LATTE',
      roastText: 'Light Roast',
      flavor: 'Caramel, Sweet Cream, Cinnamon',
      energyText: 'CALM',
      description: 'Smooth, creamy, and dangerously addictive. The anti-routine.',
      bgColor: '#2a1a11',
      beanColor: '#D95F02'
    };
  } else if (energy < 40 && roast > 40) {
    return {
      name: 'COLD BREW 404',
      roastText: 'Medium Roast',
      flavor: 'Malt, Dark Chocolate, Crisp Apple',
      energyText: 'CHILLED',
      description: 'Steeped for 24 hours. Refreshment not found anywhere else.',
      bgColor: '#0f171e',
      beanColor: '#3d2516'
    };
  } else {
    return {
      name: 'MIDNIGHT ESPRESSO',
      roastText: 'Medium-Dark',
      flavor: 'Molasses, Toasted Almond, Vanilla',
      energyText: 'BALANCED',
      description: 'A velvet-smooth extraction that hits like midnight lightning.',
      bgColor: '#161413',
      beanColor: '#1B100B'
    };
  }
}

const BespokeDial = ({ label, leftLabel, rightLabel, value, onChange }) => {
  return (
    <div className="flex flex-col gap-6 w-full mb-10">
      <div className="flex justify-between text-[10px] md:text-xs font-sans tracking-[0.3em] uppercase text-bean-white/60">
        <span className={`transition-colors duration-300 ${value === 0 ? "text-bean-white" : ""}`}>{leftLabel}</span>
        <span className="text-bean-accent font-bold">{label}</span>
        <span className={`transition-colors duration-300 ${value === 100 ? "text-bean-white" : ""}`}>{rightLabel}</span>
      </div>
      
      <div className="relative w-full h-[1px] bg-bean-white/20 flex items-center justify-between">
        <button 
          onClick={() => onChange(0)} 
          className="absolute left-0 w-10 h-10 -ml-5 flex items-center justify-center group cursor-pointer focus:outline-none"
          aria-label={`${label} ${leftLabel}`}
        >
          <div className={`w-2 h-2 transition-all duration-500 ${value === 0 ? 'bg-bean-accent scale-150 rotate-45 shadow-[0_0_15px_rgba(217,95,2,0.5)]' : 'bg-bean-white/40 group-hover:bg-bean-white rotate-0'}`}></div>
        </button>
        
        <button 
          onClick={() => onChange(50)} 
          className="absolute left-1/2 w-10 h-10 -ml-5 flex items-center justify-center group cursor-pointer focus:outline-none"
          aria-label={`${label} Medium`}
        >
          <div className={`w-2 h-2 transition-all duration-500 ${value === 50 ? 'bg-bean-accent scale-150 rotate-45 shadow-[0_0_15px_rgba(217,95,2,0.5)]' : 'bg-bean-white/40 group-hover:bg-bean-white rotate-0'}`}></div>
        </button>
        
        <button 
          onClick={() => onChange(100)} 
          className="absolute right-0 w-10 h-10 -mr-5 flex items-center justify-center group cursor-pointer focus:outline-none"
          aria-label={`${label} ${rightLabel}`}
        >
          <div className={`w-2 h-2 transition-all duration-500 ${value === 100 ? 'bg-bean-accent scale-150 rotate-45 shadow-[0_0_15px_rgba(217,95,2,0.5)]' : 'bg-bean-white/40 group-hover:bg-bean-white rotate-0'}`}></div>
        </button>
      </div>
    </div>
  );
};

export default function ProductExperience() {
  const sectionRef = useRef(null);
  const textContentRef = useRef(null);
  
  const [roast, setRoast] = useState(50);
  const [sweetness, setSweetness] = useState(50);
  const [energy, setEnergy] = useState(50);
  
  const [activeProfile, setActiveProfile] = useState(getBrewProfile(50, 50, 50));

  // Handle value changes
  useEffect(() => {
    const profile = getBrewProfile(roast, sweetness, energy);
    
    // Dispatch event to 3D Canvas globally
    window.dispatchEvent(new CustomEvent('brewChange', { detail: profile }));
    
    // GSAP Animate Background
    gsap.to(sectionRef.current, { backgroundColor: profile.bgColor, duration: 0.5, ease: 'power2.out' });
    
    // GSAP Crossfade text content if profile name changes
    if (profile.name !== activeProfile.name) {
      const tl = gsap.timeline();
      tl.to(textContentRef.current, { opacity: 0, y: 10, duration: 0.2, ease: 'power2.in' })
        .call(() => setActiveProfile(profile))
        .to(textContentRef.current, { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' });
    }
  }, [roast, sweetness, energy]);

  return (
    <section 
      ref={sectionRef} 
      id="build-brew"
      className="relative w-full min-h-[100svh] py-24 md:py-32 px-6 md:px-16 flex flex-col md:flex-row items-center pointer-events-auto"
    >
      {/* 3D Bean will be positioned absolutely in the center via Canvas, so we layout around it */}
      
      {/* Left Text Side */}
      <div className="w-full md:w-1/2 flex flex-col justify-center md:pr-12 z-10 min-h-[400px]">
        <h2 className="text-xs md:text-sm font-sans tracking-[0.4em] uppercase text-bean-accent mb-6 font-semibold">
          Build Your Brew
        </h2>
        
        <div ref={textContentRef}>
          <h3 className="text-5xl md:text-7xl font-display uppercase text-bean-white mb-6">
            {activeProfile.name}
          </h3>
          
          <div className="flex flex-col gap-6 mb-8 border-l border-bean-accent/50 pl-6 py-2">
            <div>
              <span className="text-[10px] font-sans tracking-[0.2em] text-bean-white/50 uppercase block mb-1">Roast</span>
              <span className="font-serif italic text-bean-cream text-xl">{activeProfile.roastText}</span>
            </div>
            
            <div>
              <span className="text-[10px] font-sans tracking-[0.2em] text-bean-white/50 uppercase block mb-1">Flavor Notes</span>
              <span className="font-serif text-bean-cream text-xl">{activeProfile.flavor}</span>
            </div>
            
            <div>
              <span className="text-[10px] font-sans tracking-[0.2em] text-bean-white/50 uppercase block mb-1">Energy Profile</span>
              <span className="font-sans font-bold text-bean-accent text-lg tracking-widest">{activeProfile.energyText}</span>
            </div>
          </div>
          
          <p className="font-sans text-bean-white/70 max-w-sm leading-relaxed">
            {activeProfile.description}
          </p>
        </div>
      </div>
      
      {/* Right Controls Side */}
      <div className="w-full md:w-1/2 flex flex-col justify-center gap-10 mt-16 md:mt-0 md:pl-24 z-10">
        
        {/* ROAST CONTROL */}
        <BespokeDial 
          label="Roast" 
          leftLabel="Light" 
          rightLabel="Dark" 
          value={roast} 
          onChange={setRoast} 
        />

        {/* SWEETNESS CONTROL */}
        <BespokeDial 
          label="Sweetness" 
          leftLabel="Low" 
          rightLabel="High" 
          value={sweetness} 
          onChange={setSweetness} 
        />

        {/* ENERGY CONTROL */}
        <BespokeDial 
          label="Energy" 
          leftLabel="Calm" 
          rightLabel="Intense" 
          value={energy} 
          onChange={setEnergy} 
        />

      </div>
    </section>
  );
}
