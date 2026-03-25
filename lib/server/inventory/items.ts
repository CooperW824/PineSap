export type InventoryItem = {
  id: string;
  title: string;
  description: string;
  location: string;
  quantity: number;
  purchasedFrom: string;
  priorCost: string;
  priorVendor: string;
  requestedBy: string;
  approvedBy: string;
  imageUrl: string | null;
};

const locations = [
  "Storage Unit 1",
  "Storage Unit 2",
  "Storage Unit 3",
  "Storage Unit 4",
  "Storage Unit 5",
];

const inventoryItems: InventoryItem[] = Array.from({ length: 25 }, (_, index) => {
  const itemNumber = index + 1;
  const quantity = (index + 1) * 2; //stupid quantity count for now

  return {
    id: `item-${itemNumber}`,
    title: `Item ${itemNumber}`,
    description:
      index % 2 === 0
        ? "Short description"
        : "THIS IS A LONG ITEM DESCRIPTION I WANT TO TEST IF IT WILL WORK WITH A LOT OF TEXT SO THAT THE SPACING IS OKAHLAKSNH...askjdhaoksdhkasdhbakjhbdkasjhdkiajhd...",
    location: locations[Math.floor(index / 5)],
    quantity,
    purchasedFrom: "Fill this in later w/ db items",
    priorCost: `$${(itemNumber * 8.75).toFixed(2)}`, //just stupid price calc for now
    priorVendor: "Fill this in later w/ db items",
    requestedBy: "Fill this in later w/ db items",
    approvedBy: "Fill this in later w/ db items",
    imageUrl: null,
  };
});

export function getInventoryItems(): InventoryItem[] {
  return inventoryItems;
}

export function getInventoryItemById(itemId: string): InventoryItem | undefined {
  return inventoryItems.find((item) => item.id === itemId);
}
