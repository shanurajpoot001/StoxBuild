import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './responsive.css';
import './animations.css';
import { BrowserRouter, useLocation, Routes, Route } from "react-router-dom";
import '@fortawesome/fontawesome-free/css/all.min.css';

import HomePage from "./landing_page/home/HomePage";
import Signup from "./landing_page/signup/Signup";
import AboutPage from "./landing_page/about/AboutPage";
import ProductPage from "./landing_page/products/Productspage";
import PricingPage from "./landing_page/pricing/PricingPage";
import SupportPage from "./landing_page/support/SupportPage";
import Login from "./landing_page/signup/Login";
import NotFound from "./landing_page/NotFound";
import AiPredictionPage from "./landing_page/ai/AiPredictionPage";
import DocumentationPage from "./landing_page/documentation/DocumentationPage";
import Navbar from "./landing_page/Navbar";
import Footer from "./landing_page/Footer";
import ScrollToTop from "./landing_page/ScrollToTop";
import PageLoader from "./components/ui/PageLoader";
import ScrollProgress from "./components/ui/ScrollProgress";
import BackToTop from "./components/ui/BackToTop";
import FloatingAiBot from "./components/FloatingAiBot";
import { ToastProvider } from "./components/ui/Toast";

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <div key={location.pathname} className="page-transition">
      <Routes location={location}>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/product" element={<ProductPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/support" element={<SupportPage />} />
        <Route path="/ai-prediction" element={<AiPredictionPage />} />
        <Route path="/documentation" element={<DocumentationPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

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
    <ToastProvider>
      <PageLoader />
      <ScrollProgress />
      <Navbar />
      <ScrollToTop />
      <AnimatedRoutes />
      <Footer />
      <FloatingAiBot />
      <BackToTop />
    </ToastProvider>
  </BrowserRouter>
);
