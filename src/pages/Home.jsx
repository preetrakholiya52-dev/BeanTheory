import React from 'react';
import Hero from '../components/Hero/Hero';
import BrandStatement from '../components/BrandStatement/BrandStatement';
import OriginJourney from '../components/OriginJourney/OriginJourney';
import CoffeeCollection from '../components/CoffeeCollection/CoffeeCollection';
import ProductExperience from '../components/ProductExperience/ProductExperience';
import ParticleExperience from '../components/ParticleExperience/ParticleExperience';
import Lifestyle from '../components/Lifestyle/Lifestyle';
import EnergySelector from '../components/EnergySelector/EnergySelector';
import FinalCTA from '../components/FinalCTA/FinalCTA';
import Footer from '../components/Footer/Footer';

export default function Home({ introFinished }) {
  return (
    <main className="relative w-full z-10 flex flex-col items-center">
      <Hero introFinished={introFinished} />
      <BrandStatement />
      <OriginJourney />
      <CoffeeCollection />
      <ProductExperience />
      <ParticleExperience />
      <Lifestyle />
      <EnergySelector />
      <FinalCTA />
      <Footer />
    </main>
  );
}
