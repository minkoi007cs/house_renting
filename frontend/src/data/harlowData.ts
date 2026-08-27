export interface PropertyListing {
  id: string;
  address: string;
  neighborhood: 'Bel Air' | 'Beverly Hills' | 'Pacific Palisades' | 'Holmby Hills' | 'Malibu' | 'Hancock Park';
  cityStateZip: string;
  price: number;
  priceFormatted: string;
  beds: number;
  baths: number;
  sqft: number;
  sqftFormatted: string;
  status: 'FOR SALE' | 'JUST LISTED' | 'OFF-MARKET EXCLUSIVE' | 'UNDER CONTRACT';
  image: string;
  gallery: string[];
  description: string;
  features: string[];
  yearBuilt: number;
  lotSizeSqFt: string;
  garageSpaces: number;
  architecturalStyle: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  location: string;
  rating: number;
  verifiedTransaction: string;
}

export interface NeighborhoodInfo {
  name: string;
  type: string;
  description: string;
  avgPrice: string;
  image: string;
  highlights: string[];
}

export interface ProcessStep {
  number: string;
  title: string;
  description: string;
  details: string;
}

export const HARLOW_BRAND = {
  name: 'HARLOW PROPERTIES',
  monogram: 'H·P',
  tagline: 'Where Home Begins',
  phone: '+1 310 555 0147',
  phoneDisplay: '+1 (310) 555-0147',
  email: 'elena@harlowproperties.com',
  office: '9465 Wilshire Blvd, Suite 300, Beverly Hills, CA 90212',
  dreNumber: 'DRE #01234567',
  areas: 'BEVERLY HILLS · BEL AIR · PACIFIC PALISADES',
};

