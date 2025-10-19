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

## Usage

```sh
npx create-nhut9dev-app
# or if installed globally
create-nhut9dev-app
```

You will be prompted to:

1. Choose a project template (Next.js, Clean Architecture Express, or API Gateway)
2. Enter your project name

The CLI will automatically:

- Copy the selected template
- Rename `gitignore` to `.gitignore`
- Rename `env.example` to `.env` (if available)
- Replace placeholders in `package.json` with your project name

## Project Structure

- [`bin/`](bin/) – CLI entry point
- [`templates/`](templates/) – Project templates
  - [`nextjs/`](templates/nextjs/) – Next.js template with i18n, Tailwind, Playwright, Jest
  - [`clean-architecture-express/`](templates/clean-architecture-express/) – Express.js with Clean Architecture
  - [`api-gateway/`](templates/api-gateway/) – API Gateway template
- [`package.json`](package.json) – CLI configuration

## License

MIT – see [LICENSE](LICENSE)
