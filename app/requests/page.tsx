// import { ChevronDown, Plus, RotateCcw, Trash2, UserRound } from "lucide-react";

const sampleRequests = [
  {
    name: "the most important purchase",
    totalItems: "1",
    totalPrice: "67",
    Requester: "Important guy",
    status: "APROVED",
  },
  {
    name: "PLEASE WE NEED THIS",
    totalItems: "999",
    totalPrice: "0.03",
    Requester: "not important guy",
    status: "DENIED",
  },
];

export default function RequestsPage() {
  return (
    <main className="p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Requests</h1>

        <button className="btn btn-primary mt-4">
          Create Request
        </button>
      </div>
      <div className="space-y-3">
        {sampleRequests.map((request) => (
        <div className="mt-6 space-y-4">
          <div className="card bg-base-200 shadow p-8">
            <div className="flex justify-between">
              
              {/* LEFT SIDE */}
              <div>
                <p className="font-bold">Name: {request.name}</p>
                <p>Status: {request.status}</p>
                <p>Requester: {request.Requester}</p>
              </div>

              {/* RIGHT SIDE */}
              <div className="text-right">
                <p>Items: {request.totalItems}</p>
                <p>Price: {request.totalPrice} $ </p>
              </div>

            </div>
          </div>
        </div>
        ))}
      </div>
    </main>
  )
}