export const LISTINGS_DATA: PropertyListing[] = [
  {
    id: 'mulholland-2847',
    address: '2847 Mulholland Drive',
    neighborhood: 'Bel Air',
    cityStateZip: 'Los Angeles, CA 90077',
    price: 6850000,
    priceFormatted: '$6,850,000',
    beds: 5,
    baths: 6,
    sqft: 6200,
    sqftFormatted: '6,200',
    status: 'FOR SALE',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85',
    ],
    description: 'Perched along Bel Air’s prestigious ridge line, this modern architectural sanctuary pairs museum-quality materials with panoramic canyon views. Floor-to-ceiling fleetwood glass doors seamlessly blend indoor living with an expansive limestone terrace and infinity-edge saltwater pool.',
    features: [
      'Infinity edge pool & spa',
      'Custom Boffi chef’s kitchen',
      'Primary suite with private terrace',
      '1,200 bottle climate-controlled wine cellar',
      'Smart home automation (Savant & Lutron)',
    ],
    yearBuilt: 2022,
    lotSizeSqFt: '0.85 Acres',
    garageSpaces: 3,
    architecturalStyle: 'Modern Architectural',
  },
  {
    id: 'roxbury-412',
    address: '412 N Roxbury Drive',
    neighborhood: 'Beverly Hills',
    cityStateZip: 'Beverly Hills, CA 90210',
    price: 4250000,
    priceFormatted: '$4,250,000',
    beds: 4,
    baths: 4.5,
    sqft: 4100,
    sqftFormatted: '4,100',
    status: 'JUST LISTED',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=85',
    ],
    description: 'Located in the heart of the Beverly Hills Flats, this classic Mediterranean estate has been meticulously restored with contemporary luxury accents. Soaring coffered ceilings, Venetian plaster finishes, and lush European gardens surround an outdoor fireplace and pool pavilion.',
    features: [
      'Gated private courtyard entrance',
      'Original restored stained glass accents',
      'Full outdoor kitchen & dining loggia',
      'Separate guest house / studio space',
      'Walking distance to Rodeo Drive',
    ],
    yearBuilt: 2019,
    lotSizeSqFt: '0.42 Acres',
    garageSpaces: 2,
    architecturalStyle: 'Contemporary Mediterranean',
  },
  {
    id: 'amalfi-1705',
    address: '1705 Amalfi Drive',
    neighborhood: 'Pacific Palisades',
    cityStateZip: 'Pacific Palisades, CA 90272',
    price: 8100000,
    priceFormatted: '$8,100,000',
    beds: 6,
    baths: 7,
    sqft: 7800,
    sqftFormatted: '7,800',
    status: 'FOR SALE',
    image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=85',
    ],
    description: 'An unparalleled Coastal Craftsman estate overlooking Riviera Country Club and ocean horizon. Designed with sustainable white oak millwork, marble slab fireplaces, an underground wellness center with sauna and ice bath, and expansive rolling lawns.',
    features: [
      'Unobstructed ocean & canyon views',
      'Underground wellness center & sauna',
      'Private screening room with 4K laser projection',
      'Solar energy system & battery storage',
      'Direct access to country club trails',
    ],
    yearBuilt: 2023,
    lotSizeSqFt: '1.10 Acres',
    garageSpaces: 4,
    architecturalStyle: 'Coastal Warm Minimalist',
  },
  {
    id: 'belair-crest-924',
    address: '924 Bel Air Crest Road',
    neighborhood: 'Bel Air',
    cityStateZip: 'Los Angeles, CA 90077',
    price: 12500000,
    priceFormatted: '$12,500,000',
    beds: 7,
    baths: 9,
    sqft: 10400,
    sqftFormatted: '10,400',
    status: 'OFF-MARKET EXCLUSIVE',
    image: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1600566753086-37f1a2083506?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=85',
    ],
    description: 'Guarded behind double security gates in Bel Air Crest, this trophy compound offers resort-style outdoor living, tennis court, zero-edge pool, private elevator, and commercial-grade catering setup for high-level entertaining.',
    features: [
      'Full size championship tennis court',
      '24/7 guard-gated enclave',
      'Elevator serving all 3 levels',
      'Subterranean garage for 8 vehicles',
      'Staff quarters with separate entry',
    ],
    yearBuilt: 2021,
    lotSizeSqFt: '1.65 Acres',
    garageSpaces: 8,
    architecturalStyle: 'Neoclassical Villa',
  },
  {
    id: 'malibu-pch-22100',
    address: '22100 Pacific Coast Highway',
    neighborhood: 'Malibu',
    cityStateZip: 'Malibu, CA 90265',
    price: 14900000,
    priceFormatted: '$14,900,000',
    beds: 5,
    baths: 6,
    sqft: 5900,
    sqftFormatted: '5,900',
    status: 'JUST LISTED',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1600&q=85',
    ],
    description: 'Direct beachfront residence on Carbon Beach. Floor-to-ceiling glass reveals breathtaking panoramic white-water ocean views from Palos Verdes to Point Dume.',
    features: [
      '60 feet of direct beach frontage',
      'Private staircase down to sandy beach',
      'Custom teak decking with outdoor spa',
      'Automated blackout shade system',
      'Zero-entry frameless glass balcony',
    ],
    yearBuilt: 2020,
    lotSizeSqFt: 'Direct Ocean Frontage',
    garageSpaces: 2,
    architecturalStyle: 'Modern Oceanfront Glass Villa',
  },
  {
    id: 'summitridge-1400',
    address: '1400 Summitridge Drive',
    neighborhood: 'Beverly Hills',
    cityStateZip: 'Beverly Hills, CA 90210',
    price: 9750000,
    priceFormatted: '$9,750,000',
    beds: 5,
    baths: 6.5,
    sqft: 7100,
    sqftFormatted: '7,100',
    status: 'FOR SALE',
    image: 'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1600&q=85',
    ],
    description: 'Dramatic promontory estate offering 270-degree view lines over Downtown LA to the ocean. Complete seclusion on a private cul-de-sac.',
    features: [
      '270-degree unobstructed city-to-ocean views',
      'Motor court parking for 6 cars',
      'Primary wing with dual spa baths',
      'Outdoor kitchen & fire lounge',
      'High-security biometric entry',
    ],
    yearBuilt: 2021,
    lotSizeSqFt: '0.90 Acres',
    garageSpaces: 3,
    architecturalStyle: 'Promontory Modern',
  },
];

export const STATS_DATA = [
  { target: 247, label: 'Homes Sold', prefix: '', suffix: '+' },
  { target: 4.2, label: 'Average Sale Price', prefix: '$', suffix: 'M', decimal: true },
  { target: 18, label: 'Average Time on Market', prefix: '', suffix: ' Days' },
];

