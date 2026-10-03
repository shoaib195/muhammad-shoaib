import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { projects } from "../src/site/projects";
import { experience } from "../src/variations/elian/data";
import { about, experienceDetails, stats, contactAside } from "../src/site/content";
import { site } from "../src/variations/elian/data";

const prisma = new PrismaClient();

async function connectWithRetry(attempts = 5) {
  for (let i = 1; i <= attempts; i++) {
    try {
      await prisma.$connect();
      return;
    } catch (err) {
      if (i === attempts) throw err;
      const wait = i * 2000;
      console.warn(`DB not ready (attempt ${i}/${attempts}), retry in ${wait}ms…`);
      await new Promise((r) => setTimeout(r, wait));
    }
  }
}

async function main() {
  await connectWithRetry();

  const email = "shoaib.octachat@gmail.com";
  const password = "Admin123@@";
  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.upsert({
    where: { email },
    create: { email, passwordHash, name: "Muhammad Shoaib" },
    update: { passwordHash, name: "Muhammad Shoaib" },
  });
  console.log("Admin user ready:", email);

  for (const [i, p] of projects.entries()) {
    await prisma.project.upsert({
      where: { id: p.id },
      create: {
        id: p.id,
        name: p.name,
        tagline: p.tagline,
        category: p.category,
        challenge: p.challenge,
        platform: p.platform,
        period: p.period,
        company: p.company,
        cover: p.cover,
        images: p.images,
        overview: p.overview,
        what: p.what,
        role: p.role,
        tech: p.tech,
        features: p.features,
        impact: p.impact ?? [],
        liveUrl: p.links?.live ?? null,
        sourceUrl: p.links?.source ?? null,
        status: p.status ?? null,
        sortOrder: i,
        published: true,
      },
      update: {
        name: p.name,
        tagline: p.tagline,
        overview: p.overview,
        tech: p.tech,
        sortOrder: i,
      },
    });
  }
  console.log(`Seeded ${projects.length} projects`);

  const existingExp = await prisma.experience.count();
  if (existingExp === 0) {
    for (const [i, e] of experience.entries()) {
      const details = experienceDetails[e.company];
      await prisma.experience.create({
        data: {
          role: e.role,
          company: e.company,
          years: e.years,
          highlights: e.highlights,
          summary: details?.summary ?? "",
          stack: details?.stack ?? [],
          outcomes: details?.outcomes ?? [],
          sortOrder: i,
        },
      });
    }
    console.log(`Seeded ${experience.length} experiences`);
  }

  await prisma.siteSetting.upsert({
    where: { key: "site" },
    create: { key: "site", value: site as object },
    update: { value: site as object },
  });
  await prisma.siteSetting.upsert({
    where: { key: "about" },
    create: { key: "about", value: about as object },
    update: { value: about as object },
  });
  await prisma.siteSetting.upsert({
    where: { key: "stats" },
    create: { key: "stats", value: stats as object },
    update: { value: stats as object },
  });
  await prisma.siteSetting.upsert({
    where: { key: "contactAside" },
    create: { key: "contactAside", value: contactAside as object },
    update: { value: contactAside as object },
  });

  const { defaultLanding, LANDING_SETTING_KEY } = await import("../src/site/cms/defaults");
  const existingLanding = await prisma.siteSetting.findUnique({ where: { key: LANDING_SETTING_KEY } });
  if (!existingLanding) {
    await prisma.siteSetting.create({
      data: { key: LANDING_SETTING_KEY, value: defaultLanding as object },
    });
    console.log("Landing CMS seeded from current homepage content");
  } else {
    console.log("Landing CMS already present — left unchanged");
  }
  console.log("Site settings ready");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
