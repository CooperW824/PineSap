"use client"; // RESOLVED: Client component because it handles open/close state

type Props = {
	open: boolean;
	title: string;
	children: React.ReactNode;
	onClose: () => void;
	actions?: React.ReactNode;
};

export default function Modal({ open, title, children, onClose, actions }: Props) {
	if (!open) return null; // RESOLVED: Modal only renders when open

	return (
		<dialog className="modal modal-open">
			<div className="modal-box bg-base-100 text-base-content">
				<h3 className="text-lg font-bold mb-4">{title}</h3>
				{children}
				<div className="modal-action">
					<button className="btn" onClick={onClose}>
						Cancel
					</button>
					{actions}
					{/* RESOLVED: Modal content and actions are customizable for reuse */}
				</div>
			</div>
		</dialog>
	);
}
