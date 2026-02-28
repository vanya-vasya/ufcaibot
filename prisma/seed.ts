import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const users = [
  {
    id: "mhg7zx50dmru8wqfo35",
    clerkId: "user_34sMPWL0tpWI7ms57WD80K9nzwm",
    email: "vladimir.serushko@gmail.com",
    photo: "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18zNHNNUFY4Vm9BWmVuNUJXZW5saElGVDA4NUcifQ",
    firstName: "Vladimir",
    lastName: "Serushko",
    usedGenerations: 335,
    availableGenerations: 500,
    createdAt: new Date("2025-11-01 11:50:01.851395"),
    updatedAt: new Date("2025-11-06 11:15:21.983192"),
  },
  {
    id: "mhls3jvo691dlercepa",
    clerkId: "user_353LdA0DJa6xoX5lBSGMdnDbM91",
    email: "themaratelli@gmail.com",
    photo: "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18zNTNMZDNZNnZnR0c2WjJGRXdWcDFnb1Bub1gifQ",
    firstName: "Maratelli`s",
    lastName: "Team",
    usedGenerations: 0,
    availableGenerations: 20,
    createdAt: new Date("2025-11-05 09:11:34.489463"),
    updatedAt: new Date("2025-11-05 09:11:35.250509"),
  },
];

const transactions = [
  {
    id: "mhg7zx58e5ag9l4xjm",
    tracking_id: "user_34sMPWL0tpWI7ms57WD80K9nzwm",
    userId: "user_34sMPWL0tpWI7ms57WD80K9nzwm",
    status: "completed",
    amount: 20,
    currency: null,
    description: null,
    type: "credit",
    payment_method_type: null,
    message: null,
    paid_at: new Date("2025-11-01 11:50:01.851395"),
    receipt_url: null,
    createdAt: new Date("2025-11-01 11:50:01.851395"),
    reason: "signup bonus",
    webhookEventId: "user_34sMPWL0tpWI7ms57WD80K9nzwm",
  },
  {
    id: "mhg80sbxydncoz4vnpm",
    tracking_id: "218fbb54-9949-4551-8d2f-ea25f20610bf",
    userId: "user_34sMPWL0tpWI7ms57WD80K9nzwm",
    status: "successful",
    amount: 250,
    currency: "EUR",
    description: "Zinvero Generations Purchase (50 Tokens)",
    type: "payment",
    payment_method_type: "credit_card",
    message: "Transaction is successful.",
    paid_at: new Date("2025-11-01 11:50:41.482"),
    receipt_url: null,
    createdAt: new Date("2025-11-01 11:50:42.284617"),
    reason: null,
    webhookEventId: "218fbb54-9949-4551-8d2f-ea25f20610bf",
  },
  {
    id: "mhls3jvxg6sntzvw85i",
    tracking_id: "user_353LdA0DJa6xoX5lBSGMdnDbM91",
    userId: "user_353LdA0DJa6xoX5lBSGMdnDbM91",
    status: "completed",
    amount: 20,
    currency: null,
    description: null,
    type: "credit",
    payment_method_type: null,
    message: null,
    paid_at: new Date("2025-11-05 09:11:34.489463"),
    receipt_url: null,
    createdAt: new Date("2025-11-05 09:11:34.489463"),
    reason: "signup bonus",
    webhookEventId: "user_353LdA0DJa6xoX5lBSGMdnDbM91",
  },
];

const main = async () => {
  console.log("Seeding users...");
  for (const user of users) {
    await prisma.user.upsert({
      where: { clerkId: user.clerkId },
      update: user,
      create: user,
    });
  }

  console.log("Seeding transactions...");
  for (const tx of transactions) {
    await prisma.transaction.upsert({
      where: { id: tx.id },
      update: tx,
      create: tx,
    });
  }

  console.log("Done!");
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
