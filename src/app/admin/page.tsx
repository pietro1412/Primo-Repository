import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminPage() {
  await requireUser("ADMIN");
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "asc" },
    select: { id: true, email: true, role: true },
  });
  return (
    <div>
      <h1 className="text-2xl font-bold">Admin</h1>
      <ul className="mt-4 text-sm">
        {users.map((u) => (
          <li key={u.id}>
            {u.email} — {u.role}
          </li>
        ))}
      </ul>
    </div>
  );
}
