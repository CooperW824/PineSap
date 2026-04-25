import { PersistedItem } from "@/lib/server/DatabaseModels/item";

/**
 * GET /api/inventory?limit=10&page=1
 *
 * Returns a list of inventory items.
 *
 * Query Parameters:
 * - limit: number of items to return per page (default: 10)
 * - page: page number for pagination (default: 1)
 *
 * @param request The HTTP Request
 * @returns {items: ItemData[], count: number} A list of inventory items and the total count
 */
export async function GET(request: Request) {
	const { page = "1", limit = "10" } = Object.fromEntries(new URL(request.url).searchParams);

	const count = await PersistedItem.count();
	const items = await PersistedItem.list(Number(limit), Number(page));

	return new Response(JSON.stringify({ items, count }), { status: 200 });
}
