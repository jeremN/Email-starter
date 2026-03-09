# Email Starter

Modern email starter with React Email and TypeScript. Build responsive, production-ready HTML emails using React components.

## Features

- React Email components for structured, reusable email markup
- TypeScript for type-safe templates
- Tailwind CSS styling
- Live preview dev server
- Export to HTML

## Requirements

- Node.js 18+
- pnpm

## Quick Start

```bash
git clone https://github.com/jeremN/Email-starter.git
cd Email-starter
pnpm install
pnpm dev
```

## Scripts

| Script | Description |
| --- | --- |
| `pnpm dev` | Launch the React Email dev server with live preview |
| `pnpm build` | Export all email templates to HTML in `out/` |
| `pnpm preview` | Export to HTML and log the output |

## Project Structure

```
src/
  components/    Reusable UI components (Button, Header, Footer, SocialLinks)
  emails/        Email templates (each file = one template)
  utils/         Shared utilities (rendering helpers)
```

## Included Templates

- **Newsletter** -- Multi-section content layout with header, body sections, and footer
- **Receipt** -- Order confirmation / transactional email with line items and totals

## Adding New Templates

1. Create a new `.tsx` file in `src/emails/`
2. Export a default function that returns your email JSX
3. Add a `PreviewProps` export so the dev server can render a preview with sample data

The dev server will automatically pick up the new file.

## License

MIT
