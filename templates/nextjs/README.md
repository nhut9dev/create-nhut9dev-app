# Next.js Template

This is a [Next.js](https://nextjs.org/) project template with TypeScript, [next-intl](https://github.com/amannn/next-intl) for internationalization, [Tailwind CSS](https://tailwindcss.com/), [Playwright](https://playwright.dev/) for E2E testing, and [Jest](https://jestjs.io/) for unit testing.

## Features

- Next.js 15 with App Router
- TypeScript support
- Internationalization (i18n) with next-intl
- Tailwind CSS and tailwindcss-animate
- Prettier and ESLint with recommended configs
- Playwright for E2E tests
- Jest and Testing Library for unit tests
- Pre-configured aliases for imports

## Getting Started

Install dependencies:

```sh
pnpm install
# or
npm install
# or
yarn install
```

> **Note:** Playwright browsers (e.g., Chromium) are installed automatically after dependencies via the `postinstall` script.  
> If you need to install them manually, run:
>
> ```sh
> npx playwright install chromium
> ```

Run the development server:

```sh
pnpm dev
# or
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Scripts

- `dev` – Start the development server
- `build` – Build the app for production
- `start` – Start the production server
- `lint` – Run ESLint
- `format` – Run Prettier
- `fix` – Fix lint and formatting issues
- `test` – Run Playwright E2E tests
- `jest` – Run Jest unit tests

## Testing

- **Unit tests:**  
  Run `pnpm jest` or `npm run jest` to execute Jest tests in `src/tests/`.
- **E2E tests:**  
  Run `pnpm test` or `npm run test` to execute Playwright tests in `tests/`.

  > If you see errors about missing browsers, run:
  >
  > ```sh
  > npx playwright install chromium
  > ```

## Internationalization

Locale files are in the [`messages/`](messages/) directory.  
See [`src/i18n/`](src/i18n/) for locale logic.

## Project Structure

- [`src/`](src/) – Application source code
- [`tests/`](tests/) – Playwright E2E tests
- [`messages/`](messages/) – Locale message files
- [`public/`](public/) – Static assets

## Customization

- Update aliases in [`tsconfig.json`](tsconfig.json)
- Adjust ESLint/Prettier rules in [`eslint.config.mjs`](eslint.config.mjs) and [`.prettierrc`](.prettierrc)
- Tailwind config in [`postcss.config.mjs`](postcss.config.mjs)

## License

MIT
