import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function BackButton({ href = "/" }: { href?: string }) {
	return (
		<Link
			href={href}
			className="btn h-12 min-h-12 rounded-2xl border-base-300 bg-base-200 px-5 text-base 
      font-semibold text-base-content shadow-none hover:border-base-300 hover:bg-base-300/60"
		>
			<ArrowLeft className="h-4 w-4" />
			Back to Home
		</Link>
	);
}
