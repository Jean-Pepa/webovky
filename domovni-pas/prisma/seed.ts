import { PrismaClient } from "../src/generated/prisma";
import { hashPassword } from "../src/lib/password";

const prisma = new PrismaClient();

async function main() {
  // Čistý start (idempotentní seed)
  await prisma.transferLog.deleteMany();
  await prisma.access.deleteMany();
  await prisma.attachment.deleteMany();
  await prisma.document.deleteMany();
  await prisma.entry.deleteMany();
  await prisma.property.deleteMany();
  await prisma.user.deleteMany();

  const pwd = hashPassword("heslo123");

  const owner = await prisma.user.create({
    data: {
      name: "Jana Nováková",
      email: "majitel@domovnipas.cz",
      passwordHash: pwd,
      role: "OWNER",
    },
  });

  const architect = await prisma.user.create({
    data: {
      name: "Ateliér Kořínek",
      email: "architekt@domovnipas.cz",
      passwordHash: pwd,
      role: "PROFESSIONAL",
    },
  });

  // Nemovitost majitele s bohatou historií
  const house = await prisma.property.create({
    data: {
      name: "Rodinný dům Říčany",
      type: "HOUSE",
      street: "Lipová 482",
      city: "Říčany",
      zip: "25101",
      cadastralArea: "Říčany u Prahy",
      parcelNumber: "1284/7",
      yearBuilt: 2009,
      description: "Dvoupodlažní cihlový dům, zateplený, plynový kotel.",
      ownerId: owner.id,
    },
  });

  await prisma.entry.createMany({
    data: [
      {
        propertyId: house.id,
        type: "INSPECTION",
        title: "Revize plynového kotle",
        description: "Roční servisní prohlídka, kotel v pořádku, vyměněn filtr.",
        date: new Date("2025-10-12"),
        cost: 1800,
        authorId: owner.id,
      },
      {
        propertyId: house.id,
        type: "DEFECT",
        title: "Zatékání u střešního okna",
        description: "Při dešti zatéká kolem rámu střešního okna v ložnici.",
        date: new Date("2025-11-03"),
        authorId: owner.id,
      },
      {
        propertyId: house.id,
        type: "REPAIR",
        title: "Oprava oplechování střešního okna",
        description: "Vyměněno oplechování a přetmeleno, zatékání vyřešeno.",
        date: new Date("2025-11-20"),
        cost: 4500,
        authorId: owner.id,
      },
      {
        propertyId: house.id,
        type: "RENOVATION",
        title: "Rekonstrukce koupelny v patře",
        description: "Nové obklady, sprchový kout, podlahové topení.",
        date: new Date("2024-06-15"),
        cost: 189000,
        authorId: owner.id,
      },
    ],
  });

  await prisma.document.createMany({
    data: [
      {
        propertyId: house.id,
        category: "ENERGY_LABEL",
        title: "Průkaz energetické náročnosti budovy",
        storageKey: "seed-penb.pdf",
        fileName: "PENB_Ricany.pdf",
        mimeType: "application/pdf",
        size: 0,
      },
      {
        propertyId: house.id,
        category: "PLAN",
        title: "Projektová dokumentace – půdorysy",
        storageKey: "seed-plany.pdf",
        fileName: "Pudorysy.pdf",
        mimeType: "application/pdf",
        size: 0,
      },
    ],
  });

  // Architekt (PROFESSIONAL) spravuje více zakázek – demonstruje vícetenantnost
  await prisma.property.create({
    data: {
      name: "Vila Beroun",
      type: "HOUSE",
      street: "Na Stráni 12",
      city: "Beroun",
      zip: "26601",
      yearBuilt: 2025,
      description: "Novostavba, předáno klientovi 03/2026.",
      ownerId: architect.id,
      entries: {
        create: [
          {
            type: "OTHER",
            title: "Předání stavby investorovi",
            description: "Protokol o předání a převzetí stavby, předány klíče a dokumentace.",
            date: new Date("2026-03-01"),
            authorId: architect.id,
          },
        ],
      },
    },
  });

  await prisma.property.create({
    data: {
      name: "Byt Karlín 3+kk",
      type: "APARTMENT",
      street: "Sokolovská 120",
      city: "Praha 8",
      zip: "18600",
      yearBuilt: 2018,
      description: "Rekonstrukce bytu v cihlovém domě.",
      ownerId: architect.id,
    },
  });

  console.log("Seed hotov.");
  console.log("  Majitel:   majitel@domovnipas.cz / heslo123");
  console.log("  Architekt: architekt@domovnipas.cz / heslo123");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
