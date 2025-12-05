# {{projectName}}

A modern Next.js 16 application built with Clean Architecture and Domain-Driven Design (DDD) principles.

## Tech Stack

- **Framework**: Next.js 16 (App Router) + React 19
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **State Management**:
  - Zustand (Client state)
  - React Query (Server state)
- **Testing**:
  - Jest (Unit/Integration tests)
  - Playwright (E2E tests)
  - React Testing Library
- **Code Quality**:
  - ESLint
  - Prettier
  - Husky + lint-staged
- **Build Tool**: Turbopack

## Architecture

This project follows **Clean Architecture** and **Domain-Driven Design (DDD)** patterns:

```
src/
├── modules/              # Feature modules
│   └── users/
│       ├── domain/       # Business logic (entities, value objects)
│       ├── application/  # Use cases
│       ├── infrastructure/ # External dependencies (API clients)
│       └── presentation/  # UI components, hooks, stores
├── shared/              # Shared utilities
│   ├── components/      # Reusable UI components
│   ├── hooks/          # Custom React hooks
│   ├── libs/           # Utilities and helpers
│   ├── stores/         # Global Zustand stores
│   ├── errors/         # Error handling system
│   ├── config/         # Configuration (env variables)
│   └── infrastructure/ # Shared infrastructure (HTTP client)
└── app/                # Next.js App Router pages
```

### Key Principles

1. **Separation of Concerns**: Each layer has a specific responsibility
2. **Dependency Rule**: Dependencies point inward (domain has no external dependencies)
3. **Test-Driven**: Co-located tests with the code they test
4. **Type Safety**: Strict TypeScript configuration

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:

```env
NEXT_PUBLIC_APP_NAME={{projectName}}
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_ENABLE_DEVTOOLS=true
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Available Scripts

### Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Testing

- `npm test` - Run unit/integration tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate test coverage report
- `npm run test:e2e` - Run E2E tests with Playwright
- `npm run test:e2e:ui` - Run E2E tests with UI
- `npm run test:e2e:debug` - Debug E2E tests

## Environment Variables

### Public Variables (Client-side)

- `NEXT_PUBLIC_APP_NAME` - Application name
- `NEXT_PUBLIC_API_URL` - API base URL
- `NEXT_PUBLIC_ENABLE_DEVTOOLS` - Enable React Query DevTools

### Server Variables

- `DATABASE_URL` - Database connection string
- `API_SECRET_KEY` - API secret key

Environment files:

- `.env.local` - Local development (gitignored)
- `.env.development` - Development environment
- `.env.production` - Production environment
- `.env.test` - Test environment
- `.env.example` - Example template

## State Management

### Zustand (Client State)

Used for UI state like modals, filters, theme:

```typescript
import { useUserStore } from '@/modules/users/presentation/stores/userStore'

function Component() {
  const search = useUserStore.use.search()
  const setSearch = useUserStore.use.setSearch()

  return <input value={search} onChange={(e) => setSearch(e.target.value)} />
}
```

### React Query (Server State)

Used for API data fetching and caching:

```typescript
import { useUsers } from '@/modules/users/presentation/hooks/useUsers'

function Component() {
  const { data, isLoading } = useUsers.useGetAll()

  if (isLoading) return <div>Loading...</div>

  return <div>{data.map(user => <div key={user.id}>{user.name}</div>)}</div>
}
```

## HTTP Client

Centralized HTTP client with interceptors:

```typescript
import { httpClient } from "@/infrastructure/api";

// GET request
const data = await httpClient.get<User[]>("/users");

// POST request
const newUser = await httpClient.post<User>("/users", { name: "John" });

// With query params
const filtered = await httpClient.get("/users", {
  params: { status: "active" },
});
```

### Request/Response Interceptors

```typescript
// Add auth token
httpClient.addRequestInterceptor((config) => {
  config.headers = {
    ...config.headers,
    Authorization: `Bearer ${token}`,
  };
  return config;
});

// Handle errors globally
httpClient.addResponseInterceptor(
  (response) => response,
  (error) => {
    if (error.status === 401) {
      // Redirect to login
    }
    throw error;
  },
);
```

## Error Handling

### Global Error Handler

Centralized error handling with severity levels:

```typescript
import { errorHandler } from "@/errors";

try {
  await someOperation();
} catch (error) {
  errorHandler.handle(error, { context: "User creation" });
}
```

### Error Boundary

Catches React rendering errors:

```tsx
<ErrorBoundary fallback={<CustomError />}>
  <YourComponent />
</ErrorBoundary>
```

> **Note**: Toast notifications will be configured later using a UI library.

## Testing

### Unit Tests

Co-located with the code they test:

```
src/modules/users/domain/entities/__tests__/User.test.ts
src/modules/users/application/use-cases/__tests__/CreateUserUseCase.test.ts
```

### Integration Tests

Located in `src/__tests__/integration/`:

```typescript
// src/__tests__/integration/user-management.test.ts
describe("User Management", () => {
  it("should create and retrieve user", async () => {
    // Test full workflow
  });
});
```

### E2E Tests

Located in `e2e/`:

```typescript
// e2e/example.spec.ts
test("should navigate to home page", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/{{projectName}}/);
});
```

## Git Hooks

Husky runs quality checks before commits:

1. **Pre-commit** (via lint-staged):
   - ESLint auto-fix on `.ts`, `.tsx`, `.js`, `.jsx` files
   - Prettier format on `.json`, `.md`, `.css` files
   - Jest runs tests for changed files

If checks fail, the commit is rejected.

### Commit Convention

Follow conventional commits:

```
feat: add user authentication
fix: resolve login redirect issue
chore: update dependencies
docs: improve README
test: add user service tests
refactor: simplify error handling
```

## Project Structure Details

### Domain Layer

Pure business logic, no external dependencies:

```typescript
// src/modules/users/domain/entities/User.ts
export interface User {
  id: string;
  name: string;
  email: string;
}
```

### Application Layer

Use cases and business workflows:

```typescript
// src/modules/users/application/use-cases/CreateUserUseCase.ts
export class CreateUserUseCase {
  async execute(data: CreateUserDTO): Promise<User> {
    // Business logic
  }
}
```

### Infrastructure Layer

External dependencies (API, database):

```typescript
// src/modules/users/infrastructure/http/userApiClient.ts
export const userApiClient = {
  getAll: () => httpClient.get<User[]>("/users"),
  create: (data) => httpClient.post<User>("/users", data),
};
```

### Presentation Layer

UI components and React-specific code:

```typescript
// src/modules/users/presentation/hooks/useUsers.ts
export const useUsers = {
  useGetAll: () => useQuery({ ... }),
  useCreate: () => useMutation({ ... })
}
```

## Development Workflow

1. Create feature branch: `git checkout -b feat/user-authentication`
2. Implement changes following Clean Architecture
3. Write tests (co-located with code)
4. Commit (hooks will run automatically)
5. Push and create PR
6. CI/CD runs tests and builds
7. Code review and merge

## Build and Deploy

### Production Build

```bash
npm run build
```

Output in `.next/` directory.

### Start Production Server

```bash
npm run start
```

## Contributing

1. Follow Clean Architecture principles
2. Write tests for new features
3. Follow TypeScript strict mode
4. Use conventional commits
5. Ensure all tests pass before committing

## License

MIT
