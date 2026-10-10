# Technodil — Frontend

A web application for searching electronics. Offers are collected from online stores by a separate parser and merged into a single catalog, where users can search, compare, save favorites, and track prices.

This repository contains the **client side** (Nuxt 3). The backend, the parser, and the Telegram bot live in separate services.

## Features

- **Product aggregation.** The catalog is built from offers across multiple stores gathered by a standalone parser. Each product shows its minimum price and a list of store offers with store logos and links to the product pages.
- **LLM-powered recommendations.** Users describe what they want in free form, e.g. "I want an ultra-thin laptop", and get a comment from the model along with a selection of matching products.
- **Catalog and categories.** Browse through a category tree with paginated product lists.
- **Product comparison.** A dedicated page with a table of specs for the selected products. Comparison works within a category.
- **Favorites.** Available to authenticated users only. Adding a product to favorites subscribes the user to price-change notifications.
- **Telegram notifications.** When the price of a favorited product changes, the user receives a message from the Telegram bot.
- **Telegram authentication.** Sign-in via the Telegram Login Widget; the backend validates the data and issues a JWT.
- **Responsive layout.** The UI is designed for mobile, tablet, and desktop.
- **Light and dark themes.** Including separate favicons for each theme.
- **Cross-browser support.** Tested in Safari, Chrome, Firefox, Edge, and Yandex Browser.

## Tech stack

| Area | Technologies |
| --- | --- |
| Framework | Nuxt 3, Vue 3 (Composition API), TypeScript |
| UI | Nuxt UI 2, Tailwind CSS 3 |
| State | Pinia, `pinia-plugin-persistedstate` (cookies) |
| Auth | `nuxt-telegram-auth` (Telegram Login Widget) + backend-issued JWT |
| SEO | `@nuxtjs/sitemap`, `robots.txt` |
| Infrastructure | Docker, GitLab CI |

### Backend endpoints used

| Method | Path | Purpose |
| --- | --- | --- |
| POST | `/auth/telegram` | Exchange Telegram data for a JWT |
| POST | `/llm-request` | LLM recommendations from a free-form query |
| GET | `/categories-tree` | Category tree |
| GET | `/abstract-products-by-category` | Products in a category (paginated) |
| GET | `/abstract-product` | Product description and specs |
| GET | `/parsed-products` | Store offers for a product |
| GET | `/favourites/list` | Favorites list |
| POST / DELETE | `/favourites` | Add / remove a product from favorites |

## Project structure

```
├── assets/            # styles, fonts (Rubik)
├── components/        # AppNav, CategoryDropdown, SearchCard, LikeButton, ...
├── composables/       # useApiFetch, useMarketLogo, useOpenLink, useStatusCodeCheck
├── layouts/           # default layout
├── middleware/        # auth.global.ts — protects the /favourites page
├── pages/
│   ├── index.vue      # search, categories, LLM recommendations
│   ├── compare.vue    # product comparison
│   └── favourites.vue # favorites (authenticated users only)
├── public/            # favicons (light/dark), robots.txt
├── stores/            # Pinia: token, user, favourites, comparison, header, nav
├── types/             # TypeScript types for API responses
├── app.config.ts      # Nuxt UI config (primary color: purple)
├── nuxt.config.ts
├── Dockerfile
└── .gitlab-ci.yml
```

## Getting started

Requirements: Node.js 22+ and npm.

```bash
npm install
cp .env.example .env   # then fill in the values
npm run dev
```

By default the dev server listens on port **80** on the host from `APP_URL`. On Linux and macOS this may require elevated privileges. You can change the port under `devServer` in `nuxt.config.ts`.

### Environment variables

| Variable | Description |
| --- | --- |
| `APP_URL` | Dev server host, e.g. `127.0.0.1` |
| `API_URL` | Backend URL, e.g. `https://localhost:8443` |
| `TELEGRAM_TOKEN` | Telegram bot token used for authentication |

> ⚠️ `.env.example` contains a value that looks like a real bot token. **Revoke and reissue it via @BotFather**, and leave a placeholder such as `TELEGRAM_TOKEN=your_bot_token` in the example. Note also that `TELEGRAM_TOKEN` is currently placed in `runtimeConfig.public`, meaning it ends up in the client bundle. The bot token should only be used on the backend.

### Telegram authentication

1. The user clicks "Sign in" and sees the Telegram Login Widget.
2. The user data (`id`, `first_name`, `username`, `photo_url`, `auth_date`, `hash`) is sent to `POST /auth/telegram`.
3. The backend verifies the signature and returns a JWT.
4. The token is saved in a cookie via Pinia, the header shows the user's name and avatar, and favorites are loaded.
5. A global middleware blocks unauthenticated users from `/favourites`.

For the widget to work, the app's domain must be linked to the bot with `/setdomain` in @BotFather. The bot name is currently hardcoded in `components/AppNav.vue` (the `telegram-login` attribute); change it there if you switch bots.

### Price notifications

A subscription is created by adding a product to favorites. Price tracking and message delivery are handled by the backend and the Telegram bot. The frontend only needs Telegram authentication so the bot can message the user.

## Scripts

| Command | Action |
| --- | --- |
| `npm run dev` | Development mode |
| `npm run build` | Production build |
| `npm run generate` | Static generation |
| `npm run preview` | Preview the build |
| `npm run lint` / `lint:fix` | Lint with ESLint |

## Deployment

### Docker

```bash
docker build -t technodil-front .
docker run -p 3000:3000 --env-file .env technodil-front
```

The image is built on `node:22-alpine` and starts with `npm run start`.

### CI/CD

`.gitlab-ci.yml` builds a Docker image and pushes it to the registry on every push to `master`. The image is tagged with `$CI_COMMIT_SHORT_SHA` and `latest`. The pipeline requires the `CI_REGISTRY_USER` and `CI_REGISTRY_PASSWORD` variables.

## Supported browsers

Safari, Chrome, Firefox, Edge, and Yandex Browser (current versions).
