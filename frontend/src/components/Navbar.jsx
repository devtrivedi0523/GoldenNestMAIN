import React from 'react';
import { Link } from 'react-router-dom';
import { RiAccountCircleFill } from 'react-icons/ri';
import AccountMenu from "./AccountMenu";
import { isLoggedIn } from "../auth";

const Navbar = () => {
    return (
        <nav className="w-full bg-white shadow-md px-6 py-3">
            <div className="max-w-7xl mx-auto relative flex items-center justify-between">

                {/* Left: Logo */}
                <a href="/">
                    <img src="/1-2 1.png" alt="Golden Nest" />
                </a>

                {/* Center: Nav links — absolutely centered so they're always in the middle */}
                <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 gap-6 text-black font-medium items-center">
                    <a href="/" className="px-4 py-2 hover:bg-orange-200 hover:rounded-full hover:font-bold transition-all duration-300">Home</a>
                    <Link to="/rent" className="px-4 py-2 hover:bg-orange-200 hover:rounded-full hover:font-bold transition-all duration-300">Rent</Link>
                    <Link to="/buy" className="px-4 py-2 hover:bg-orange-200 hover:rounded-full hover:font-bold transition-all duration-300">Buy</Link>
                    <Link to="/sell" className="px-4 py-2 hover:bg-orange-200 hover:rounded-full hover:font-bold transition-all duration-300">Sell</Link>
                    <Link to="/aboutus" className="px-4 py-2 hover:bg-orange-200 hover:rounded-full hover:font-bold transition-all duration-300">About Us</Link>
                </div>

                {/* Right: Contact Us + Login / Account */}
                <div className="flex items-center gap-3 ml-auto">
                    <Link
                        to="/contact"
                        className="bg-[#F3B03E] text-black px-4 py-2 rounded hover:bg-[#e69b1a] transition"
                    >
                        Contact Us
                    </Link>

                    {isLoggedIn() ? (
                        <AccountMenu />
                    ) : (
                        <Link
                            to="/signin"
                            title="Log In"
                            className="flex items-center gap-1.5 px-3 py-2 rounded-full border border-gray-300 bg-[#F3B03E] hover:bg-[#e69b1a] hover:border-orange-300 transition-all duration-300 text-sm font-medium"
                        >
                            <RiAccountCircleFill className="text-lg" />
                            <span>Log In</span>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;