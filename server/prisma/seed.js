import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Smart Local Tourism Business Portal database...');

  // Clean slate for idempotent re-seeding
  await prisma.review.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.listing.deleteMany();
  await prisma.contactMessage.deleteMany();
  await prisma.user.deleteMany();

  const adminPassword = await bcrypt.hash('Admin@123', 10);
  const providerPassword = await bcrypt.hash('Provider@123', 10);
  const touristPassword = await bcrypt.hash('Tourist@123', 10);

  const admin = await prisma.user.create({
    data: {
      name: 'Ananya Rao',
      email: 'admin@karnatakatourism.in',
      passwordHash: adminPassword,
      role: 'admin',
      phone: '+91 98450 11223',
    },
  });

  const provider1 = await prisma.user.create({
    data: {
      name: 'Kaveri Bopanna',
      email: 'kaveri@malnadstays.in',
      passwordHash: providerPassword,
      role: 'provider',
      phone: '+91 94481 33445',
    },
  });

  const provider2 = await prisma.user.create({
    data: {
      name: 'Veeresh Kulkarni',
      email: 'veeresh@hampiheritage.in',
      passwordHash: providerPassword,
      role: 'provider',
      phone: '+91 99002 55667',
    },
  });

  const tourist1 = await prisma.user.create({
    data: {
      name: 'Aarav Sharma',
      email: 'aarav@traveler.in',
      passwordHash: touristPassword,
      role: 'tourist',
      phone: '+91 98801 77889',
    },
  });

  const tourist2 = await prisma.user.create({
    data: {
      name: 'Meera Nair',
      email: 'meera@traveler.in',
      passwordHash: touristPassword,
      role: 'tourist',
      phone: '+91 97402 88990',
    },
  });

  const tourist3 = await prisma.user.create({
    data: {
      name: 'Rohan Deshmukh',
      email: 'rohan@traveler.in',
      passwordHash: touristPassword,
      role: 'tourist',
      phone: '+91 96112 44556',
    },
  });

  const listingsData = [
    {
      providerId: provider1.id,
      title: 'Kodagu Coffee Estate Heritage Homestay',
      description:
        'Wake up to mist-covered Arabica plantations in Madikeri, Coorg. Enjoy traditional Kodava breakfasts, estate walks with birdsong, and cozy veranda evenings beside a pepper-vine courtyard.',
      category: 'Homestay',
      location: 'Coorg',
      price: 3800,
      priceUnit: 'per_night',
      images: JSON.stringify(['/images/coorg-homestay.png', '/images/coffee-experience.png']),
      amenities: JSON.stringify([
        'Home-cooked Kodava Meals',
        'Wi-Fi',
        'Plantation Walk',
        'Free Parking',
        'Bonfire Area',
      ]),
      status: 'approved',
    },
    {
      providerId: provider2.id,
      title: 'Tungabhadra Boulder Courtyard Stay',
      description:
        'A serene stone-and-lime homestay nestled among Hampi’s iconic granite boulders near Virupapura Gaddi. Ideal for slow travelers exploring ancient Vijayanagara monuments.',
      category: 'Homestay',
      location: 'Hampi',
      price: 2600,
      priceUnit: 'per_night',
      images: JSON.stringify(['/images/hampi-heritage.png', '/images/coorg-homestay.png']),
      amenities: JSON.stringify([
        'Rooftop Sunset Terrace',
        'Bicycle Rental',
        'Air Conditioning',
        'Organic South Indian Breakfast',
      ]),
      status: 'approved',
    },
    {
      providerId: provider1.id,
      title: 'Kudle Cliffside Eco Cottages',
      description:
        'Handcrafted laterite and bamboo cottages perched above Gokarna’s Kudle Beach. Listen to the Arabian Sea waves and unwind in a sustainable coastal retreat.',
      category: 'Homestay',
      location: 'Gokarna',
      price: 3200,
      priceUnit: 'per_night',
      images: JSON.stringify(['/images/gokarna-coast.png', '/images/coorg-homestay.png']),
      amenities: JSON.stringify([
        'Ocean View Deck',
        'Yoga Shala Access',
        'Solar Hot Water',
        'Coastal Breakfast',
      ]),
      status: 'approved',
    },
    {
      providerId: provider2.id,
      title: 'Unkal Lakefront Family Homestay',
      description:
        'Warm North Karnataka hospitality overlooking Unkal Lake in Hubballi-Dharwad. Spacious heritage-inspired rooms with easy access to Nrupatunga Betta and Dharwad cultural hubs.',
      category: 'Homestay',
      location: 'Hubballi-Dharwad',
      price: 2100,
      priceUnit: 'per_night',
      images: JSON.stringify(['/images/hubballi-culture.png', '/images/coorg-homestay.png']),
      amenities: JSON.stringify([
        'Lake View Balcony',
        'High-Speed Wi-Fi',
        'Jolad Rotti Dinner Option',
        'EV & Car Parking',
      ]),
      status: 'approved',
    },
    {
      providerId: provider2.id,
      title: 'Vijayanagara Sunrise & Temple Architecture Walk',
      description:
        'Guided 5-hour storytelling walk through Vittala Temple, Stone Chariot, Lotus Mahal, and royal enclosures with a state-certified historian fluent in Kannada, Hindi, and English.',
      category: 'Guide',
      location: 'Hampi',
      price: 1800,
      priceUnit: 'per_day',
      images: JSON.stringify(['/images/hampi-heritage.png', '/images/hubballi-culture.png']),
      amenities: JSON.stringify(['English', 'Kannada', 'Hindi', 'ASI Certified Guide', 'Sunrise Route']),
      status: 'approved',
    },
    {
      providerId: provider1.id,
      title: 'Gokarna Five-Beach Coastal Trekking Guide',
      description:
        'Explore Belekan, Paradise, Half Moon, Om, and Kudle beaches via scenic cliff trails with safety gear, hidden cove stops, and local coastal ecology insights.',
      category: 'Guide',
      location: 'Gokarna',
      price: 1500,
      priceUnit: 'per_day',
      images: JSON.stringify(['/images/gokarna-coast.png', '/images/waterfall-trek.png']),
      amenities: JSON.stringify(['English', 'Kannada', 'Konkani', 'First-Aid Certified', 'Ferry Coordination']),
      status: 'approved',
    },
    {
      providerId: provider1.id,
      title: 'Coorg Misty Peaks & Spice Trail Naturalist',
      description:
        'Trek lesser-known Western Ghats shola forest trails, spot Malabar hornbills, and learn cardamom, black pepper, and wild honey harvesting with a local naturalist.',
      category: 'Guide',
      location: 'Coorg',
      price: 2200,
      priceUnit: 'per_day',
      images: JSON.stringify(['/images/waterfall-trek.png', '/images/coffee-experience.png']),
      amenities: JSON.stringify(['English', 'Kannada', 'Kodava', 'Binoculars Provided', 'Eco-Trail Permit']),
      status: 'approved',
    },
    {
      providerId: provider2.id,
      title: 'Dharwad Hindustani Music & Heritage Town Walk',
      description:
        'Discover the land of Hindustani classical legends—visit historic gharana courtyards, Karnataka Vidyavardhaka Sangha, and century-old sweet makers in Hubballi-Dharwad.',
      category: 'Guide',
      location: 'Hubballi-Dharwad',
      price: 1400,
      priceUnit: 'per_day',
      images: JSON.stringify(['/images/hubballi-culture.png', '/images/food-trail.png']),
      amenities: JSON.stringify(['English', 'Kannada', 'Marathi', 'Cultural Historian', 'Museum Stops']),
      status: 'approved',
    },
    {
      providerId: provider2.id,
      title: 'Bengeri Khadi & Ilkal Saree Weaving Studio',
      description:
        'Visit Karnataka’s iconic hand-spinning and pit-loom weaving studio in Hubballi. Try spinning cotton on a charkha and take home ethically woven Ilkal and khadi textiles.',
      category: 'Cultural Business',
      location: 'Hubballi-Dharwad',
      price: 950,
      priceUnit: 'per_person',
      images: JSON.stringify(['/images/handloom-craft.png', '/images/hubballi-culture.png']),
      amenities: JSON.stringify(['Live Loom Demo', 'Charkha Hands-On', 'Fair-Trade Shop', 'English & Kannada']),
      status: 'approved',
    },
    {
      providerId: provider2.id,
      title: 'Anegundi Banana-Fibre Craft Collective',
      description:
        'Hands-on session with women artisans of Kishkinda Trust in Anegundi near Hampi. Learn how agricultural banana bark becomes natural woven baskets, mats, and decor.',
      category: 'Cultural Business',
      location: 'Hampi',
      price: 800,
      priceUnit: 'per_session',
      images: JSON.stringify(['/images/handloom-craft.png', '/images/hampi-heritage.png']),
      amenities: JSON.stringify(['Artisan-Led Workshop', 'Eco Materials Included', 'Take-Home Craft', 'Village Tea']),
      status: 'approved',
    },
    {
      providerId: provider1.id,
      title: 'Coastal Terracotta & Woodcraft Atelier',
      description:
        'Discover traditional Uttara Kannada temple-inspired wood carving and river-clay pottery in Gokarna. Craft your own terracotta souvenir with master artisans.',
      category: 'Cultural Business',
      location: 'Gokarna',
      price: 1100,
      priceUnit: 'per_session',
      images: JSON.stringify(['/images/handloom-craft.png', '/images/gokarna-coast.png']),
      amenities: JSON.stringify(['Clay & Tools Included', 'Kiln Firing Option', 'Coastal Refreshments']),
      status: 'approved',
    },
    {
      providerId: provider2.id,
      title: 'Dharwad Peda & Jolad Rotti Culinary Trail',
      description:
        'Taste authentic slow-caramelized Dharwad Peda, crispy girmit with mirchi bajji, and a traditional North Karnataka jolad rotti feast hosted in a local heritage kitchen.',
      category: 'Experience',
      location: 'Hubballi-Dharwad',
      price: 1250,
      priceUnit: 'per_person',
      images: JSON.stringify(['/images/food-trail.png', '/images/hubballi-culture.png']),
      amenities: JSON.stringify(['6 Tasting Stops', 'Vegetarian Friendly', 'Recipe Booklet', 'Evening Tour']),
      status: 'approved',
    },
    {
      providerId: provider1.id,
      title: 'Coorg Bean-to-Cup Roasting & Kodava Lunch',
      description:
        'Pick ripe coffee cherries in season, roast single-estate beans over wood fire, brew traditional filter kaapi, and savor an authentic family-style Kodava lunch.',
      category: 'Experience',
      location: 'Coorg',
      price: 1600,
      priceUnit: 'per_person',
      images: JSON.stringify(['/images/coffee-experience.png', '/images/food-trail.png']),
      amenities: JSON.stringify(['Coffee Tasting', 'Farm-to-Table Lunch', '250g Roast Pack Included']),
      status: 'approved',
    },
    {
      providerId: provider2.id,
      title: 'Hampi Coracle Sunset Ride & Folk Ballads',
      description:
        'Float across calm Tungabhadra waters in a traditional bamboo coracle at golden hour, accompanied by Janapada folk songs and stories of the Vijayanagara empire.',
      category: 'Experience',
      location: 'Hampi',
      price: 900,
      priceUnit: 'per_person',
      images: JSON.stringify(['/images/hampi-heritage.png', '/images/gokarna-coast.png']),
      amenities: JSON.stringify(['Life Jackets Provided', 'Local Boatman', 'Sunset Timing']),
      status: 'pending',
    },
    {
      providerId: provider1.id,
      title: 'Gokarna Twilight Kayak & Coastal Astronomy',
      description:
        'Paddle calm backwaters near Tadadi estuary at dusk before stargazing on a quiet cove with local maritime navigators and coastal snacks.',
      category: 'Experience',
      location: 'Gokarna',
      price: 1750,
      priceUnit: 'per_person',
      images: JSON.stringify(['/images/gokarna-coast.png', '/images/waterfall-trek.png']),
      amenities: JSON.stringify(['Kayak & Safety Gear', 'Stargazing Telescope', 'Herbal Tea']),
      status: 'pending',
    },
  ];

  const createdListings = [];
  for (const item of listingsData) {
    const listing = await prisma.listing.create({ data: item });
    createdListings.push(listing);
  }

  // Completed bookings (past dates) + Reviews
  const completedBooking1 = await prisma.booking.create({
    data: {
      listingId: createdListings[0].id, // Kodagu Coffee Estate Homestay
      touristId: tourist1.id,
      startDate: new Date('2026-10-10T00:00:00.000Z'),
      endDate: new Date('2026-10-13T00:00:00.000Z'), // 3 nights
      guests: 2,
      totalPrice: 3800 * 3,
      status: 'completed',
    },
  });

  const completedBooking2 = await prisma.booking.create({
    data: {
      listingId: createdListings[0].id,
      touristId: tourist2.id,
      startDate: new Date('2026-10-20T00:00:00.000Z'),
      endDate: new Date('2026-10-22T00:00:00.000Z'), // 2 nights
      guests: 3,
      totalPrice: 3800 * 2,
      status: 'completed',
    },
  });

  const completedBooking3 = await prisma.booking.create({
    data: {
      listingId: createdListings[4].id, // Vijayanagara Sunrise Walk
      touristId: tourist1.id,
      startDate: new Date('2026-11-02T00:00:00.000Z'),
      endDate: new Date('2026-11-03T00:00:00.000Z'),
      guests: 2,
      totalPrice: 1800,
      status: 'completed',
    },
  });

  const completedBooking4 = await prisma.booking.create({
    data: {
      listingId: createdListings[8].id, // Bengeri Khadi Studio
      touristId: tourist3.id,
      startDate: new Date('2026-11-05T00:00:00.000Z'),
      endDate: new Date('2026-11-05T00:00:00.000Z'),
      guests: 2,
      totalPrice: 950 * 2,
      status: 'completed',
    },
  });

  const completedBooking5 = await prisma.booking.create({
    data: {
      listingId: createdListings[11].id, // Dharwad Peda & Jolad Rotti Trail
      touristId: tourist2.id,
      startDate: new Date('2026-11-08T00:00:00.000Z'),
      endDate: new Date('2026-11-08T00:00:00.000Z'),
      guests: 2,
      totalPrice: 1250 * 2,
      status: 'completed',
    },
  });

  const completedBooking6 = await prisma.booking.create({
    data: {
      listingId: createdListings[2].id, // Kudle Cliffside Eco Cottages
      touristId: tourist3.id,
      startDate: new Date('2026-11-12T00:00:00.000Z'),
      endDate: new Date('2026-11-14T00:00:00.000Z'), // 2 nights
      guests: 2,
      totalPrice: 3200 * 2,
      status: 'completed',
    },
  });

  // Confirmed, pending, cancelled, and rejected upcoming bookings
  await prisma.booking.create({
    data: {
      listingId: createdListings[0].id,
      touristId: tourist3.id,
      startDate: new Date('2026-12-15T00:00:00.000Z'),
      endDate: new Date('2026-12-18T00:00:00.000Z'),
      guests: 2,
      totalPrice: 3800 * 3,
      status: 'confirmed',
    },
  });

  await prisma.booking.create({
    data: {
      listingId: createdListings[1].id, // Tungabhadra Boulder Courtyard Stay
      touristId: tourist1.id,
      startDate: new Date('2026-12-20T00:00:00.000Z'),
      endDate: new Date('2026-12-22T00:00:00.000Z'),
      guests: 2,
      totalPrice: 2600 * 2,
      status: 'pending',
    },
  });

  await prisma.booking.create({
    data: {
      listingId: createdListings[12].id, // Coorg Coffee Roasting
      touristId: tourist2.id,
      startDate: new Date('2026-12-10T00:00:00.000Z'),
      endDate: new Date('2026-12-10T00:00:00.000Z'),
      guests: 3,
      totalPrice: 1600 * 3,
      status: 'pending',
    },
  });

  await prisma.booking.create({
    data: {
      listingId: createdListings[5].id, // Gokarna Five-Beach Trek
      touristId: tourist1.id,
      startDate: new Date('2026-11-28T00:00:00.000Z'),
      endDate: new Date('2026-11-28T00:00:00.000Z'),
      guests: 2,
      totalPrice: 1500,
      status: 'cancelled',
    },
  });

  await prisma.booking.create({
    data: {
      listingId: createdListings[6].id,
      touristId: tourist3.id,
      startDate: new Date('2026-12-05T00:00:00.000Z'),
      endDate: new Date('2026-12-05T00:00:00.000Z'),
      guests: 4,
      totalPrice: 2200,
      status: 'rejected',
    },
  });

  // Seed Reviews linked to completed bookings
  const reviewsToSeed = [
    {
      listingId: createdListings[0].id,
      touristId: tourist1.id,
      bookingId: completedBooking1.id,
      rating: 5,
      comment:
        'Unforgettable stay amidst misty coffee estates! Kaveri’s akki rotti and bamboo shoot curry were the highlight of our Coorg trip.',
    },
    {
      listingId: createdListings[0].id,
      touristId: tourist2.id,
      bookingId: completedBooking2.id,
      rating: 5,
      comment:
        'Peaceful veranda, spotless rooms, and the morning plantation walk taught us so much about shade-grown Arabica.',
    },
    {
      listingId: createdListings[4].id,
      touristId: tourist1.id,
      bookingId: completedBooking3.id,
      rating: 5,
      comment:
        'Veeresh brought the ruins of Vijayanagara alive! Starting at sunrise made the Stone Chariot feel magical without the midday heat.',
    },
    {
      listingId: createdListings[8].id,
      touristId: tourist3.id,
      bookingId: completedBooking4.id,
      rating: 4,
      comment:
        'Inspiring visit to the weavers in Hubballi. Loved trying the wooden charkha and supporting local khadi artisans directly.',
    },
    {
      listingId: createdListings[11].id,
      touristId: tourist2.id,
      bookingId: completedBooking5.id,
      rating: 5,
      comment:
        'Every single tasting stop in Dharwad was authentic—especially the warm pedas and crispy girmit!',
    },
    {
      listingId: createdListings[2].id,
      touristId: tourist3.id,
      bookingId: completedBooking6.id,
      rating: 4,
      comment:
        'Incredible cliffside views above Kudle Beach and thoughtful eco-friendly cottages.',
    },
  ];

  for (const rev of reviewsToSeed) {
    await prisma.review.create({ data: rev });
  }

  // Update avgRating for listings with reviews
  const reviewedListingIds = [...new Set(reviewsToSeed.map((r) => r.listingId))];
  for (const listingId of reviewedListingIds) {
    const agg = await prisma.review.aggregate({
      where: { listingId },
      _avg: { rating: true },
    });
    await prisma.listing.update({
      where: { id: listingId },
      data: { avgRating: Number((agg._avg.rating || 0).toFixed(2)) },
    });
  }

  await prisma.contactMessage.create({
    data: {
      name: 'Priya Hegde',
      email: 'priya.hegde@example.in',
      message: 'We run a traditional yakshagana mask-making studio in Uttara Kannada and would love to join as a verified cultural partner.',
    },
  });

  console.log(
    `Seeded: ${1 + 2 + 3} users (Admin: ${admin.email}), ${createdListings.length} listings, 11 bookings, ${reviewsToSeed.length} reviews.`
  );
}

main()
  .catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
