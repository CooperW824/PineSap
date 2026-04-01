import { getInventoryItems, getInventoryItemCount } from "@/lib/server/inventory/items";

export async function GET(request: Request) {
  const { page = "1", limit = "10" } = Object.fromEntries(
    new URL(request.url).searchParams,
  );

  const items = await getInventoryItems(Number(page), Number(limit));
  const count = await getInventoryItemCount();

  return new Response(JSON.stringify({ items, count }), { status: 200 });
}
