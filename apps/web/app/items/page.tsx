import { apiFetch } from "@/lib/api/client";

type Item = { id: string; name: string };

export default async function ItemsPage() {
  const items = await apiFetch<Item[]>("/items");

  return (
    <main className="p-8">
      <h1 className="text-2xl font-semibold">Items</h1>
      <ul className="mt-4 space-y-1">
        {items.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </main>
  );
}

export const instant = false;