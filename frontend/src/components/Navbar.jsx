import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { RiAccountCircleFill } from 'react-icons/ri';
import AccountMenu from "./AccountMenu";
import { isLoggedIn } from "../auth";

const navLinkClass = ({ isActive }) =>
    "px-4 py-2 rounded-full font-medium transition-all duration-300 " +
    (isActive
        ? "bg-orange-200 font-bold"
        : "hover:bg-orange-200 hover:font-bold");

const Navbar = () => {
    return (
        <nav className="w-full bg-white shadow-md px-6 py-3">
            <div className="max-w-7xl mx-auto relative flex items-center justify-between">

                {/* Left: Logo */}
                <a href="/">
                    <img src="/1-2 1.png" alt="Golden Nest" />
                </a>

                {/* Center: Nav links */}
                <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 gap-6 text-black items-center">
                    <NavLink to="/" end className={navLinkClass}>Home</NavLink>
                    <NavLink to="/rent" className={navLinkClass}>Rent</NavLink>
                    <NavLink to="/buy" className={navLinkClass}>Buy</NavLink>
                    <NavLink to="/sell" className={navLinkClass}>Sell</NavLink>
                    <NavLink to="/aboutus" className={navLinkClass}>About Us</NavLink>
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