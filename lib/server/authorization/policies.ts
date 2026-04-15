import { Role, ROLE_HIERARCHY } from "./roles";
import { User } from "@/lib/server/DatabaseModels/user";

function hasAccess(user: User, requiredRole: Role): boolean {
	return ROLE_HIERARCHY[user.role] >= ROLE_HIERARCHY[requiredRole];
}

export class RequestPolicy {
	private user: User;

	constructor(user: User) {
		this.user = user;
	}

	canView(): boolean {
		return hasAccess(this.user, "member");
	}

	canSubmit(): boolean {
		return hasAccess(this.user, "member");
	}

	canReview(requestReviewers: string[]): boolean {
		return requestReviewers.includes(this.user.email);
	}

	canEdit(requestOwner: User): boolean {
		return requestOwner.id === this.user.id;
	}

	canDelete(requestOwner: User): boolean {
		return hasAccess(this.user, "admin") || requestOwner.id === this.user.id;
	}
}

export class UserManagementPolicy {
	private user: User;

	constructor(user: User) {
		this.user = user;
	}

	canView(): boolean {
		return hasAccess(this.user, "admin");
	}

	canChangeRole(): boolean {
		return hasAccess(this.user, "admin");
	}

	canResetPassword(): boolean {
		return hasAccess(this.user, "admin");
	}

	canDelete(): boolean {
		return hasAccess(this.user, "admin");
	}

	canCreate(): boolean {
		return hasAccess(this.user, "admin");
	}
}

export class ItemPolicy {
	private user: User;

	constructor(user: User) {
		this.user = user;
	}

	canEdit(): boolean {
		return hasAccess(this.user, "admin");
	}
}