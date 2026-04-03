// import { ChevronDown, Plus, RotateCcw, Trash2, UserRound } from "lucide-react";
import Link from "next/link"

// sample requests, delete later
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

        <Link href="/requests/create">
          <button className="btn btn-primary">
            Create Request
          </button>
        </Link>

      </div>
      <div className="space-y-3">
        <div className="mt-6 rounded-2xl bg-base-200 p-6">
          <div className="space-y-4">
            {sampleRequests.map((request) => (
              <Link
                key={request.name}
                href="/requests/view"
                className="block"
              > {/* need to make the link element behave like a block so we can have proper spacing, may not be neccesary
              when we have non-sample requests.*/}
                <div className="card border border-transparent bg-base-300 p-8 shadow transition-all duration-200 cursor-pointer hover:-translate-y-0.5 hover:border-success hover:shadow-lg">
                  
                  <div className="flex justify-between">
                    
                    <div>
                      <p className="font-bold">Name: {request.name}</p>
                      <p>Status: {request.status}</p>
                      <p>Requester: {request.Requester}</p>
                    </div>

                    <div className="text-right">
                      <p>Items: {request.totalItems}</p>
                      <p>Price: {request.totalPrice}</p>
                    </div>

                  </div>

                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
