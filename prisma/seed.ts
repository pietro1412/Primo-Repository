import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = (process.env.SEED_ADMIN_EMAIL ?? "admin@example.com").toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD ?? "change-me-please";
  await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, name: "Admin", role: "ADMIN", passwordHash: await bcrypt.hash(password, 12) },
  });
  console.log(`Seed ok: admin ${email}`);

  if ((await prisma.category.count({ where: { isCatalog: true } })) === 0) {
    const catalog: Record<string, Record<string, string[]>> = {
      Sport: {
        Tennis: ["Guarda la palla", "Alza il gomito", "Gira le spalle", "Piega le ginocchia"],
        Calcio: ["Testa alta", "Passa e muoviti", "Controllo e guarda"],
        Corsa: ["Respira dal naso", "Spalle rilassate", "Passo leggero"],
      },
      Studio: { Concentrazione: ["Un compito alla volta", "Respira e riparti", "Ora sono qui"] },
    };
    for (const [parentName, kids] of Object.entries(catalog)) {
      const parent = await prisma.category.create({ data: { name: parentName, isCatalog: true } });
      for (const [kidName, phrases] of Object.entries(kids)) {
        await prisma.category.create({
          data: {
            name: kidName,
            isCatalog: true,
            parentId: parent.id,
            mantras: { create: phrases.map((text, position) => ({ text, position })) },
          },
        });
      }
    }
    console.log("Seed ok: catalogo base");
  }
}

main().finally(() => prisma.$disconnect());
