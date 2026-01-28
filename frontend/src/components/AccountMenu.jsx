import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isLoggedIn, clearAccessToken } from "../auth";
import { fetchCurrentUser } from "../auth";

const AccountMenu = () => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (isLoggedIn()) {
            fetchCurrentUser().then((u) => {
                console.log("ME endpoint response:", u);
                setUser(u);
            });
        }
    }, []);


    if (!isLoggedIn()) return null;

    const handleLogout = () => {
        clearAccessToken();
        navigate("/");
    };

    const displayName = user?.name || "User";

    return (
        <div className="relative">
            <button
                onClick={() => setOpen((o) => !o)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full border bg-white shadow-sm hover:bg-gray-50"
            >
                <span className="h-7 w-7 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center text-xs font-semibold text-black">
                    {displayName.charAt(0).toUpperCase()}
                </span>

                <div className="flex flex-col leading-tight">
                    {/* <span className="text-[10px] uppercase tracking-wide text-gray-500">
                        Account
                    </span> */}
                    {/* <span className="text-xs font-medium">
                        {displayName}
                    </span> */}
                </div>

                <svg
                    className={"h-3 w-3 text-gray-500 transition " + (open ? "rotate-180" : "")}
                    viewBox="0 0 20 20"
                >
                    <path d="M5 7l5 6 5-6" stroke="currentColor" fill="none" />
                </svg>
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-56 bg-white border rounded-xl shadow-xl z-50 overflow-hidden">
                    <div className="px-4 py-3 border-b flex items-center gap-2">
                        <span className="h-8 w-8 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center text-xs font-semibold text-black">
                            {displayName.charAt(0).toUpperCase()}
                        </span>
                        <div>
                            <div className="text-xs text-gray-500">Signed in as</div>
                            <div className="text-sm font-medium">{displayName}</div>
                        </div>
                    </div>

                    <button
                        onClick={() => { setOpen(false); navigate("/account/listings"); }}
                        className="w-full text-left px-4 py-2.5 hover:bg-gray-50"
                    >
                        My listings
                    </button>

                    <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2.5 hover:bg-red-50 text-red-600 border-t"
                    >
                        Log out
                    </button>
                </div>
            )}
        </div>
    );
};

export default AccountMenu;
