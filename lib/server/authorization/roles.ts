export type Role = "external" | "member" | "admin";
export const ROLE_HIERARCHY: Record<Role, number> = {
	external: 0,
	member: 1,
	admin: 2,
};
