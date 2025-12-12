// --- src/components/RentProperties.jsx ---
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBed, FaBath, FaHome, FaBuilding, FaTree } from "react-icons/fa";

const API_BASE = import.meta.env.VITE_API_URL || "https://goldennestmain-production.up.railway.app";

const formatMonthly = (n, currency = "£") =>
  typeof n === "number"
    ? `${currency}${n.toLocaleString()}/month`
    : "Price on application";

const tagIcon = (label) => {
  const l = label.toLowerCase();
  if (l.includes("bed")) return FaBed;
  if (l.includes("bath")) return FaBath;
  if (l.includes("apartment")) return FaBuilding;
  if (l.includes("cottage")) return FaTree;
  return FaHome;
};

const tagsFromCard = (p) => {
  const out = [];
  if (p.bedrooms != null) out.push(`${p.bedrooms}-Bedroom`);
  if (p.bathrooms != null) out.push(`${p.bathrooms}-Bathroom`);
  if (p.type) out.push(p.type);
  return out;
};

const RentProperties = ({ filters = {} }) => {
  const navigate = useNavigate();
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  // normalise all filters (so deps are stable primitives)
  const city = filters.city || "";
  const minPrice = filters.minPrice || "";
  const maxPrice = filters.maxPrice || "";
  const q = filters.q || "";
  const type = filters.type || "";
  const yearBuilt = filters.yearBuilt || "";
  const minSize = filters.minSize || "";
  const maxSize = filters.maxSize || "";

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        const params = new URLSearchParams();
        params.set("page", "0");
        params.set("size", "24");

        if (city) params.set("city", city);
        if (minPrice) params.set("minPrice", minPrice);
        if (maxPrice) params.set("maxPrice", maxPrice);
        if (q) params.set("q", q);
        if (type) params.set("type", type);
        if (yearBuilt) params.set("yearBuilt", yearBuilt);
        if (minSize) params.set("minSize", minSize);
        if (maxSize) params.set("maxSize", maxSize);

        const res = await fetch(`${API_BASE}/api/properties?` + params.toString());
        if (!res.ok) throw new Error("Failed to load rental properties");
        const data = await res.json(); // Page<PropertyCardDto>
        setCards(data.content || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [city, minPrice, maxPrice, q, type, yearBuilt, minSize, maxSize]);

  return (
    <section className="py-16 bg-white px-6 md:px-20">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl md:text-4xl font-serif font-semibold">
            Discover Your Perfect Rental Home
          </h2>
          <p className="text-gray-600 mt-2 max-w-xl">
            Our portfolio of rental-style properties offers something for every
            lifestyle and budget. Find your next home with Golden Nest Rentals.
          </p>
        </div>
        <button
          className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-md font-medium mt-4 md:mt-0"
          onClick={() => navigate("/rent")}
        >
          View All Rentals
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading rentals…</p>
      ) : cards.length === 0 ? (
        <p className="text-gray-500">
          No properties found for your filters. Try adjusting your search.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((property) => {
            const img = property.coverImageUrl || "/placeholder.jpg";
            const tags = tagsFromCard(property);
            const priceText = formatMonthly(property.price, "£");
            const blurb = property.description || "";
            const location = [property.city, property.state]
              .filter(Boolean)
              .join(", ");

            return (
              <div
                key={property.id}
                className="border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition"
              >
                {/* Image */}
                <div className="p-3">
                  <div className="rounded-xl overflow-hidden">
                    <img
                      src={img}
                      alt={property.title}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                </div>

                {/* Body */}
                <div className="p-3">
                  <h3 className="text-lg font-semibold">{property.title}</h3>
                  {location && (
                    <p className="text-xs text-gray-500 mt-0.5">{location}</p>
                  )}
                  {blurb && (
                    <p className="text-sm text-gray-600 mt-2">
                      {blurb.length > 110 ? `${blurb.slice(0, 110)}…` : blurb}{" "}
                      <span className="text-black font-medium cursor-pointer">
                        Read More
                      </span>
                    </p>
                  )}

                  {/* Tags from metrics */}
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {tags.map((tag, i) => {
                        const Icon = tagIcon(tag);
                        return (
                          <span
                            key={i}
                            className="text-sm bg-black text-white px-3 py-1 rounded-full flex items-center gap-2"
                          >
                            {Icon && <Icon className="text-white" />} {tag}
                          </span>
                        );
                      })}
                    </div>
                  )}

                  {/* Price + CTA */}
                  <div className="flex justify-between items-center mt-6">
                    <p className="text-lg font-bold">{priceText}</p>
                    <button
                      className="bg-[#F3B03E] hover:bg-[#F3B03E] text-black px-4 py-2 rounded-md text-sm font-medium"
                      onClick={() => navigate(`/rent/properties/${property.id}`)}
                    >
                      View Rental Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default RentProperties;
