"use client";

import { useState } from "react";

export default function RequestSubmitButton({ requestId }: { requestId: string }) {
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async () => {
        const resp = await fetch(`/api/request/?id=${requestId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ status: "PENDING" }),
        });

        if (resp.ok) {
            window.location.href = "/requests/";
        } else {
            setError("Failed to submit request");
        }
    };

    return (
        <div>
            {error && <p className="text-red-500">{error}</p>}
            <button className="btn btn-primary" onClick={handleSubmit}>
                Submit Request
            </button>
        </div>
    );
}