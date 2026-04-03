
import Link from "next/link";

// sample items, delete later
const sampleItems = [
  {
    name: "Rocket Fuel ",
    description: "Stolen Nasa Rocket Fuel (very strong and dangerous)",
    price: "980,000",
    quantity: "45",
  },
  {
    name: "hamburgers ( no cheese) ",
    description: "i'm hungry",
    price: "15.00",
    quantity: "10",
  },
]

export default function ViewRequestPage() {
  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold">View Request</h1>

      <div className="mt-6 space-y-6">

        {/* project */}
        <div>
          <p className="text-sm opacity-70">Project</p>
          <p className="text-lg font-semibold">Rocket Club</p>
        </div>

        {/* purpose*/}
        <div>
          <p className="text-sm opacity-70">Purpose</p>
          <p className="text-base">
            We need this very desperately pls pls pls
          </p>
        </div>

        {/* items */}
        <div className="rounded-2xl bg-base-200 p-6 space-y-4">

          {/* header */}
          <h2 className="text-xl font-bold">Items</h2>

          {/* items list */}
          <div className="space-y-3">
            {sampleItems.map((item) => (
              <div
                key={item.name}
                className="card bg-base-100 shadow p-4"
              >
                <div className="flex justify-between items-center">

                  {/* LEFT SIDE */}
                  <div>
                    <p className="font-bold">{item.name}</p>
                    <p className="text-sm opacity-70">
                      {item.description}
                    </p>
                    <p>Total Price: {item.price}</p>
                    <p>Quantity: {item.quantity}</p>
                  </div>

                </div>
              </div>
            ))}
          </div>

        </div>

      <div className="flex gap-3 mt-6">
        <Link href="/requests" className="btn btn-outline">
          Cancel
        </Link>
        <button className="btn btn-success">
          Approve
        </button>

        <button className="btn btn-error">
          Deny
        </button>
      </div>
          
      </div>
    </main>
  )
}
