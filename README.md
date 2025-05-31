# create-nhut9dev-app

A CLI tool to scaffold a Next.js project with TypeScript, next-intl for internationalization, Tailwind CSS, Playwright for E2E testing, and Jest for unit testing.

## Features

- Next.js 15 with App Router
- TypeScript support
- Internationalization (i18n) with next-intl
- Tailwind CSS and tailwindcss-animate
- Prettier and ESLint with recommended configs
- Playwright for E2E tests
- Jest and Testing Library for unit tests
- Pre-configured aliases for imports

## Usage

```sh
npx create-nhut9dev-app
# or if installed globally
create-nhut9dev-app
```

You will be prompted for your project name and template (currently only Next.js is supported).

## Project Structure

- [`bin/`](bin/) – CLI entry point
- [`templates/`](templates/) – Project templates (Next.js)
- [`package.json`](package.json) – CLI configuration

## Next.js Template

The Next.js template includes:

- [`src/`](templates/nextjs/src/) – Application source code
- [`tests/`](templates/nextjs/tests/) – Playwright E2E tests
- [`messages/`](templates/nextjs/messages/) – Locale message files
- [`public/`](templates/nextjs/public/) – Static assets

See [`templates/nextjs/README.md`](templates/nextjs/README.md) for more details.

## License

MIT – see [LICENSE](LICENSE)
