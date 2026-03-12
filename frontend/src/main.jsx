import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
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
import TermsAndConditions from './components/TermsandConditions.jsx';
import AdminAreas from './components/AdminAreas.jsx';
import LoginChoice from './LoginPages.jsx';
import AgentDashboard from './Agent.jsx';
import CompanyDashboard from './Company.jsx';
import PropertyEnquiry from './components/PropertyEnquiry.jsx';
import SigninPage from './SignIn.jsx';

const NO_NAVBAR_ROUTES = ['/login', '/admin', '/agent', '/company'];

function Layout() {
  const location = useLocation();
  const hideNavbar = NO_NAVBAR_ROUTES.some((path) =>
    location.pathname === path || location.pathname.startsWith(path + '/')
  );

  return (
    <>
      {!hideNavbar && <Navbar />}

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
        <Route path="/buy/properties/:id/enquire" element={<PropertyEnquiry />} />
        <Route path="/rent/properties/:id" element={<PropertyDetails />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/account/listings" element={<MyListings />} />
        <Route path='/terms' element={<TermsAndConditions />} />
        <Route path="/admin/areas" element={<AdminAreas />} />
        <Route path="/login" element={<LoginChoice />} />
        <Route path="/agent" element={<AgentDashboard />} />
        <Route path="/company" element={<CompanyDashboard />} />
        <Route path="/signin" element={<SigninPage />} />
      </Routes>
    </>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Layout />
    </Router>
  </StrictMode>
);