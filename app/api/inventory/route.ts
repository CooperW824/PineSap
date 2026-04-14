import { PersistedItem } from "@/lib/server/DatabaseModels/item";

export async function GET(request: Request) {
  const { page = "1", limit = "10" } = Object.fromEntries(
    new URL(request.url).searchParams,
  );

  const count = await PersistedItem.count();
  const items = await PersistedItem.list(Number(limit), Number(page));

  return new Response(JSON.stringify({ items, count }), { status: 200 });
}
