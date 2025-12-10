import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-100 px-6 md:px-20 py-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-600">
        
        {/* Copyright */}
        <div>&copy; {new Date().getFullYear()} Golden Nest. All rights reserved.</div>

        {/* Social Icons */}
        <div className="flex space-x-5 text-gray-600">
          <a href="#" aria-label="Facebook" className="hover:text-[#F3B03E] text-lg">
            <FaFacebookF />
          </a>
          <a href="#" aria-label="Twitter" className="hover:text-[#F3B03E] text-lg">
            <FaTwitter />
          </a>
          <a href="#" aria-label="Instagram" className="hover:text-[#F3B03E] text-lg">
            <FaInstagram />
          </a>
          <a href="#" aria-label="LinkedIn" className="hover:text-[#F3B03E] text-lg">
            <FaLinkedinIn />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
