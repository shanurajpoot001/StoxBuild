import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "./landing_page/home/HomePage";
import Signup from "./landing_page/signup/Signup";
import AboutPage from "./landing_page/about/AboutPage";
import ProductPage from "./landing_page/products/Productspage";
import PricingPage from "./landing_page/pricing/PricingPage";
import SupportPage from "./landing_page/support/SupportPage";
import Login from "./landing_page/signup/Login";

import NotFound from "./landing_page/NotFound";
import Navbar from "./landing_page/Navbar";
import Footer from "./landing_page/Footer";


import ScrollToTop from "./landing_page/ScrollToTop";

import '@fortawesome/fontawesome-free/css/all.min.css';

// Redirect handler for static hosting
(function(l) {
    if (l.search[1] === '/') {
        var decoded = l.search.slice(1).split('&').map(function(s) {
            return s.replace(/~and~/g, '&')
        }).join('?');
        window.history.replaceState(null, null,
            l.pathname.slice(0, -1) + decoded + l.hash
        );
    }
}(window.location))

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

   <BrowserRouter>
    <Navbar />
      <ScrollToTop /> {/* ✅ Ye common hai, sab pages pe chalega */}
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/product" element={<ProductPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/support" element={<SupportPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
    <Footer />
  </BrowserRouter>
  
);