export const TESTIMONIALS_DATA: Testimonial[] = [
  {
    id: '1',
    quote: 'Elena found us our dream home in Bel Air in three weeks. What impressed us most wasn’t the speed — it was how well she listened to what we actually wanted.',
    author: 'David & Sarah M.',
    role: 'Buyers',
    location: 'Bel Air Estate',
    rating: 5,
    verifiedTransaction: '$7.4M Bel Air Acquisition',
  },
  {
    id: '2',
    quote: 'We listed with Elena after a disappointing experience with another agent. She repositioned our property, staged it beautifully, and got us $400K over asking in 12 days.',
    author: 'James K.',
    role: 'Seller',
    location: 'Pacific Palisades Bluff',
    rating: 5,
    verifiedTransaction: '$8.1M Palisades Sale',
  },
  {
    id: '3',
    quote: 'Working with Harlow Properties felt nothing like I expected from a real estate transaction. Personal, professional, and incredibly effective.',
    author: 'Tanya R.',
    role: 'Buyer',
    location: 'Beverly Hills Flats',
    rating: 5,
    verifiedTransaction: '$4.25M Beverly Hills Purchase',
  },
];

export const PROCESS_STEPS: ProcessStep[] = [
  {
    number: '01',
    title: 'Consultation',
    description: 'We start by listening. A no-pressure conversation to understand your goals, timeline, and what home truly means to you.',
    details: 'In-depth analysis of your lifestyle requirements, privacy preferences, aesthetic taste, and portfolio objectives.',
  },
  {
    number: '02',
    title: 'Strategy',
    description: 'Every property is unique. We develop a tailored plan — pricing, positioning, and marketing — built specifically for your situation.',
    details: 'Bespoke architectural photography, targeted off-market outreach, discrete private showings, and custom media placement.',
  },
  {
    number: '03',
    title: 'Negotiation',
    description: 'When the offers come in, you want an advocate, not a facilitator. Elena has negotiated hundreds of high-stakes deals.',
    details: 'Mastery over contractual structure, price leverage, contingency protection, and closing terms.',
  },
  {
    number: '04',
    title: 'Closing',
    description: 'We manage every detail through escrow so the finish line is smooth, certain, and exactly what you expected.',
    details: 'White-glove coordination of title, inspections, wire escrow, transfer key delivery, and concierge onboarding.',
  },
];

export const NEIGHBORHOODS_DATA: NeighborhoodInfo[] = [
  {
    name: 'Bel Air',
    type: 'Residential Estates',
    description: 'Classic luxury, private winding roads, gated compounds, and sprawling canyon estates.',
    avgPrice: '$8.5M',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
    highlights: ['Gated Security', 'Country Club Access', 'Large Acreage Lots'],
  },
  {
    name: 'Beverly Hills',
    type: 'City Prestige',
    description: 'World-renowned elegance, tree-lined flats, iconic zip code, and architectural grandeur.',
    avgPrice: '$6.2M',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=85',
    highlights: ['Rodeo Drive Access', 'Private Security Patrols', 'Historic Architecture'],
  },
  {
    name: 'Pacific Palisades',
    type: 'Coastal Living',
    description: 'Ocean breezes, mountain backdrops, coastal bluffs, and vibrant village vibe.',
    avgPrice: '$5.8M',
    image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=85',
    highlights: ['Ocean Views', 'Palisades Village', 'Top Private Schools'],
  },
  {
    name: 'Holmby Hills',
    type: 'Private Estates',
    description: 'Ultra-exclusive residential enclave tucked between Bel Air and Beverly Hills.',
    avgPrice: '$14.2M',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=85',
    highlights: ['Historic Palaces', 'Ultimate Seclusion', 'Lush Forest Canopy'],
  },
  {
    name: 'Malibu',
    type: 'Beach & Canyon',
    description: 'Pristine coastline, beachfront architectural masterpieces, and scenic mountain retreats.',
    avgPrice: '$9.8M',
    image: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=85',
    highlights: ['Carbon & Colony Beach', 'Surfing & Boating', 'Sunset Panoramas'],
  },
  {
    name: 'Hancock Park',
    type: 'Historic Elegance',
    description: 'Stately traditional homes, grand tree canopy streets, and timeless LA history.',
    avgPrice: '$4.5M',
    image: 'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=1200&q=85',
    highlights: ['Wilshire Country Club', 'Classic Mansions', 'Central LA Proximity'],
  },
];

export const CREDENTIALS = [
  'NAR Member',
  'CLHMS Certified',
  'Forbes 30 Under 30',
  'LA Business Journal Top Agent',
];
