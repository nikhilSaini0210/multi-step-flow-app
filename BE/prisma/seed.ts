import { PrismaClient } from "@prisma/client/extension";

const prisma = new PrismaClient();

const main = async () => {
  console.log("🌱 Seeding database…");

  await prisma.progressEvent.deleteMany();
  await prisma.session.deleteMany();

  const session = await prisma.session.create({
    data: {
      id: "seed-session-001",
      currentStepIndex: 2,
      totalSteps: 4,
      answersJson: JSON.stringify({
        ageRange: "25-34",
        goal: "fitness",
        activityLevel: "moderate",
      }),
      events: {
        create: [
          {
            stepIndex: 0,
            eventType: "step_saved",
            answersSnapshot: JSON.stringify({ ageRange: "25-34" }),
          },
          {
            stepIndex: 1,
            eventType: "step_saved",
            answersSnapshot: JSON.stringify({
              ageRange: "25-34",
              goal: "fitness",
            }),
          },
        ],
      },
    },
  });

  console.log(`✅ Created session: ${session.id}`);
  console.log("✅ Seeding complete");
};

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
