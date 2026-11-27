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
