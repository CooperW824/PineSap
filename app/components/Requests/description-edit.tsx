"use client";

import { useState } from "react";

export default function RequestDecriptionEdit({ description, requestId }: { description: string; requestId: string }) {
    const [requestDescription, setRequestDescription] = useState(description);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async () => {
        fetch(`/api/request/?id=${requestId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ purpose: requestDescription }),
        }).catch((err) => {
            setError("Failed to update request description");
        });
    };

    return (
        <div>
            <textarea
                placeholder="Request Description"
                className="textarea textarea-bordered w-full"
                value={requestDescription}
                onChange={(e) => setRequestDescription(e.target.value)}
                onBlur={handleSubmit}
            />
            {error && <p className="text-red-500">{error}</p>}
        </div>
    );
}
