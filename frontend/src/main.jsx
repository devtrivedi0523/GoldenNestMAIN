import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';

import App from './App.jsx';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import Properties from './components/Properties.jsx';
import FeaturedProperties from './components/Properties.jsx';
import ContactUs from './components/ContactUs.jsx';
import Footer from './components/Footer.jsx';
import Contact from './Contact.jsx';
import AboutUs from './AboutUs.jsx';
import Sell from './Sell.jsx';
import Buy from './Buy.jsx';
import BuyProperties from './components/BuyProperties.jsx';
import Rent from './Rent.jsx';
import UploadProperty from './components/UploadProperty.jsx';
import PropertyDetails from './components/PropertyDetails.jsx';
import AdminDashboard from './Admin.jsx';
import MyListings from './MyListings.jsx';
import UploadSuccess from './components/UploadSuccess.jsx';
import AdvancedProperty from './components/AdvancedProperty.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={
            <>
              <Hero />
              <FeaturedProperties />
              <ContactUs />
              <Footer />

            </>
          }
        />
        <Route path="/contact" element={<Contact />} />
        <Route path='/aboutus' element={<AboutUs />} />
        <Route path='/sell' element={<Sell />} />
        <Route path="/sell/upload" element={<UploadProperty />} />
        <Route path="/sell/upload/:id/advanced" element={<AdvancedProperty />} />
        <Route path="/sell/success" element={<UploadSuccess />} />
        <Route path='/buy' element={<Buy />} />
        <Route path='/rent' element={<Rent />} />
        <Route path="buy/properties/:id" element={<PropertyDetails />} />
        <Route path="/rent/properties/:id" element={<PropertyDetails />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/account/listings" element={<MyListings />} />
        




      </Routes>

    </Router>
  </StrictMode>
);
