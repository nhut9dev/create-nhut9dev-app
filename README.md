# create-nhut9dev-app

A CLI tool to quickly scaffold modern web projects with best practices and pre-configured templates.

## Available Templates

### 1. Next.js Template

- Next.js 15 with App Router
- TypeScript support
- Internationalization (i18n) with next-intl
- Tailwind CSS and tailwindcss-animate
- Prettier and ESLint with recommended configs
- Playwright for E2E tests
- Jest and Testing Library for unit tests
- Pre-configured aliases for imports

### 2. Clean Architecture Express

- Express.js with Clean Architecture pattern
- TypeScript support
- Layered architecture (domain, application, infrastructure)
- Environment configuration

### 3. API Gateway

- API Gateway architecture
- Service orchestration
- Environment configuration

### 4. Turbo Next.js + Expo

- Monorepo powered by Turborepo
- Next.js 15 web application with:
  - TypeScript and Tailwind CSS
  - Internationalization (i18n) with next-intl
  - Jest and Playwright for testing
  - ESLint and Prettier
- Expo mobile application with:
  - React Native and Expo Router
  - TypeScript support
  - Shared UI components
- Shared packages:
  - `@repo/ui` - Shared React components
  - `@repo/eslint-config` - ESLint configurations
  - `@repo/prettier-config` - Prettier configurations
  - `@repo/typescript-config` - TypeScript configurations

## Usage

```sh
npx create-nhut9dev-app
# or if installed globally
create-nhut9dev-app
```

You will be prompted to:

1. Choose a project template (Next.js, Clean Architecture Express, API Gateway, or Turbo Next.js + Expo)
2. Enter your project name

The CLI will automatically:

- Copy the selected template
- Rename `gitignore` to `.gitignore`
- Rename `env.example` to `.env` (if available)
- Replace placeholders in `package.json` with your project name
- Replace placeholders in `README.md` with your project name (if available)
- Replace placeholders in `app.json` with your project name (for Expo projects)

## After Creating Your Project

Once your project is created, navigate to the project directory and install dependencies:

```sh
cd your-project-name
npm install
```

Then start the development server:

```sh
# For Next.js, Clean Architecture Express, or API Gateway
npm run dev

# For Turbo Next.js + Expo monorepo
npm run dev              # Start both web and mobile
npm run dev:web          # Start web only
npm run dev:mobile       # Start mobile only
npm run android          # Start Android app
npm run ios              # Start iOS app
```

## Project Structure

- [`bin/`](bin/) – CLI entry point
- [`templates/`](templates/) – Project templates
  - [`nextjs/`](templates/nextjs/) – Next.js template with i18n, Tailwind, Playwright, Jest
  - [`clean-architecture-express/`](templates/clean-architecture-express/) – Express.js with Clean Architecture
  - [`api-gateway/`](templates/api-gateway/) – API Gateway template
  - [`turbo-nextjs-expo/`](templates/turbo-nextjs-expo/) – Turborepo monorepo with Next.js and Expo
- [`package.json`](package.json) – CLI configuration

## License

MIT – see [LICENSE](LICENSE)
