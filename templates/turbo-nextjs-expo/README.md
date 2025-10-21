# {{projectName}}

A monorepo powered by [Turborepo](https://turbo.build/repo) containing a Next.js web application and an Expo mobile application with shared UI components.

## What's Inside?

This monorepo includes the following packages and apps:

### Apps

- `web`: A [Next.js](https://nextjs.org/) web application with:
  - TypeScript
  - Tailwind CSS
  - next-intl for internationalization
  - Jest and Playwright for testing
  - ESLint and Prettier for code quality

- `mobile`: An [Expo](https://expo.dev/) mobile application with:
  - React Native
  - Expo Router for navigation
  - TypeScript
  - ESLint and Prettier for code quality

### Packages

- `@repo/ui`: Shared React components used by both web and mobile apps
- `@repo/eslint-config`: Shared ESLint configurations
- `@repo/prettier-config`: Shared Prettier configurations
- `@repo/typescript-config`: Shared TypeScript configurations

## Getting Started

### Prerequisites

- Node.js >= 18
- npm >= 10.9.3 (or yarn/pnpm/bun)

### Installation

```bash
npm install
```

### Development

Run both web and mobile apps simultaneously:

```bash
npm run dev
```

Or run them individually:

```bash
# Run web app only
npm run dev:web

# Run mobile app only
npm run dev:mobile
```

### Mobile Development

```bash
# Start for Android
npm run android

# Start for iOS
npm run ios

# Start for web (Expo web)
npm run mobile:web
```

### Building

Build all apps:

```bash
npm run build
```

### Testing

Run tests across all apps:

```bash
npm test
```

### Linting & Formatting

```bash
# Lint all apps and packages
npm run lint

# Format all files
npm run format

# Type checking
npm run check-types
```

### Using Bun

If you prefer [Bun](https://bun.sh/), you can use the following scripts:

```bash
npm run bun:dev          # Dev mode with Bun
npm run bun:build        # Build with Bun
npm run bun:dev:web      # Web dev with Bun
npm run bun:dev:mobile   # Mobile dev with Bun
```

## Project Structure

```
.
├── apps
│   ├── mobile          # Expo mobile app
│   └── web             # Next.js web app
├── packages
│   ├── ui              # Shared UI components
│   ├── eslint-config   # Shared ESLint configs
│   ├── prettier-config # Shared Prettier configs
│   └── typescript-config # Shared TypeScript configs
├── package.json
└── turbo.json
```

## Learn More

- [Turborepo Documentation](https://turbo.build/repo/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Expo Documentation](https://docs.expo.dev/)

## Clean Up

To remove all node_modules and build artifacts:

```bash
npm run clean
```
