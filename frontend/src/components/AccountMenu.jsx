import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isLoggedIn, clearAccessToken, fetchCurrentUser } from "../auth";
import { FiHeart, FiMessageSquare, FiList, FiSettings, FiLogOut } from "react-icons/fi";

const AccountMenu = () => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [user, setUser] = useState(null);
    const menuRef = useRef(null);

    useEffect(() => {
        if (isLoggedIn()) {
            fetchCurrentUser().then((u) => setUser(u));
        }
    }, []);

    // Close on outside click
    useEffect(() => {
        const handler = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    if (!isLoggedIn()) return null;

    const handleLogout = () => {
        clearAccessToken();
        setOpen(false);
        navigate("/", { replace: true });
    };

    const displayName = user?.name || "User";
    const initials = displayName
        .split(" ")
        .map((p) => p[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    const menuItems = [
        {
            icon: FiHeart,
            label: "Saved properties",
            onClick: () => { setOpen(false); navigate("/saved"); },
        },
        {
            icon: FiMessageSquare,
            label: "Enquiries",
            onClick: () => { setOpen(false); navigate("/enquiries"); },
        },
        {
            icon: FiList,
            label: "My listings",
            onClick: () => { setOpen(false); navigate("/account/listings"); },
        },
    ];

    return (
        <div className="relative" ref={menuRef}>
            {/* Trigger button */}
            <button
                onClick={() => setOpen((o) => !o)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border bg-white shadow-sm hover:bg-gray-50 transition"
            >
                <span className="h-7 w-7 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center text-xs font-bold text-black">
                    {initials}
                </span>
                <svg
                    className={"h-3 w-3 text-gray-500 transition-transform " + (open ? "rotate-180" : "")}
                    viewBox="0 0 20 20"
                >
                    <path d="M5 7l5 6 5-6" stroke="currentColor" fill="none" strokeWidth="1.5" />
                </svg>
            </button>

            {/* Dropdown */}
            {open && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-2xl shadow-2xl z-50 overflow-hidden">

                    {/* Header */}
                    <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
                        <span className="h-10 w-10 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center text-sm font-bold text-black shrink-0">
                            {initials}
                        </span>
                        <div>
                            <div className="text-sm font-semibold text-gray-900">{displayName}</div>
                            <button
                                onClick={() => { setOpen(false); navigate("/account/listings"); }}
                                className="text-xs text-[#F3B03E] hover:underline font-medium mt-0.5"
                            >
                                View My Golden Nest
                            </button>
                        </div>
                    </div>

                    {/* Menu items */}
                    <div className="py-2">
                        {menuItems.map(({ icon: Icon, label, onClick }) => (
                            <button
                                key={label}
                                onClick={onClick}
                                className="w-full flex items-center gap-3 px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 transition text-left"
                            >
                                <Icon className="text-gray-500 text-base shrink-0" />
                                {label}
                            </button>
                        ))}
                    </div>

                    {/* Sign out */}
                    <div className="border-t border-gray-100 py-2">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 transition text-left"
                        >
                            <FiLogOut className="text-gray-500 text-base shrink-0" />
                            Sign out
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AccountMenu;