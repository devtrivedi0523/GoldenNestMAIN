// src/data/properties.ts
export interface Host {
    name: string;
    yearsHosting?: number;
    isSuperhost?: boolean;
}

export interface Metrics {
    type: string;           // e.g. "Apartment", "Villa"
    bedrooms: number;
    bathrooms: number;
    size?: string | null;   // e.g. "875 sq ft"
    tenure?: string | null; // e.g. "Leasehold"
}

export interface Specs {
    councilTax?: string | null;
    parking?: string | null;
    garden?: string | null;
    accessibility?: string | null;
}

export interface Property {
    id: string;                  // stable route id: e.g. "seaside-serenity-villa-0"
    title: string;
    location?: string;
    currency?: string;           // e.g. "£"
    guidePrice?: number;         // for for-sale style pages
    pricePerNight?: number;      // for nightly-style demo card
    feesNote?: string;
    reducedOn?: string | null;   // ISO string "2025-11-05"
    rating?: number;
    reviews?: number;
    summary?: string;
    description?: string;
    features?: string[];
    amenities?: string[];
    guestAccess?: string;
    specs?: Specs;
    metrics?: Metrics;
    floorplan?: string | null;
    photos?: string[];
    image?: string;              // fallback hero
    host?: Host;
}

export const slugify = (s: string) =>
    s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

