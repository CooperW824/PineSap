"use client";

export default function AdminClubNameEditor() {
  return (
    <div className="w-full bg-base-100 text-base-content flex">
      <h1 className="text-3xl font-bold mb-4 w-fit text-nowrap mr-4">Club Name</h1>
      <input
        type="text"
        placeholder="New club name"
        className="input input-bordered mx-4 "
      />
      <button className="btn btn-primary">Save</button>
    </div>
  );
}
