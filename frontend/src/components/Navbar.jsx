import React from 'react';
import { FaUserShield } from 'react-icons/fa';
import { Link } from 'react-router-dom'; // ✅ Correct import
import AccountMenu from "./AccountMenu";
import { isLoggedIn } from "../auth";

const Navbar = () => {
    return (
        <nav className="w-full bg-white shadow-md px-6 py-3">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                {/* Left: Logo */}
                <img src="/1-2 1.png" alt="" />

                {/* Center: Navigation Tabs */}
                <div className="hidden md:flex space-x-3 space-y-3 text-gray-600 font-medium">
                    <a href="/" className="px-4 py-2 hover:bg-orange-200 hover:rounded-full transition-all duration-300">Home</a>

                    <Link
                        to="/buy"
                        className='px-4 py-2 hover:bg-orange-200 hover:rounded-full transition-all duration-300'> Buy
                    </Link>

                    <Link
                        to="/sell"
                        className='px-4 py-2 hover:bg-orange-200 hover:rounded-full transition-all duration-300'> Sell
                    </Link>

                    <Link
                        to="/rent"
                        className='px-4 py-2 hover:bg-orange-200 hover:rounded-full transition-all duration-300'> Rent
                    </Link>

                    <Link
                        to="/aboutus"
                        className='px-4 py-2 hover:bg-orange-200 hover:rounded-full transition-all duration-300'> About Us
                    </Link>

                    <div className="flex items-center gap-4">
                        {/* if not logged in, show your existing Login/Register buttons */}
                        {!isLoggedIn() && (
                            <>
                                {/* existing login / signup buttons here */}
                            </>
                        )}

                        {/* if logged in, show the account menu */}
                        {isLoggedIn() && <AccountMenu />}
                    </div>

                </div>

                {/* Right: Contact Us Button */}
                <div className="flex items-center space-x-4 justify-end">
                    <Link
                        to="/contact"
                        className="bg-[#F3B03E] text-white px-4 py-2 rounded hover:bg-[#e69b1a] transition"
                    >
                        Contact Us
                    </Link>

                    {/* <Link
                        to="/admin"
                        className="p-2 text-gray-600 hover:bg-orange-200 hover:rounded-full transition-all duration-300 text-xl"
                        title="Admin Panel"
                    >
                        <FaUserShield />
                    </Link> */}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
