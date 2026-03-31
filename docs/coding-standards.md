# PineSap Coding Standards

This document outlines how we write and organize code on PineSap. The goal isn't to be rigid — it's to keep the codebase consistent enough that anyone on the team can jump into any file and feel at home. If something isn't covered here, use your best judgment and bring it up so we can add it.

---

## File & Folder Structure

We follow the Next.js App Router conventions. Keep things close to where they're used — don't abstract prematurely.

```
app/                              # Next.js routes and layouts
    components/                   # Shared UI components
lib/                              # Utility functions and shared logic
    server/                       # Backend Logic and Database Wrapper Classes
        authorization/policies/   # Authorization policy classes (one class per resource)
    client/                       # Front End Utilities
generated/                        # Auto-generated files (Prisma, etc.) — don't edit manually
```

- One component or class per file. Don't bundle unrelated things together.
- Keep policy files grouped by resource: `policies/RequestPolicy.ts`, `policies/UserManagementPolicy.ts`, etc.
- Co-locate tests with the file they test: `UserManagementPolicy.test.ts` lives next to `UserManagementPolicy.ts`.

---

## Naming Conventions

| Thing                    | Convention                | Example                     |
| ------------------------ | ------------------------- | --------------------------- |
| Files (components)       | PascalCase                | `UserTable.tsx`             |
| Files (utilities/lib)    | camelCase                 | `hasAccess.ts`              |
| React components         | PascalCase                | `UserTable`                 |
| Classes                  | PascalCase                | `Authorizer`                |
| Interfaces               | PascalCase, no `I` prefix | `User`, `Request`           |
| Functions & variables    | camelCase                 | `canSubmit`, `requestOwner` |
| Constants                | SCREAMING_SNAKE_CASE      | `ROLE_HIERARCHY`            |
| Types/type aliases       | PascalCase                | `Role`                      |
| Database models (Prisma) | PascalCase singular       | `User`, `InventoryItem`     |

A few specific rules:

- Boolean variables and functions should read as a yes/no question: `canEdit()`, `isAdmin`, `hasAccess()`.
- Don't abbreviate unless it's universally obvious (`id`, `url`, `api` are fine — `usrMgmt` is not).
- Avoid generic names like `data`, `info`, `obj`, `temp`. Name things for what they actually are.

---

## Code Style & Formatting

We use **Prettier** and **ESLint**. If your editor isn't running these on save, set that up — don't rely on CI to catch formatting.

### General rules

- **TypeScript strict mode is on.** No `any` unless you have a very good reason and leave a comment explaining it.
- Prefer `const` over `let`. Only use `let` if the value actually needs to change.
- No unused variables or imports — ESLint will catch these, don't suppress the warning without a comment.
- Prefer early returns over deeply nested conditionals:

```typescript
// ❌ Avoid
function canEdit(requestOwner: User): boolean {
  if (hasAccess(this.user, "member")) {
    if (requestOwner.getId() === this.user.getId()) {
      return true;
    }
  }
  return false;
}

// ✅ Prefer
function canEdit(requestOwner: User): boolean {
  if (!hasAccess(this.user, "member")) return false;
  return requestOwner.getId() === this.user.getId();
}
```

### React / Next.js specifics

- Use server components by default. Only add `"use client"` when you actually need interactivity or browser APIs.
- Don't put business logic in components. Components should call server actions or pass data down — not query the database directly or contain auth logic.
- Keep components focused. If a component is getting long, it probably needs to be split.

### Comments

- Write comments for _why_, not _what_. The code already says what it does.
- JSDoc comments on all public-facing classes, interfaces, and non-obvious functions.
- TODO comments are fine, but include your name and a brief description: `// TODO(cooper): revisit after BetterAuth session refactor`

---

## Error Handling

- **Never swallow errors silently.** No empty `catch` blocks.
- Server actions should return a result object rather than throwing directly to the client:

```typescript
// ✅ Prefer this pattern for server actions
type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };
```

- Use specific error messages. "Something went wrong" is not useful. "User not found with id: {id}" is.
- Log errors server-side before returning a sanitized message to the client. Don't leak stack traces or internal details to the frontend.
- For `DatabaseObject` subclasses, constructors should throw a typed error (e.g. `NotFoundError`) if the record doesn't exist, so callers can handle it explicitly rather than getting `undefined` behavior.

---

## Git & PR Workflow

### Branches

- Branch off `main` for all work.
- Branch naming: `<type>/<short-description>`
  - `feat/user-management-ui`
  - `fix/request-delete-auth`
  - `chore/update-dependencies`
  - `refactor/authorizer-pattern`

### Commits

Use descriptive commit messages:

```
add role change confirmation dialog
correct canDelete logic for request owners
upgrade Prisma to 5.x
move auth logic into policy classes
```

Keep commits focused. One logical change per commit — don't bundle a bug fix and a refactor into the same commit.

### Pull Requests

- Every change goes through a PR, no direct pushes to `main`.
- Write a short description of _what_ changed and _why_. Link to the relevant issue if one exists.
- At least **one approval** required before merging.
- Resolve all comments before merging — don't just click "resolve" without addressing the feedback.

### Code Review Etiquette

- Be specific and constructive. "This could be cleaner" isn't feedback — "consider using an early return here to reduce nesting" is.
- Distinguish between blocking issues and suggestions. Use `nit:` prefix for non-blocking style preferences.
- Review the logic, not just the style. Prettier handles style.
