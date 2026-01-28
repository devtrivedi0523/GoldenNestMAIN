import React, { useState } from "react";

const Hero = () => {
  const [activeTab, setActiveTab] = useState("Rent");
  const tabs = ["Rent", "Buy", "Sell"];

  return (
    <section className="relative w-full h-[90vh]">
      {/* Background Image */}
      <img
        src="/christian-vasile-E_EDcwg8das-unsplash.jpg"
        alt="Property"
        className="w-full h-full object-cover"
      />

      {/* Overlay Box */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-xl p-8 w-[90%] max-w-3xl">
        {/* Top Text */}
        <p className="text-sm text-gray-500 mb-2">
          From as low as $10 per day with limited time offer discounts.
        </p>

        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-bold mb-6 font-serif">
          Your Property, Our Priority.
        </h2>

        {/* Tabs */}
        <div className="flex space-x-6 border-b border-gray-300 mb-4 font-serif">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="relative pb-2 text-gray-800 font-medium hover:text-black transition cursor-pointer"
            >
              {tab}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#F3B03E] rounded-full transition-all duration-300"></span>
              )}
            </button>
          ))}
        </div>

        {/* Input + Button */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between">
          <div className="mb-2 sm:mb-0">
            <p className="text-xs text-gray-500">Location</p>
            <p className="font-semibold text-lg">Manchester</p>
          </div>
          <button className="bg-[#F3B03E] hover:bg-[#F3B03E] text-black px-5 py-2 rounded-md transition font-medium cursor-pointer">
            Browse Properties
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