/** sample dataset — replace/extend with your real content */
export const properties: Property[] = [
    {
        id: "seaside-serenity-villa-0",
        title: "seaside-serenity-villa",
        location: "Oldham Road, Manchester, M4 Manchester City Centre",
        currency: "£",
        guidePrice: 96000,
        reducedOn: "2025-11-05",
        metrics: {
            type: "Apartment",
            bedrooms: 2,
            bathrooms: 2,
            size: null,
            tenure: "Leasehold",
        },
        rating: 4.9,
        reviews: 120,
        features: [
            "FOR SALE BY LIVE STREAM AUCTION ON TUESDAY 9TH DECEMBER 2025 AT 12PM.",
            "TWO BEDROOM CITY CENTRE APARTMENT",
            "GUIDE PRICE £96,000+",
            "COUNCIL TAX BAND C",
            "EPC RATING: C",
        ],
        description:
            "Two bedroom fourth floor apartment located in Manchester City Centre in Ancoats close to the Northern Quarter. For sale by live stream auction.",
        specs: {
            councilTax: "Band C",
            parking: "Ask agent",
            garden: "Ask agent",
            accessibility: "Ask agent",
        },
        guestAccess: "Residents' access to lobby and elevators. Contact agent for viewings.",
        photos: [
            "/download.jpeg",
            "/download (1).jpeg",
            "/istockphoto-1279204567-612x612.jpg",
            "/download.jpeg",
            "/istockphoto-1279204567-612x612.jpg",
            "/download (1).jpeg",
        ],
        floorplan: "/floorplan.jpg",
        amenities: ["City views", "Elevator", "Secure entry", "Nearby transport links"],
        image: "/download.jpeg",
        pricePerNight: 115,
        feesNote: "You won't be charged yet",
        host: { name: "Angela", yearsHosting: 10, isSuperhost: true },
    },
    
    {
        id: "rustic-retreat-cottage-2",
        title: "Rustic Retreat Cottage",
        location: "Greenfield",
        currency: "£",
        guidePrice: 425000,
        metrics: { type: "Cottage", bedrooms: 3, bathrooms: 3, size: "1,200 sq ft", tenure: "Freehold" },
        description:
            "A warm, character-filled cottage with exposed beams, modern kitchen, and a sunlit garden.",
        features: ["Large garden", "Period features", "Village location"],
        specs: { councilTax: "Band E", parking: "Driveway", garden: "Yes", accessibility: "Step entry" },
        amenities: ["Garden", "Fireplace", "Village green nearby"],
        photos: ["/istockphoto-1279204567-612x612.jpg", "/download.jpeg"],
        image: "/istockphoto-1279204567-612x612.jpg",
        pricePerNight: 175,
        feesNote: "Fully refundable within 24 hours",
        host: { name: "Oliver" },
    },

    {
        id: "Greenleaf",
        title: "Greenleaf",
        location: "Greenfield",
        currency: "£",
        guidePrice: 425000,
        metrics: { type: "Cottage", bedrooms: 3, bathrooms: 3, size: "1,200 sq ft", tenure: "Freehold" },
        description:
            "A warm, character-filled cottage with exposed beams, modern kitchen, and a sunlit garden.",
        features: ["Large garden", "Period features", "Village location"],
        specs: { councilTax: "Band E", parking: "Driveway", garden: "Yes", accessibility: "Step entry" },
        amenities: ["Garden", "Fireplace", "Village green nearby"],
        photos: ["/istockphoto-1279204567-612x612.jpg", "/download.jpeg"],
        image: "/istockphoto-1279204567-612x612.jpg",
        pricePerNight: 175,
        feesNote: "Fully refundable within 24 hours",
        host: { name: "Oliver" },
    },
    {
        id: "metropolitan-haven-1",
        title: "Metropolitan Haven",
        location: "Central City",
        currency: "£",
        guidePrice: 550000,
        metrics: { type: "Apartment", bedrooms: 2, bathrooms: 2, size: "920 sq ft", tenure: "Leasehold" },
        description:
            "A chic and fully-furnished 2-bedroom apartment with panoramic city views and quick access to transport.",
        features: ["Panoramic views", "Concierge", "Close to underground"],
        specs: { councilTax: "Band D", parking: "Underground (permit)", garden: "No", accessibility: "Lift access" },
        amenities: ["Balcony", "Gym", "24/7 security"],
        photos: ["/download (1).jpeg", "/download.jpeg", "/istockphoto-1279204567-612x612.jpg"],
        image: "/download (1).jpeg",
        pricePerNight: 140,
        feesNote: "No payment until confirmation",
        host: { name: "Maya", isSuperhost: true },
    },

    {
        id: "Beverly plaza",
        title: "Beverly Plaza",
        location: "Greenfield",
        currency: "£",
        guidePrice: 425000,
        metrics: { type: "Cottage", bedrooms: 3, bathrooms: 3, size: "1,200 sq ft", tenure: "Freehold" },
        description:
            "A warm, character-filled cottage with exposed beams, modern kitchen, and a sunlit garden.",
        features: ["Large garden", "Period features", "Village location"],
        specs: { councilTax: "Band E", parking: "Driveway", garden: "Yes", accessibility: "Step entry" },
        amenities: ["Garden", "Fireplace", "Village green nearby"],
        photos: ["/istockphoto-1279204567-612x612.jpg", "/download.jpeg"],
        image: "/istockphoto-1279204567-612x612.jpg",
        pricePerNight: 175,
        feesNote: "Fully refundable within 24 hours",
        host: { name: "Oliver" },
    },

    {
        id: "Park Ave",
        title: "Park Ave",
        location: "Greenfield",
        currency: "£",
        guidePrice: 425000,
        metrics: { type: "Cottage", bedrooms: 3, bathrooms: 3, size: "1,200 sq ft", tenure: "Freehold" },
        description:
            "A warm, character-filled cottage with exposed beams, modern kitchen, and a sunlit garden.",
        features: ["Large garden", "Period features", "Village location"],
        specs: { councilTax: "Band E", parking: "Driveway", garden: "Yes", accessibility: "Step entry" },
        amenities: ["Garden", "Fireplace", "Village green nearby"],
        photos: ["/istockphoto-1279204567-612x612.jpg", "/download.jpeg"],
        image: "/istockphoto-1279204567-612x612.jpg",
        pricePerNight: 175,
        feesNote: "Fully refundable within 24 hours",
        host: { name: "Oliver" },
    },

    {
        id: "Patio Gardens",
        title: "Patio Gardens",
        location: "Greenfield",
        currency: "£",
        guidePrice: 425000,
        metrics: { type: "Cottage", bedrooms: 3, bathrooms: 3, size: "1,200 sq ft", tenure: "Freehold" },
        description:
            "A warm, character-filled cottage with exposed beams, modern kitchen, and a sunlit garden.",
        features: ["Large garden", "Period features", "Village location"],
        specs: { councilTax: "Band E", parking: "Driveway", garden: "Yes", accessibility: "Step entry" },
        amenities: ["Garden", "Fireplace", "Village green nearby"],
        photos: ["/istockphoto-1279204567-612x612.jpg", "/download.jpeg"],
        image: "/istockphoto-1279204567-612x612.jpg",
        pricePerNight: 175,
        feesNote: "Fully refundable within 24 hours",
        host: { name: "Oliver" },
    },

];

/** O(1) lookup map and helpers */
export const propertyIndex: Record<string, Property> = Object.fromEntries(
    properties.map((p) => [p.id, p])
);

export const getPropertyById = (id: string): Property | undefined => propertyIndex[id];

export default properties;
