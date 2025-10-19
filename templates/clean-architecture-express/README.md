# {{projectName}}

Backend application built with Node.js, Express, and TypeScript following Clean Architecture principles.

## Architecture Overview

This project follows Clean Architecture with clear separation of concerns:

```
src/
├── domain/              # Enterprise Business Rules
│   ├── entities/        # Domain entities
│   ├── repositories/    # Repository interfaces
│   └── value-object/    # Value objects
├── application/        # Application Business Rules
│   ├── use-cases/       # Use case implementations
│   ├── dtos/            # Data Transfer Objects
│   ├── services/        # Application services
│   └── validators/      # Input validation
├── infra/              # Infrastructure Layer
│   ├── config/         # Configuration (env, database)
│   ├── container/      # Dependency injection container
│   ├── database/       # Database connection
│   ├── models/         # Database models (Mongoose schemas)
│   ├── repositories/   # Repository implementations
│   └── services/       # External services
├── presentation/       # Presentation Layer
│   ├── controllers/    # HTTP controllers
│   ├── routes/         # Route definitions
│   ├── middlewares/    # Express middlewares
│   ├── errors/         # Custom error classes
│   └── websocket/      # WebSocket handlers
└── shared/            # Shared utilities
    ├── types/         # Shared types (Result, common types)
    ├── constants/     # Constants (HTTP status codes)
    └── helpers/       # Helper functions
```

## Getting Started

### Prerequisites

- Node.js >= 18
- MongoDB

### Installation

1. Install dependencies:
```bash
npm install
# or
yarn install
```

2. Copy `.env.example` to `.env` and configure:
```bash
cp .env.example .env
```

3. Update environment variables in `.env`:
```env
PORT=3000
NODE_ENV=development
JWT_SECRET=your_secret_key_here
```

### Development

Run development server with hot-reload:
```bash
npm run dev
```

### Build

Build for production:
```bash
npm run build
```

### Start Production

```bash
npm start
```

## Available Scripts

- `npm run dev` - Start development server with nodemon
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Project Features

- ✅ Clean Architecture with clear layer separation
- ✅ TypeScript for type safety
- ✅ Path aliases (`~domain/`, `~application/`, etc.)
- ✅ Result type for error handling
- ✅ Custom error classes
- ✅ Dependency injection container
- ✅ Environment configuration validation
- ✅ MongoDB integration ready
- ✅ JWT authentication ready
- ✅ ESLint + Prettier configured

## Adding New Features

### 1. Create a new module

Example: Adding a User module

**Step 1: Define Domain Layer**
```typescript
// src/domain/entities/User.ts
export class User {
  constructor(
    public id: string,
    public email: string,
    public name: string
  ) {}
}

// src/domain/repositories/IUserRepository.ts
export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  create(user: User): Promise<User>;
}
```

**Step 2: Application Layer**
```typescript
// src/application/use-cases/CreateUserUseCase.ts
export class CreateUserUseCase {
  constructor(private userRepo: IUserRepository) {}

  async execute(data: CreateUserDTO): Promise<Result<User, string>> {
    // Business logic here
  }
}
```

**Step 3: Infrastructure Layer**
```typescript
// src/infra/repositories/UserRepository.ts
export class UserRepository implements IUserRepository {
  // Implementation using Mongoose
}
```

**Step 4: Presentation Layer**
```typescript
// src/presentation/controllers/UserController.ts
export class UserController {
  constructor(private createUserUseCase: CreateUserUseCase) {}

  async create(req: Request, res: Response) {
    // Handle HTTP request
  }
}

// src/presentation/routes/UserRoutes.ts
export class UserRoutes {
  constructor(private userController: UserController) {}

  getRouter(): Router {
    const router = Router();
    router.post('/users', this.userController.create);
    return router;
  }
}
```

**Step 5: Wire up in Container**
```typescript
// src/infra/container/modules/UserModule.ts
export class UserModule {
  private _userRepo?: UserRepository;
  private _createUserUseCase?: CreateUserUseCase;
  private _userController?: UserController;
  private _userRoutes?: UserRoutes;

  // Implement getters with lazy initialization
}

// src/infra/container/AppContainer.ts
// Add UserModule and register routes
```

## API Endpoints

### Health Check
```
GET /health
```

Response:
```json
{
  "status": "UP",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## License

MIT
