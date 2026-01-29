// src/pages/buy.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  FiMapPin,
  FiHome,
  FiBox,
  FiCalendar,
  FiSearch,
} from "react-icons/fi";
import { FaSterlingSign } from "react-icons/fa6";

import BuyProperties from "./components/BuyProperties";
import ContactUs from "./components/ContactUs";
import Footer from "./components/Footer";

/* helpers to convert dropdown value -> numeric ranges */
const mapPriceRange = (value) => {
  switch (value) {
    case "100-250":
      return { minPrice: 100000, maxPrice: 250000 };
    case "250-500":
      return { minPrice: 250000, maxPrice: 500000 };
    case "500-1000":
      return { minPrice: 500000, maxPrice: 1000000 };
    case "1000+":
      return { minPrice: 1000000, maxPrice: "" };
    default:
      return { minPrice: "", maxPrice: "" };
  }
};

const mapSizeRange = (value) => {
  switch (value) {
    case "under-1000":
      return { minSize: 0, maxSize: 1000 };
    case "1000-2000":
      return { minSize: 1000, maxSize: 2000 };
    case "2000-3000":
      return { minSize: 2000, maxSize: 3000 };
    case "3000+":
      return { minSize: 3000, maxSize: "" };
    default:
      return { minSize: "", maxSize: "" };
  }
};

