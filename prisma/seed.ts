import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  const facilities = [
    { name: "MediLink Demo Clinic", type: "Primary care", county: "Nairobi", address: "Westlands, Nairobi", phone: "+254 700 000 000", services: ["General consultation", "Laboratory", "Pharmacy"], openingHours: "Mon-Fri, 8:00-17:00", verified: true },
    { name: "Community Health Hub", type: "Community health centre", county: "Kisumu", address: "Kisumu Central", phone: "+254 711 000 000", services: ["Maternal health", "Outpatient care"], openingHours: "Mon-Sat, 8:00-16:00", verified: false }
  ];
  for (const facility of facilities) await prisma.facility.upsert({ where: { id: facility.name.replace(/\W/g, "-").toLowerCase() }, update: facility, create: { ...facility, id: facility.name.replace(/\W/g, "-").toLowerCase() } });
  console.log("Seeded clearly labeled synthetic demonstration facilities.");
}
main().finally(() => prisma.$disconnect());
