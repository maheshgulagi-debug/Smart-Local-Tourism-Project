export const REGION_CONFIG = {
  brandName: 'NammaTrail',
  portalTitle: 'Smart Local Tourism Business Portal',
  regionName: 'Karnataka, India',
  heroEyebrow: 'Authentic Local Stays, Guides & Living Heritage',
  heroTitle: 'Experience Karnataka Through Its Local Hosts & Artisans',
  heroSubtitle:
    'Discover verified homestays, certified heritage guides, handloom workshops, and culinary trails across Hubballi-Dharwad, Hampi, Gokarna, and Coorg.',
  destinations: [
    {
      name: 'Hampi',
      subtitle: 'UNESCO Vijayanagara Ruins & Boulder Landscapes',
      image: '/images/hampi-heritage.jpg',
      highlights: 'Stone Chariot, Sunrise Walks, Coracle Rides',
    },
    {
      name: 'Coorg',
      subtitle: 'Misty Coffee Estates & Western Ghats Trails',
      image: '/images/coorg-homestay.jpg',
      highlights: 'Estate Homestays, Arabica Roasting, Forest Treks',
    },
    {
      name: 'Gokarna',
      subtitle: 'Serene Coastal Cliffs & Eco Beach Retreats',
      image: '/images/gokarna-coast.svg',
      highlights: 'Five-Beach Trek, Cliff Cottages, Terracotta Craft',
    },
    {
      name: 'Hubballi-Dharwad',
      subtitle: 'Hindustani Music, Khadi Weavers & Culinary Heritage',
      image: '/images/hubballi-culture.jpg',
      highlights: 'Bengeri Khadi, Dharwad Peda Trail, Unkal Lake',
    },
  ],
  categories: [
    {
      value: 'Homestay',
      label: 'Homestays',
      description: 'Family-run heritage homes, estate bungalows, and coastal eco cottages.',
      image: '/images/coorg-homestay.jpg',
    },
    {
      value: 'Guide',
      label: 'Local Guides',
      description: 'Historians, naturalists, and coastal trekkers fluent in local stories.',
      image: '/images/hampi-heritage.jpg',
    },
    {
      value: 'Cultural Business',
      label: 'Cultural Businesses',
      description: 'Handloom weaving collectives, terracotta studios, and craft cooperatives.',
      image: '/images/handloom-craft.jpg',
    },
    {
      value: 'Experience',
      label: 'Experiences',
      description: 'Culinary walks, coffee roasting sessions, and twilight river trails.',
      image: '/images/food-trail.jpg',
    },
  ],
  testimonials: [
    {
      name: 'Aarav Sharma',
      origin: 'Bengaluru',
      quote:
        'Staying at a family coffee estate in Coorg and walking Hampi at sunrise with Veeresh turned a regular weekend into a lifelong memory.',
      trip: 'Coorg & Hampi',
    },
    {
      name: 'Meera Nair',
      origin: 'Kochi',
      quote:
        'The Dharwad food trail and Bengeri khadi studio showed us a side of North Karnataka you simply cannot find on generic travel sites.',
      trip: 'Hubballi-Dharwad',
    },
    {
      name: 'Rohan Deshmukh',
      origin: 'Pune',
      quote:
        'Instant clarity on available dates and direct booking with verified local hosts gave our family complete peace of mind.',
      trip: 'Gokarna Coast',
    },
  ],
  culturalEvents: [
    {
      id: 'hampi-utsav',
      title: 'Hampi Utsav (Vijayanagara Festival)',
      location: 'Hampi',
      season: 'January – February',
      category: 'Heritage & Performing Arts',
      description:
        'Three days of classical music, Dollu Kunitha folk dances, puppetry, and illuminated stone temple backdrops across the ancient capital.',
      image: '/images/hampi-heritage.jpg',
    },
    {
      id: 'dharwad-sangeetotsav',
      title: 'Dharwad Hindustani Classical Sangeetotsav',
      location: 'Hubballi-Dharwad',
      season: 'November – December',
      category: 'Music & Literature',
      description:
        'Celebrating the legacy of Pt. Bhimsen Joshi, Gangubai Hangal, and Mallikarjun Mansur with intimate baithaks and vocal recitals.',
      image: '/images/hubballi-culture.jpg',
    },
    {
      id: 'kodagu-harvest',
      title: 'Puthari Harvest & Coffee Blossom Season',
      location: 'Coorg',
      season: 'November – March',
      category: 'Agri-Culture & Gastronomy',
      description:
        'Experience Kodava harvest songs, traditional feast preparations, and fragrant white coffee blossoms across Madikeri estates.',
      image: '/images/coffee-experience.jpg',
    },
    {
      id: 'gokarna-craft-fair',
      title: 'Uttara Kannada Coastal Craft & Folk Fair',
      location: 'Gokarna',
      season: 'December – February',
      category: 'Artisans & Coast',
      description:
        'Meet Yakshagana mask makers, river-clay potters, and coastal fisherfolk sharing culinary and maritime traditions along Karwar–Gokarna.',
      image: '/images/handloom-craft.jpg',
    },
  ],
};

export const PRICE_UNIT_LABELS = {
  per_night: 'night',
  per_day: 'day',
  per_person: 'person',
  per_session: 'session',
};

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(amount || 0));
}

export function formatDateDisplay(dateValue) {
  if (!dateValue) return '';
  return new Date(dateValue).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
}
