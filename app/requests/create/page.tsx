import Link from "next/link";
import { Trash2, Pencil } from "lucide-react";

// sample items, delete later
const sampleItems = [
  {
    name: "Rocket Fuel ",
    description: "Stolen Nasa Rocket Fuel (very strong and dangerous)",
    price: "980,000",
    quantity: "45",
  },
  {
    name: "hamburgers",
    description: "i'm hungry",
    price: "15.00",
    quantity: "10",
  },
];

export default function CreateRequestPage() {
  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold">Create Request</h1>

      <div className="mt-6 space-y-6">
        {/* Select project */}
        <select
          className="select select-bordered w-full max-w-xs"
          defaultValue={"Select Project"}
        >
          <option disabled>Select Project</option>
          <option>Rocket Test</option>
          <option>Aquararium Build</option>
          <option>Epic Beehive Project</option>
        </select>

        {/* name */}
        <input
          type="text"
          placeholder="Request Name"
          className="input input-bordered w-full"
        />

        {/* purpose */}
        <textarea
          placeholder="Purpose"
          className="textarea textarea-bordered w-full"
        />

        {/* items */}
        <div className="rounded-2xl bg-base-200 p-6 space-y-4">
          {/* header */}
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Items</h2>

            <button className="btn btn-primary btn-sm">Add New Item</button>
          </div>

          {/* sample items list */}
          <div className="space-y-3">
            {sampleItems.map((item) => (
              <div key={item.name} className="card bg-base-100 shadow p-4">
                <div className="flex justify-between items-center">
                  {/* LEFT SIDE */}
                  <div>
                    <p className="font-bold">{item.name}</p>
                    <p className="text-sm opacity-70">{item.description}</p>
                    <p>Total Price: {item.price}</p>
                    <p>Quantity: {item.quantity}</p>
                  </div>

                  {/* RIGHT SIDE BUTTONS */}
                  <div className="flex gap-2">
                    <button className="btn btn-sm">
                      <Pencil className="h-4 w-4" />
                    </button>

                    <button className="btn btn-sm btn-error">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <Link href="/requests" className="btn btn-outline">
            Cancel
          </Link>
          <button className="btn btn-primary">Submit Request</button>
        </div>
      </div>
    </main>
  );
}
