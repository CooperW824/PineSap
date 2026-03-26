import Link from "next/link";
import { type InventoryItem } from "@/lib/server/inventory/items";

type ItemBoxProps = {
  item: InventoryItem;
};

const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength)}...`;
};

export default function ItemBox({ item }: ItemBoxProps) {
  return (
    <Link
      href={`/item-selection?itemId=${item.id}`}
      className="card bg-base-200 shadow w-full hover:bg-base-300 transition-colors cursor-pointer active:scale-[0.99] block"
    >
      <div className="card-body p-5">
        <div className="flex justify-between items-start gap-4">
          <div className="flex flex-col min-w-0 flex-1">
            <h3 className="card-title text-[15px] m-0 leading-tight">
              {item.title}
            </h3>
            <p className="text-[13px] opacity-70 mt-1 m-0 leading-tight">
              {truncateText(item.description, 82)}
            </p>
          </div>

          <div className="flex flex-col text-right shrink-0">
            <p className="font-semibold text-[15px] m-0 leading-tight">
              {item.location}
            </p>
            <p className="text-[13px] opacity-70 mt-1 m-0 leading-tight">
              Qty: {item.quantity}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
