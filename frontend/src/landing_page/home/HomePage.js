import React from 'react'
import Hero from './Hero'
import LiveMarketStrip from './LiveMarketStrip'
import Awards from './Awards'
import Stats from './Stats'
import Pricing from './Pricing'
import Education from './Education'
import OpenAccount from '../OpenAccount'


function Home() {
    return ( 
    <>
        <Hero />
        <LiveMarketStrip />
        <Awards />
        <Stats />
        <Pricing />
        <Education />
        <OpenAccount />
        
    </>
     );
}

export default Home;
