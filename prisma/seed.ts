import { Role, VerificationStatus, ResourceType, ItemCondition, UrgencyLevel, RequirementStatus, DeliveryType, FulfillmentStatus } from "@prisma/client";
import { prisma } from "../src/lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  console.log("🌱 Starting SharePlus database seeding...");

  // 1. Categories
  const categoriesData = [
    {
      name: "Medical & Healthcare",
      slug: "medical-healthcare",
      description: "Wheelchairs, hospital cots, nebulizers, mobility aids, and medical devices.",
      icon: "Stethoscope",
    },
    {
      name: "Education & Tech",
      slug: "education-tech",
      description: "Refurbished laptops, monitors, textbooks, school supplies, and study tables.",
      icon: "Laptop",
    },
    {
      name: "Clothing & Warmth",
      slug: "clothing-warmth",
      description: "Winter blankets, sweaters, thermal jackets, shoes, and rainwear.",
      icon: "Shirt",
    },
    {
      name: "Shelter & Household",
      slug: "shelter-household",
      description: "Tarpaulins, emergency solar lamps, mattresses, folding cots, and utensils.",
      icon: "Home",
    },
    {
      name: "Tools & Equipment",
      slug: "tools-equipment",
      description: "Drills, sewing machines, water pumps, gardening tools, and repair gear.",
      icon: "Wrench",
    },
    {
      name: "Food & Nutrition",
      slug: "food-nutrition",
      description: "Dry rations, grain sacks, infant baby formula, and clean drinking water kits.",
      icon: "Apple",
    },
  ];

  const categoriesMap = new Map();
  for (const cat of categoriesData) {
    const record = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
    categoriesMap.set(cat.slug, record);
  }
  console.log("✓ Categories seeded:", categoriesMap.size);

  // 2. Demo Users
  const passwordHash = await bcrypt.hash("SharePlus2026!", 10);

  // Individual Donor
  const donorUser = await prisma.user.upsert({
    where: { email: "donor@shareplus.org" },
    update: {},
    create: {
      name: "Vikram Malhotra",
      email: "donor@shareplus.org",
      passwordHash,
      role: Role.DONOR,
      city: "New Delhi",
      phone: "+91 98100 23456",
      address: "18 Barakhamba Road, Connaught Place",
      verified: true,
      bio: "Passionate about circular reuse and community healthcare support.",
    },
  });

  // Corporate Donor
  const corpUser = await prisma.user.upsert({
    where: { email: "corp@shareplus.org" },
    update: {},
    create: {
      name: "Apex Tech CSR Foundation",
      email: "corp@shareplus.org",
      passwordHash,
      role: Role.ORGANIZATION,
      city: "Bengaluru",
      phone: "+91 80 4455 6677",
      address: "Outer Ring Road, Bellandur",
      verified: true,
      bio: "Donating decommissioned enterprise IT hardware to underserved rural schools.",
    },
  });

  // NGO 1: Hope Horizon Foundation
  const ngoUser1 = await prisma.user.upsert({
    where: { email: "ngo@hopefoundation.org" },
    update: {},
    create: {
      name: "Dr. Ananya Roy",
      email: "ngo@hopefoundation.org",
      passwordHash,
      role: Role.NGO,
      city: "New Delhi",
      phone: "+91 98711 55660",
      address: "Plot 12, Institutional Area, Vasant Kunj",
      verified: true,
    },
  });

  const ngoProfile1 = await prisma.nGOProfile.upsert({
    where: { userId: ngoUser1.id },
    update: {},
    create: {
      userId: ngoUser1.id,
      organizationName: "Hope Horizon Foundation",
      registrationNumber: "80G-DEL-2018-4491",
      missionStatement: "Providing emergency winter relief, shelter essentials, and healthcare mobility to homeless communities across Northern India.",
      contactPerson: "Dr. Ananya Roy",
      sector: "Disaster Relief & Shelters",
      establishedYear: 2018,
      website: "https://hopehorizon.org",
      verificationStatus: VerificationStatus.VERIFIED,
    },
  });

  // NGO 2: Care India Community Aid
  const ngoUser2 = await prisma.user.upsert({
    where: { email: "relief@careindia.org" },
    update: {},
    create: {
      name: "Farhan Siddiqui",
      email: "relief@careindia.org",
      passwordHash,
      role: Role.NGO,
      city: "Mumbai",
      phone: "+91 98200 88990",
      address: "24 Bandra Kurla Complex, Bandra East",
      verified: true,
    },
  });

  const ngoProfile2 = await prisma.nGOProfile.upsert({
    where: { userId: ngoUser2.id },
    update: {},
    create: {
      userId: ngoUser2.id,
      organizationName: "Care India Community Aid",
      registrationNumber: "FCRA-MH-2020-7712",
      missionStatement: "Bridging the digital divide by supplying schools and orphanages with computers, educational tools, and health equipment.",
      contactPerson: "Farhan Siddiqui",
      sector: "Child Welfare & Education",
      establishedYear: 2020,
      website: "https://careindia.org",
      verificationStatus: VerificationStatus.VERIFIED,
    },
  });

  console.log("✓ Demo Users and NGOs seeded");

  // 3. Resources (Donations and Loans)
  const resourcesData = [
    {
      title: "Karma Foldable Wheelchair with Footrests",
      description: "Sturdy aluminum wheelchair with safety brakes, clean cushioned seat, and adjustable footrests. Ideal for a patient in home rehabilitation.",
      type: ResourceType.DONATION,
      condition: ItemCondition.LIKE_NEW,
      totalQuantity: 2,
      availableQuantity: 2,
      images: ["https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80"],
      categoryId: categoriesMap.get("medical-healthcare").id,
      ownerId: donorUser.id,
      pickupAddress: "Pocket A, Sarita Vihar",
      city: "New Delhi",
      postalCode: "110076",
      latitude: 28.5305,
      longitude: 77.2941,
    },
    {
      title: "Batch of 10 Dell Latitude Laptops (Refurbished)",
      description: "Core i5, 8GB RAM, 256GB SSD with chargers. Freshly wiped with Ubuntu Linux. Great for school computer labs or coaching centers.",
      type: ResourceType.DONATION,
      condition: ItemCondition.GOOD,
      totalQuantity: 10,
      availableQuantity: 10,
      images: ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80"],
      categoryId: categoriesMap.get("education-tech").id,
      ownerId: corpUser.id,
      pickupAddress: "Tech Hub, Electronic City",
      city: "Bengaluru",
      postalCode: "560100",
      latitude: 12.8399,
      longitude: 77.677,
    },
    {
      title: "Bosch Heavy-Duty Rotary Hammer Drill",
      description: "Professional grade 800W rotary drill kit with masonry bits. Available for 14-day free community loan for shelter construction or community garden work.",
      type: ResourceType.LOAN,
      condition: ItemCondition.LIKE_NEW,
      totalQuantity: 1,
      availableQuantity: 1,
      loanDurationDays: 14,
      depositRequired: false,
      images: ["https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80"],
      categoryId: categoriesMap.get("tools-equipment").id,
      ownerId: donorUser.id,
      pickupAddress: "Sector 14, Rohini",
      city: "New Delhi",
      postalCode: "110085",
      latitude: 28.7188,
      longitude: 77.1264,
    },
    {
      title: "50 Fleece Winter Blankets (Single Bed)",
      description: "Warm, thick synthetic fleece blankets, clean and individually poly-wrapped. Ready for immediate relief distribution to cold shelters.",
      type: ResourceType.DONATION,
      condition: ItemCondition.NEW,
      totalQuantity: 50,
      availableQuantity: 50,
      images: ["https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80"],
      categoryId: categoriesMap.get("clothing-warmth").id,
      ownerId: corpUser.id,
      pickupAddress: "14 Industrial Estate, Okhla Phase 3",
      city: "New Delhi",
      postalCode: "110020",
      latitude: 28.5355,
      longitude: 77.2687,
    },
    {
      title: "Philips Compact Home Nebulizer Machine",
      description: "Clean medical nebulizer with adult and pediatric masks and sterile tubing. Available for 30-day loan for patients with respiratory asthma.",
      type: ResourceType.LOAN,
      condition: ItemCondition.LIKE_NEW,
      totalQuantity: 3,
      availableQuantity: 3,
      loanDurationDays: 30,
      images: ["https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80"],
      categoryId: categoriesMap.get("medical-healthcare").id,
      ownerId: donorUser.id,
      pickupAddress: "Lajpat Nagar 4",
      city: "New Delhi",
      postalCode: "110024",
      latitude: 28.5678,
      longitude: 77.2433,
    },
    {
      title: "Box of 40 Children Storybooks & Encyclopedias",
      description: "Illustrated English and Hindi storybooks, science encyclopedias, and math practice workbooks suitable for ages 6 to 14.",
      type: ResourceType.DONATION,
      condition: ItemCondition.GOOD,
      totalQuantity: 5,
      availableQuantity: 5,
      images: ["https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80"],
      categoryId: categoriesMap.get("education-tech").id,
      ownerId: donorUser.id,
      pickupAddress: "Indiranagar 100 Feet Road",
      city: "Bengaluru",
      postalCode: "560038",
      latitude: 12.9716,
      longitude: 77.6412,
    },
  ];

  for (const r of resourcesData) {
    await prisma.resource.create({
      data: {
        ...r,
        status: "AVAILABLE",
      },
    });
  }
  console.log("✓ Resources seeded:", resourcesData.length);

  // 4. NGO Requirements Campaigns
  const req1 = await prisma.resourceRequirement.create({
    data: {
      title: "80 Winter Blankets for Night Shelters in Yamuna Khadar",
      description: "With temperatures dropping below 6°C in Delhi, our night rescue team is distributing heavy winter blankets to families living in makeshift tarpaulin tents.",
      ngoProfileId: ngoProfile1.id,
      categoryId: categoriesMap.get("clothing-warmth").id,
      urgency: UrgencyLevel.CRITICAL,
      targetQuantity: 80,
      collectedQuantity: 35,
      unit: "blankets",
      deliveryAddress: "Hope Horizon Community Center, Kashmere Gate Shelter Point",
      city: "New Delhi",
      status: RequirementStatus.PARTIALLY_FULFILLED,
      latitude: 28.6667,
      longitude: 77.2273,
    },
  });

  const req2 = await prisma.resourceRequirement.create({
    data: {
      title: "15 Refurbished Desktops or Laptops for Vocational Girls Center",
      description: "We are setting up a basic computer literacy and coding lab for 60 adolescent girls in Dharavi. Any functional dual-core or quad-core systems with chargers are warmly welcomed.",
      ngoProfileId: ngoProfile2.id,
      categoryId: categoriesMap.get("education-tech").id,
      urgency: UrgencyLevel.HIGH,
      targetQuantity: 15,
      collectedQuantity: 6,
      unit: "laptops",
      deliveryAddress: "Care India Learning Lab, 90 Feet Road, Dharavi",
      city: "Mumbai",
      status: RequirementStatus.PARTIALLY_FULFILLED,
      latitude: 19.0434,
      longitude: 72.8567,
    },
  });

  const req3 = await prisma.resourceRequirement.create({
    data: {
      title: "100 Clean First Aid & Hygiene Kits for Flood Relief",
      description: "Each kit includes bandages, antiseptic solution, ORS packets, soaps, and water purification tablets for monsoon flood-affected rural hamlets.",
      ngoProfileId: ngoProfile1.id,
      categoryId: categoriesMap.get("medical-healthcare").id,
      urgency: UrgencyLevel.HIGH,
      targetQuantity: 100,
      collectedQuantity: 100,
      unit: "kits",
      deliveryAddress: "Relief Transit Depot, Sector 62, Noida",
      city: "New Delhi",
      status: RequirementStatus.COMPLETED,
      latitude: 28.628,
      longitude: 77.3649,
    },
  });

  // 5. Inbound Fulfillments Pledges
  await prisma.requirementFulfillment.create({
    data: {
      requirementId: req1.id,
      donorId: donorUser.id,
      quantityPledged: 20,
      quantityReceived: 20,
      deliveryType: DeliveryType.DROP_OFF,
      status: FulfillmentStatus.VERIFIED,
      notes: "Dropped off at Kashmere Gate shelter on Sunday evening.",
    },
  });

  await prisma.requirementFulfillment.create({
    data: {
      requirementId: req1.id,
      donorId: corpUser.id,
      quantityPledged: 15,
      deliveryType: DeliveryType.PICKUP_REQUEST,
      status: FulfillmentStatus.PLEDGED,
      notes: "Packed in carton boxes, ready for pickup from our Delhi branch office.",
    },
  });

  await prisma.requirementFulfillment.create({
    data: {
      requirementId: req2.id,
      donorId: corpUser.id,
      quantityPledged: 6,
      quantityReceived: 6,
      deliveryType: DeliveryType.DROP_OFF,
      status: FulfillmentStatus.VERIFIED,
      notes: "Dell Latitude laptops shipped via corporate courier.",
    },
  });

  await prisma.requirementFulfillment.create({
    data: {
      requirementId: req3.id,
      donorId: donorUser.id,
      quantityPledged: 100,
      quantityReceived: 100,
      deliveryType: DeliveryType.DROP_OFF,
      status: FulfillmentStatus.VERIFIED,
      notes: "Fully funded and packed 100 sterile medical relief packs.",
    },
  });

  console.log("✓ NGO Requirements and Donor Pledges seeded");
  console.log("🎉 Seeding complete successfully!");
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
