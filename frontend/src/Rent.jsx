// src/pages/rent.jsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  FiMapPin,
  FiHome,
  FiBox,
  FiCalendar,
  FiSearch,
} from "react-icons/fi";
import { FaSterlingSign } from "react-icons/fa6";

import RentProperties from "./components/RentProperties";
import ContactUs from "./components/ContactUs";
import Footer from "./components/Footer";

const MIN_PRICE = 0;
const MAX_PRICE = 2000000;
const STEP = 10000;

const formatSliderPrice = (v) => {
  if (v >= 1000000) return `£${(v / 1000000).toFixed(v % 1000000 === 0 ? 0 : 1)}M`;
  if (v >= 1000) return `£${(v / 1000).toFixed(0)}k`;
  return `£${v}`;
};

/* ---------- Dual Range Slider ---------- */
const PriceSlider = ({ minVal, maxVal, onChange }) => {
  const rangeRef = useRef(null);

  const getPercent = (val) =>
    Math.round(((val - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100);

  useEffect(() => {
    if (rangeRef.current) {
      const minPercent = getPercent(minVal);
      const maxPercent = getPercent(maxVal);
      rangeRef.current.style.left = `${minPercent}%`;
      rangeRef.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [minVal, maxVal]);

  return (
    <div className="w-full px-1">
      <div className="flex justify-between text-xs font-semibold text-gray-800 mb-2">
        <span>{formatSliderPrice(minVal)}</span>
        <span>{formatSliderPrice(maxVal)}</span>
      </div>

      <div className="relative h-2">
        {/* Track background */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gray-200 rounded-full" />
        {/* Active range */}
        <div
          ref={rangeRef}
          className="absolute top-0 h-2 bg-[#F3B03E] rounded-full"
        />

        {/* Min thumb */}
        <input
          type="range"
          min={MIN_PRICE}
          max={MAX_PRICE}
          step={STEP}
          value={minVal}
          onChange={(e) => {
            const val = Math.min(Number(e.target.value), maxVal - STEP);
            onChange(val, maxVal);
          }}
          className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#F3B03E] [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[#F3B03E]"
          style={{ zIndex: minVal > MAX_PRICE - STEP * 10 ? 5 : 3 }}
        />

        {/* Max thumb */}
        <input
          type="range"
          min={MIN_PRICE}
          max={MAX_PRICE}
          step={STEP}
          value={maxVal}
          onChange={(e) => {
            const val = Math.max(Number(e.target.value), minVal + STEP);
            onChange(minVal, val);
          }}
          className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#F3B03E] [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[#F3B03E]"
          style={{ zIndex: 4 }}
        />
      </div>
    </div>
  );
};

/* ---------- Size helpers ---------- */
const mapSizeRange = (value) => {
  switch (value) {
    case "under-1000": return { minSize: 0, maxSize: 1000 };
    case "1000-2000":  return { minSize: 1000, maxSize: 2000 };
    case "2000-3000":  return { minSize: 2000, maxSize: 3000 };
    case "3000+":      return { minSize: 3000, maxSize: "" };
    default:           return { minSize: "", maxSize: "" };
  }
};

/* ---------- Main Component ---------- */
const Rent = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchText, setSearchText] = useState("");
  const [location, setLocation] = useState("");
  const [minPrice, setMinPrice] = useState(MIN_PRICE);
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE);
  const [propertyType, setPropertyType] = useState("");
  const [size, setSize] = useState("");
  const [buildYear, setBuildYear] = useState("");
  const [showPriceSlider, setShowPriceSlider] = useState(false);

  const [appliedFilters, setAppliedFilters] = useState({
    city: "", minPrice: "", maxPrice: "", q: "",
    type: "", yearBuilt: "", minSize: "", maxSize: "",
  });

  useEffect(() => {
    const q        = searchParams.get("q") || "";
    const city     = searchParams.get("city") || "";
    const minP     = searchParams.get("minPrice") || "";
    const maxP     = searchParams.get("maxPrice") || "";
    const type     = searchParams.get("type") || "";
    const yearBuilt= searchParams.get("yearBuilt") || "";
    const minSize  = searchParams.get("minSize") || "";
    const maxSize  = searchParams.get("maxSize") || "";

    setSearchText(q);
    setLocation(city);
    setMinPrice(minP ? Number(minP) : MIN_PRICE);
    setMaxPrice(maxP ? Number(maxP) : MAX_PRICE);
    setPropertyType(type);
    setBuildYear(yearBuilt);

    if (minSize || maxSize) {
      if (minSize && +minSize >= 3000) setSize("3000+");
      else if (minSize && +minSize >= 2000) setSize("2000-3000");
      else if (minSize && +minSize >= 1000) setSize("1000-2000");
      else if (minSize !== "") setSize("under-1000");
      else setSize("");
    } else setSize("");

    setAppliedFilters({ city, minPrice: minP, maxPrice: maxP, q, type, yearBuilt, minSize, maxSize });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString()]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const { minSize, maxSize } = mapSizeRange(size);
    const q    = searchText.trim();
    const city = location.trim();
    const type = propertyType.trim();
    const yearBuilt = buildYear.trim();

    const params = {};
    if (q) params.q = q;
    if (city) params.city = city;
    if (minPrice > MIN_PRICE) params.minPrice = String(minPrice);
    if (maxPrice < MAX_PRICE) params.maxPrice = String(maxPrice);
    if (type) params.type = type;
    if (yearBuilt) params.yearBuilt = yearBuilt;
    if (minSize !== "") params.minSize = String(minSize);
    if (maxSize !== "") params.maxSize = String(maxSize);

    setSearchParams(params);
    setAppliedFilters({
      city: params.city || "", minPrice: params.minPrice || "",
      maxPrice: params.maxPrice || "", q: params.q || "",
      type: params.type || "", yearBuilt: params.yearBuilt || "",
      minSize: params.minSize || "", maxSize: params.maxSize || "",
    });

    const queryString = new URLSearchParams(params).toString();
    navigate(`/rent${queryString ? `?${queryString}` : ""}`);
    setShowPriceSlider(false);
  };

  const priceLabel =
    minPrice === MIN_PRICE && maxPrice === MAX_PRICE
      ? "Pricing Range"
      : `${formatSliderPrice(minPrice)} – ${formatSliderPrice(maxPrice)}`;

  return (
    <>
      <div className="bg-gray-50 px-4 py-10 flex flex-col items-center">
        {/* Heading */}
        <div className="max-w-full mb-10 px-20">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Rent Your Dream Property
          </h1>
          <p className="text-gray-700">
            Welcome to Golden Nest, where your dream property awaits in every corner of our
            beautiful world. Explore our curated selection of properties, each offering a unique
            story and a chance to redefine your life.
          </p>
        </div>

        {/* Search + Filters */}
        <form onSubmit={handleSubmit} className="w-full max-w-5xl">
          {/* Search bar */}
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
              className="flex items-center gap-2 bg-[#F3B03E] hover:bg-yellow-600 text-black font-semibold px-6 py-2 rounded-md"
            >
              <FiSearch />
              Find Property
            </button>
          </div>

          {/* Filter bar */}
          <div className="bg-[#F3B03E] rounded-b-lg px-4 py-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">

            {/* Location */}
            <div className="flex items-center bg-white rounded-md px-3 py-2">
              <FiMapPin className="mr-2 shrink-0" />
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

            {/* Property Type */}
            <div className="flex items-center bg-white rounded-md px-3 py-2">
              <FiHome className="mr-2 shrink-0" />
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

            {/* Price Slider trigger */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowPriceSlider((v) => !v)}
                className="w-full flex items-center bg-white rounded-md px-3 py-2 font-bold text-sm text-left"
              >
                <FaSterlingSign className="mr-2 shrink-0" />
                <span className="truncate">{priceLabel}</span>
              </button>

              {showPriceSlider && (
                <div className="absolute z-20 top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-xl border p-4">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                    Price Range
                  </div>
                  <PriceSlider
                    minVal={minPrice}
                    maxVal={maxPrice}
                    onChange={(min, max) => { setMinPrice(min); setMaxPrice(max); }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPriceSlider(false)}
                    className="mt-4 w-full bg-[#F3B03E] hover:bg-yellow-500 text-black text-xs font-semibold py-1.5 rounded-lg"
                  >
                    Apply
                  </button>
                </div>
              )}
            </div>

            {/* Property Size */}
            <div className="flex items-center bg-white rounded-md px-3 py-2">
              <FiBox className="mr-2 shrink-0" />
              <select
                className="w-full bg-white outline-none font-bold"
                value={size}
                onChange={(e) => setSize(e.target.value)}
              >
                <option value="">Property Size</option>
                <option value="under-1000">Under 1,000 sq ft</option>
                <option value="1000-2000">1,000 – 2,000 sq ft</option>
                <option value="2000-3000">2,000 – 3,000 sq ft</option>
                <option value="3000+">3,000+ sq ft</option>
              </select>
            </div>

            {/* Build Year */}
            <div className="flex items-center bg-white rounded-md px-3 py-2">
              <FiCalendar className="mr-2 shrink-0" />
              <select
                className="w-full bg-white outline-none font-bold"
                value={buildYear}
                onChange={(e) => setBuildYear(e.target.value)}
              >
                <option value="">Build Year</option>
                {Array.from({ length: 60 }).map((_, i) => {
                  const year = new Date().getFullYear() - i;
                  return <option key={year} value={String(year)}>{year}</option>;
                })}
              </select>
            </div>
          </div>
        </form>
      </div>

      <RentProperties filters={appliedFilters} />
      <ContactUs />
      <Footer />
    </>
  );
};

export default Rent;