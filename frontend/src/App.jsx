import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Stats from './components/Stats';
import Partners from './components/Partners';
import Services from './components/Services';
import Events from './components/Events';
import News from './components/News';
import Location from './components/Location';
import AdminPanel from './components/AdminPanel';
import Footer from './components/Footer';

// App principal - Ponto de montagem de todas as secções da landing page
function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Stats />
        <Partners />
        <Services />
        <Events />
        <News />
        <Location />
        <AdminPanel />
      </main>
      <Footer />
    </>
  );
}

export default App;
