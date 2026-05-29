import React from 'react';
import Hero from '../components/Hero';
import About from '../components/About';
import Stats from '../components/Stats';
import Partners from '../components/Partners';
import Services from '../components/Services';
import Events from '../components/Events';
import News from '../components/News';
import Location from '../components/Location';

function Home() {
  return (
    <>
      <Hero />
      <About />
      <Stats />
      <Partners />
      <Services />
      <Events />
      <News />
      <Location />
    </>
  );
}

export default Home;
