# Modernize Email Starter — Design Document

**Date:** 2026-03-09
**Status:** Approved

## Goals

1. **Modern email toolkit** — replace Gulp/MJML/Nunjucks with React Email + TypeScript
2. **Reusable boilerplate** — something people clone to start real email projects

## Stack

- **React Email** (`@react-email/components`) — email component primitives
- **React Email dev server** (`react-email`) — live preview
- **TypeScript** — type-safe templates with prop interfaces
- **pnpm** — package manager

## Project Structure

```
email-starter/
├── src/
│   ├── components/          # Reusable email building blocks
│   │   ├── Button.tsx
│   │   ├── Footer.tsx
│   │   ├── Header.tsx
│   │   ├── SocialLinks.tsx
│   │   └── ...
│   ├── emails/              # Complete email templates
│   │   ├── newsletter.tsx   # Multi-section content layout
│   │   └── receipt.tsx      # Order/transaction confirmation
│   └── utils/
│       └── render.ts        # HTML export utility
├── static/                  # Images (social icons, logos)
├── package.json
├── tsconfig.json
└── README.md
```

## Email Templates

### Newsletter
- Header/preheader with preview text
- Hero section with image + headline
- 2-3 content blocks (article cards, text sections)
- CTA button
- Footer with social links + unsubscribe

### Receipt (Transactional)
- Header with logo
- Order summary heading
- Line items table (product, qty, price)
- Totals section (subtotal, tax, total)
- Shipping/billing info
- Footer with support link

## Scripts

| Command          | Description                                      |
| ---------------- | ------------------------------------------------ |
| `pnpm dev`       | Launch React Email dev server with live preview   |
| `pnpm build`     | Export all emails to production HTML in `out/`     |
| `pnpm preview`   | Preview a specific email as HTML in terminal       |

## Migration — What Changes

| Removed                                  | Replacement                              |
| ---------------------------------------- | ---------------------------------------- |
| `gulpfile.babel.js`                      | React Email dev server + scripts          |
| `.babelrc`                               | `tsconfig.json`                           |
| `src/templates/` + Nunjucks partials     | `src/components/` (TSX)                   |
| `src/data/data.json` (inline styles)     | TypeScript props on components            |
| `gulp-imagemin`                          | Static assets in `static/`                |
| `browser-sync`                           | React Email dev server                    |
| `email.mjml`                             | Deleted                                   |

## Non-Goals

- No sending integration (users plug in their own provider)
- No Next.js or full-stack framework
- No CI/CD pipeline
