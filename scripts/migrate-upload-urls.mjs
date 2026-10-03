import { PrismaClient } from "@prisma/client";

const p = new PrismaClient();

function rewrite(url) {
  if (typeof url !== "string") return url;
  return url.replace(/^\/uploads\//, "/media/");
}

const projects = await p.project.findMany({
  select: { id: true, cover: true, images: true },
});

let updated = 0;
for (const row of projects) {
  const cover = rewrite(row.cover);
  const images = (row.images || []).map(rewrite);
  const changed = cover !== row.cover || JSON.stringify(images) !== JSON.stringify(row.images);
  if (!changed) continue;
  await p.project.update({
    where: { id: row.id },
    data: { cover, images },
  });
  updated += 1;
  console.log(`updated ${row.id}`, { cover, images });
}

// Landing CMS may also store /uploads paths
const landing = await p.siteSetting.findUnique({ where: { key: "landing" } });
if (landing?.value) {
  const raw = JSON.stringify(landing.value);
  const next = raw.replaceAll("/uploads/", "/media/");
  if (next !== raw) {
    await p.siteSetting.update({
      where: { key: "landing" },
      data: { value: JSON.parse(next) },
    });
    console.log("updated landing CMS image paths");
  }
}

console.log(`done. projects updated: ${updated}`);
await p.$disconnect();