const Buy = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // form state (these are the UI controls)
  const [searchText, setSearchText] = useState("");
  const [location, setLocation] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [size, setSize] = useState("");
  const [buildYear, setBuildYear] = useState("");

  // canonical applied filters object (passed into BuyProperties)
  const [appliedFilters, setAppliedFilters] = useState({
    city: "",
    minPrice: "",
    maxPrice: "",
    q: "",
    type: "",
    yearBuilt: "",
    minSize: "",
    maxSize: "",
  });

  // sync UI controls from URL params (runs on mount and when searchParams change)
  useEffect(() => {
    const q = searchParams.get("q") || "";
    const city = searchParams.get("city") || "";
    const minPrice = searchParams.get("minPrice") || "";
    const maxPrice = searchParams.get("maxPrice") || "";
    const type = searchParams.get("type") || "";
    const yearBuilt = searchParams.get("yearBuilt") || "";
    const minSize = searchParams.get("minSize") || "";
    const maxSize = searchParams.get("maxSize") || "";

    // set form values from params (these keep form in sync with URL)
    setSearchText(q);
    setLocation(city);

    // Try to map numeric ranges back to dropdown keys where possible (best-effort)
    // Price
    if (minPrice || maxPrice) {
      if (minPrice && +minPrice >= 1000000) setPriceRange("1000+");
      else if (minPrice && +minPrice >= 500000) setPriceRange("500-1000");
      else if (minPrice && +minPrice >= 250000) setPriceRange("250-500");
      else if (minPrice && +minPrice >= 100000) setPriceRange("100-250");
      else setPriceRange("");
    } else {
      setPriceRange("");
    }

    // Size
    if (minSize || maxSize) {
      if (minSize && +minSize >= 3000) setSize("3000+");
      else if (minSize && +minSize >= 2000) setSize("2000-3000");
      else if (minSize && +minSize >= 1000) setSize("1000-2000");
      else if (minSize && +minSize >= 0) setSize("under-1000");
      else setSize("");
    } else {
      setSize("");
    }

    setPropertyType(type || "");
    setBuildYear(yearBuilt || "");

    // set appliedFilters canonical object
    setAppliedFilters({
      city,
      minPrice,
      maxPrice,
      q,
      type,
      yearBuilt,
      minSize,
      maxSize,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString()]); // re-run any time URL query changes

  // When user submits the form, update URL params (so page is bookmarkable & reloadable)
  const handleSubmit = (e) => {
    e.preventDefault();

    // compute numeric ranges from the dropdown keys
    const { minPrice, maxPrice } = mapPriceRange(priceRange);
    const { minSize, maxSize } = mapSizeRange(size);

    // canonical query values
    const q = (searchText || "").trim();
    const city = (location || "").trim();
    const type = (propertyType || "").trim();
    const yearBuilt = (buildYear || "").trim();

    // build params object
    const params = {};
    if (q) params.q = q;
    if (city) params.city = city;
    if (minPrice !== "") params.minPrice = String(minPrice);
    if (maxPrice !== "") params.maxPrice = String(maxPrice);
    if (type) params.type = type;
    if (yearBuilt) params.yearBuilt = yearBuilt;
    if (minSize !== "") params.minSize = String(minSize);
    if (maxSize !== "") params.maxSize = String(maxSize);

    // update the browser URL (push state)
    setSearchParams(params);

    // update local appliedFilters too (will be overwritten by useEffect above shortly)
    setAppliedFilters({
      city: params.city || "",
      minPrice: params.minPrice || "",
      maxPrice: params.maxPrice || "",
      q: params.q || "",
      type: params.type || "",
      yearBuilt: params.yearBuilt || "",
      minSize: params.minSize || "",
      maxSize: params.maxSize || "",
    });

    // navigate to /buy with same params (ensures route is correct if you use nested routes)
    const queryString = new URLSearchParams(params).toString();
    navigate(`/buy${queryString ? `?${queryString}` : ""}`);
  };

  return (
    <>
      <div className="bg-gray-50 px-4 py-10 flex flex-col items-center">
        {/* Heading */}
        <div className="max-w-full mb-10 px-20">
          <h1 className="text-3xl md:text-4xl font-bold font-serif text-gray-900 mb-4">
            Buy Your Dream Property
          </h1>
          <p className="text-gray-700">
            Welcome to Golden Nest, where your dream property awaits in every corner
            of our beautiful world. Explore our curated selection of properties, each
            offering a unique story and a chance to redefine your life.
          </p>
        </div>

        {/* Search Box / Filters */}
        <form onSubmit={handleSubmit} className="w-full max-w-5xl">
          <div className="bg-white border rounded-t-lg px-4 py-4 flex flex-col md:flex-row items-center md:justify-between">
            <input
              type="text"
              placeholder="Search For A Property"
              className="w-full md:flex-1 px-4 py-2 mb-4 md:mb-0 md:mr-4 rounded-md outline-none"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <button
              type="submit"
              className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-6 py-2 rounded-md"
            >
              <FiSearch />
              Find Property
            </button>
          </div>

          <div className="bg-yellow-400 rounded-b-lg px-4 py-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {/* Location -> city */}
            <div className="flex items-center bg-white rounded-md px-3 py-2">
              <FiMapPin className="mr-2 font-bold" />
              <select
                className="w-full bg-white outline-none font-bold"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              >
                <option value="">Location</option>
                <option value="Downtown">Downtown</option>
                <option value="Suburbs">Suburbs</option>
                <option value="Beachfront">Beachfront</option>
                <option value="Hillside">Hillside</option>
              </select>
            </div>

            {/* Property Type -> type */}
            <div className="flex items-center bg-white rounded-md px-3 py-2">
              <FiHome className="mr-2" />
              <select
                className="w-full bg-white outline-none font-bold"
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
              >
                <option value="">Property Type</option>
                <option value="Apartment">Apartment</option>
                <option value="Villa">Villa</option>
              </select>
            </div>

            {/* Pricing Range */}
            <div className="flex items-center bg-white rounded-md px-3 py-2">
              <FaSterlingSign className="mr-2" />
              <select
                className="w-full bg-white outline-none font-bold"
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
              >
                <option value="">Pricing Range</option>
                <option value="100-250">£100k - £250k</option>
                <option value="250-500">£250k - £500k</option>
                <option value="500-1000">£500k - £1M</option>
                <option value="1000+">£1M+</option>
              </select>
            </div>

            {/* Property Size */}
            <div className="flex items-center bg-white rounded-md px-3 py-2">
              <FiBox className="mr-2" />
              <select
                className="w-full bg-white outline-none font-bold"
                value={size}
                onChange={(e) => setSize(e.target.value)}
              >
                <option value="">Property Size</option>
                <option value="under-1000">Under 1,000 sq ft</option>
                <option value="1000-2000">1,000 - 2,000 sq ft</option>
                <option value="2000-3000">2,000 - 3,000 sq ft</option>
                <option value="3000+">3,000+ sq ft</option>
              </select>
            </div>

            {/* Build Year */}
            <div className="flex items-center bg-white rounded-md px-3 py-2">
              <FiCalendar className="mr-2" />
              <select
                className="w-full bg-white outline-none font-bold"
                value={buildYear}
                onChange={(e) => setBuildYear(e.target.value)}
              >
                <option value="">Build Year</option>
                {Array.from({ length: 60 }).map((_, i) => {
                  const year = new Date().getFullYear() - i;
                  return (
                    <option key={year} value={String(year)}>
                      {year}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
        </form>
      </div>

      {/* Results: pass appliedFilters to child component */}
      <BuyProperties filters={appliedFilters} />

      <ContactUs />
      <Footer />
    </>
  );
};

export default Buy;
