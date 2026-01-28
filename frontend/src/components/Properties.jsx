// --- src/sections/FeaturedProperties.jsx ---
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBed, FaBath, FaHome, FaBuilding, FaTree } from "react-icons/fa";

const API_BASE = import.meta.env.VITE_API_URL || "https://api.thegoldennest.co.uk";

const formatMoney = (n, currency = "£") =>
  typeof n === "number" ? `${currency}${n.toLocaleString()}` : null;

const tagIcon = (label) => {
  const l = label.toLowerCase();
  if (l.includes("bed")) return FaBed;
  if (l.includes("bath")) return FaBath;
  if (l.includes("apartment")) return FaBuilding;
  if (l.includes("cottage")) return FaTree;
  return FaHome; // default / type
};

const makeTagsFromCard = (p) => {
  const tags = [];
  if (p.bedrooms != null) tags.push(`${p.bedrooms}-Bedroom`);
  if (p.bathrooms != null) tags.push(`${p.bathrooms}-Bathroom`);
  if (p.type) tags.push(p.type);
  return tags;
};

const FeaturedProperties = () => {
  const navigate = useNavigate();
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/api/properties?page=0&size=6`);
        if (!res.ok) throw new Error("Failed to load featured properties");
        const data = await res.json(); // Page<PropertyCardDto>
        setCards(data.content || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <section className="py-16 bg-white px-6 md:px-20">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl md:text-4xl font-serif font-semibold">
            Featured Properties
          </h2>
          <p className="text-gray-600 mt-2 max-w-xl">
            Explore our handpicked selection of featured properties. Each listing
            offers a glimpse into exceptional homes and investments available
            through Golden Nest.
          </p>
        </div>
        <button
          className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-md font-medium mt-4 md:mt-0"
          onClick={() => navigate("/buy")}
        >
          View All Properties
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading featured properties…</p>
      ) : cards.length === 0 ? (
        <p className="text-gray-500">No properties yet. Add some and approve them in the admin.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((property) => {
            const img = property.coverImageUrl || "/placeholder.jpg";
            const tags = makeTagsFromCard(property);
            const salePrice = formatMoney(
              property.price,
              "£" // or "₹" if you prefer
            );
            const priceText = salePrice ?? "Price on application";

            const location = [property.city, property.state]
              .filter(Boolean)
              .join(", ");

            const blurb = property.description || "";

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

                {/* Card body */}
                <div className="p-3">
                  <h3 className="text-lg font-semibold">{property.title}</h3>
                  {location && (
                    <p className="text-xs text-gray-500 mt-0.5">{location}</p>
                  )}
                  {blurb && (
                    <>
                      <p className="text-sm text-gray-600 mt-2 line-clamp-1">
                        {blurb}
                      </p>
                      <span className="text-black font-medium cursor-pointer text-sm">
                        Read More
                      </span>
                    </>
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

                  {/* Price and Button */}
                  <div className="flex justify-between items-center mt-6">
                    <p className="text-lg font-bold">{priceText}</p>
                    <button
                      className="bg-[#F3B03E] hover:bg-[#F3B03E] text-black px-4 py-2 rounded-md text-sm font-medium"
                      onClick={() => navigate(`/buy/properties/${property.id}`)}
                    >
                      View Property Details
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

export default FeaturedProperties;
