# Modernize Email Starter — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the Gulp/MJML/Nunjucks email starter with a React Email + TypeScript project that ships two production-ready templates (newsletter + receipt).

**Architecture:** Component-based email authoring with React Email. Reusable primitives (`Button`, `Footer`, `Header`, `SocialLinks`) compose into full email templates. The React Email dev server provides live preview; `react-email export` generates production HTML.

**Tech Stack:** React Email, TypeScript, Tailwind CSS (via React Email's built-in `<Tailwind>`), pnpm

---

### Task 1: Scaffold the new project

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Delete: `gulpfile.babel.js`
- Delete: `.babelrc`
- Delete: `email.mjml`
- Delete: `src/` (entire old directory)

**Step 1: Remove old files**

```bash
cd /Users/jeremienehlil/Documents/Code/Personal/Email-starter
rm -f gulpfile.babel.js .babelrc email.mjml
rm -rf src/
```

**Step 2: Write package.json**

Create `package.json`:

```json
{
  "name": "email-starter",
  "version": "2.0.0",
  "description": "Modern email starter with React Email and TypeScript",
  "private": true,
  "scripts": {
    "dev": "email dev",
    "build": "email export --outDir out --pretty",
    "preview": "email export --outDir out --pretty && echo 'Emails exported to out/'"
  },
  "keywords": ["react-email", "email", "templates", "typescript"],
  "author": "Jérémie Néhlil",
  "license": "MIT"
}
```

**Step 3: Write tsconfig.json**

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "es2017",
    "module": "esnext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true
  },
  "include": ["src/**/*.ts", "src/**/*.tsx"],
  "exclude": ["node_modules", "out"]
}
```

**Step 4: Install dependencies**

```bash
pnpm add react @react-email/components
pnpm add -D react-email typescript @types/react
```

**Step 5: Create directory structure**

```bash
mkdir -p src/components src/emails src/utils static
```

**Step 6: Update .gitignore**

Append to `.gitignore`:

```
out/
.react-email/
```

**Step 7: Commit**

```bash
git add -A
git commit -m "feat: scaffold React Email project, remove Gulp/MJML/Nunjucks stack"
```

---

### Task 2: Build reusable components

**Files:**
- Create: `src/components/Header.tsx`
- Create: `src/components/Footer.tsx`
- Create: `src/components/Button.tsx`
- Create: `src/components/SocialLinks.tsx`

**Step 1: Create Header component**

Create `src/components/Header.tsx`:

```tsx
import { Heading, Img, Section } from "@react-email/components";
import * as React from "react";

interface HeaderProps {
  logoUrl?: string;
  logoAlt?: string;
  title?: string;
}

export function Header({ logoUrl, logoAlt = "Logo", title }: HeaderProps) {
  return (
    <Section className="text-center py-6">
      {logoUrl && (
        <Img
          src={logoUrl}
          alt={logoAlt}
          width={48}
          height={48}
          className="mx-auto mb-4"
        />
      )}
      {title && (
        <Heading className="text-xl font-bold text-gray-900 m-0">
          {title}
        </Heading>
      )}
    </Section>
  );
}
```

**Step 2: Create Button component**

Create `src/components/Button.tsx`:

```tsx
import { Button as REButton } from "@react-email/components";
import * as React from "react";

interface ButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
}

export function Button({ href, children, variant = "primary" }: ButtonProps) {
  const styles =
    variant === "primary"
      ? "bg-indigo-600 text-white"
      : "bg-white text-indigo-600 border border-indigo-600";

  return (
    <REButton
      href={href}
      className={`${styles} rounded-md text-sm font-semibold no-underline text-center block py-3 px-6`}
    >
      {children}
    </REButton>
  );
}
```

**Step 3: Create SocialLinks component**

Create `src/components/SocialLinks.tsx`:

```tsx
import { Link, Section } from "@react-email/components";
import * as React from "react";

interface SocialLink {
  name: string;
  url: string;
}

interface SocialLinksProps {
  links: SocialLink[];
}

export function SocialLinks({ links }: SocialLinksProps) {
  return (
    <Section className="text-center">
      {links.map((link) => (
        <Link
          key={link.name}
          href={link.url}
          className="text-gray-400 text-xs no-underline mx-2"
        >
          {link.name}
        </Link>
      ))}
    </Section>
  );
}
```

**Step 4: Create Footer component**

Create `src/components/Footer.tsx`:

```tsx
import { Hr, Section, Text } from "@react-email/components";
import * as React from "react";

import { SocialLinks } from "./SocialLinks";

interface FooterProps {
  companyName: string;
  address?: string;
  unsubscribeUrl?: string;
  socials?: { name: string; url: string }[];
}

export function Footer({
  companyName,
  address,
  unsubscribeUrl,
  socials,
}: FooterProps) {
  return (
    <Section className="mt-8">
      <Hr className="border-gray-200 my-6" />
      {socials && socials.length > 0 && <SocialLinks links={socials} />}
      <Text className="text-xs text-gray-400 text-center m-0 mt-4">
        &copy; {new Date().getFullYear()} {companyName}. All rights reserved.
      </Text>
      {address && (
        <Text className="text-xs text-gray-400 text-center m-0 mt-1">
          {address}
        </Text>
      )}
      {unsubscribeUrl && (
        <Text className="text-xs text-gray-400 text-center m-0 mt-1">
          <a href={unsubscribeUrl} className="text-gray-400 underline">
            Unsubscribe
          </a>
        </Text>
      )}
    </Section>
  );
}
```

**Step 5: Verify dev server launches**

```bash
pnpm dev
```

Expected: React Email dev server starts, shows the components (no full emails yet).

**Step 6: Commit**

```bash
git add src/components/
git commit -m "feat: add reusable email components (Header, Footer, Button, SocialLinks)"
```

---

### Task 3: Build newsletter email template

**Files:**
- Create: `src/emails/newsletter.tsx`

**Step 1: Create the newsletter template**

Create `src/emails/newsletter.tsx`:

```tsx
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Tailwind,
  Text,
  pixelBasedPreset,
} from "@react-email/components";
import * as React from "react";

import { Button } from "../components/Button";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";

interface Article {
  title: string;
  summary: string;
  imageUrl?: string;
  linkUrl: string;
  linkText?: string;
}

interface NewsletterProps {
  previewText: string;
  heroImageUrl: string;
  heroTitle: string;
  heroSubtitle?: string;
  articles: Article[];
  ctaText: string;
  ctaUrl: string;
  companyName: string;
  companyAddress?: string;
  unsubscribeUrl: string;
  socials?: { name: string; url: string }[];
}

export default function Newsletter({
  previewText,
  heroImageUrl,
  heroTitle,
  heroSubtitle,
  articles,
  ctaText,
  ctaUrl,
  companyName,
  companyAddress,
  unsubscribeUrl,
  socials,
}: NewsletterProps) {
  return (
    <Html lang="en">
      <Tailwind config={{ presets: [pixelBasedPreset] }}>
        <Head />
        <Preview>{previewText}</Preview>
        <Body className="bg-gray-100 font-sans">
          <Container className="mx-auto py-8 px-4 max-w-xl">
            <Section className="bg-white rounded-lg overflow-hidden">
              <Header title={companyName} />

              {/* Hero */}
              <Img
                src={heroImageUrl}
                alt={heroTitle}
                width={600}
                className="w-full"
              />
              <Section className="px-8 py-6">
                <Heading className="text-2xl font-bold text-gray-900 m-0 mb-2">
                  {heroTitle}
                </Heading>
                {heroSubtitle && (
                  <Text className="text-base text-gray-600 m-0">
                    {heroSubtitle}
                  </Text>
                )}
              </Section>

              <Hr className="border-gray-200 mx-8" />

              {/* Articles */}
              {articles.map((article, i) => (
                <Section key={i} className="px-8 py-4">
                  {article.imageUrl && (
                    <Img
                      src={article.imageUrl}
                      alt={article.title}
                      width={520}
                      className="w-full rounded mb-3"
                    />
                  )}
                  <Heading className="text-lg font-semibold text-gray-900 m-0 mb-2">
                    {article.title}
                  </Heading>
                  <Text className="text-sm text-gray-600 m-0 mb-3 leading-6">
                    {article.summary}
                  </Text>
                  <Button href={article.linkUrl}>
                    {article.linkText ?? "Read more"}
                  </Button>
                  {i < articles.length - 1 && (
                    <Hr className="border-gray-100 mt-4" />
                  )}
                </Section>
              ))}

              {/* CTA */}
              <Section className="px-8 py-6 text-center">
                <Button href={ctaUrl}>{ctaText}</Button>
              </Section>

              {/* Footer */}
              <Section className="px-8">
                <Footer
                  companyName={companyName}
                  address={companyAddress}
                  unsubscribeUrl={unsubscribeUrl}
                  socials={socials}
                />
              </Section>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

Newsletter.PreviewProps = {
  previewText: "This week's top stories and updates",
  heroImageUrl: "https://placehold.co/600x300/6366f1/ffffff?text=Newsletter",
  heroTitle: "This Week in Tech",
  heroSubtitle: "Your weekly roundup of the latest news and insights.",
  articles: [
    {
      title: "Getting Started with React Email",
      summary:
        "Learn how to build beautiful, responsive emails using React components. No more wrestling with table-based layouts.",
      imageUrl: "https://placehold.co/520x200/e5e7eb/333333?text=Article+1",
      linkUrl: "https://react.email",
      linkText: "Read the guide",
    },
    {
      title: "TypeScript Best Practices in 2026",
      summary:
        "Explore the latest patterns and conventions that make TypeScript codebases more maintainable and type-safe.",
      linkUrl: "https://example.com/typescript",
    },
    {
      title: "The Future of Email Design",
      summary:
        "How modern tooling is transforming the way developers and designers collaborate on email templates.",
      linkUrl: "https://example.com/email-design",
      linkText: "Explore trends",
    },
  ],
  ctaText: "Visit Our Blog",
  ctaUrl: "https://example.com/blog",
  companyName: "Acme Inc.",
  companyAddress: "123 Main St, San Francisco, CA 94102",
  unsubscribeUrl: "https://example.com/unsubscribe",
  socials: [
    { name: "Twitter", url: "https://twitter.com" },
    { name: "GitHub", url: "https://github.com" },
    { name: "LinkedIn", url: "https://linkedin.com" },
  ],
} satisfies NewsletterProps;
```

**Step 2: Verify in dev server**

```bash
pnpm dev
```

Expected: Newsletter email renders in the React Email preview at `http://localhost:3000`.

**Step 3: Commit**

```bash
git add src/emails/newsletter.tsx
git commit -m "feat: add newsletter email template"
```

---

### Task 4: Build receipt email template

**Files:**
- Create: `src/emails/receipt.tsx`

**Step 1: Create the receipt template**

Create `src/emails/receipt.tsx`:

```tsx
import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
  pixelBasedPreset,
} from "@react-email/components";
import * as React from "react";

import { Footer } from "../components/Footer";
import { Header } from "../components/Header";

interface LineItem {
  name: string;
  quantity: number;
  price: string;
}

interface ReceiptProps {
  previewText: string;
  companyName: string;
  orderNumber: string;
  orderDate: string;
  items: LineItem[];
  subtotal: string;
  tax: string;
  total: string;
  shippingAddress?: {
    name: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    zip: string;
  };
  supportEmail?: string;
  companyAddress?: string;
}

export default function Receipt({
  previewText,
  companyName,
  orderNumber,
  orderDate,
  items,
  subtotal,
  tax,
  total,
  shippingAddress,
  supportEmail,
  companyAddress,
}: ReceiptProps) {
  return (
    <Html lang="en">
      <Tailwind config={{ presets: [pixelBasedPreset] }}>
        <Head />
        <Preview>{previewText}</Preview>
        <Body className="bg-gray-100 font-sans">
          <Container className="mx-auto py-8 px-4 max-w-xl">
            <Section className="bg-white rounded-lg overflow-hidden">
              <Header title={companyName} />

              <Section className="px-8 pb-4">
                <Heading className="text-2xl font-bold text-gray-900 m-0 mb-1">
                  Order Confirmation
                </Heading>
                <Text className="text-sm text-gray-500 m-0">
                  Order #{orderNumber} &middot; {orderDate}
                </Text>
              </Section>

              <Hr className="border-gray-200 mx-8" />

              {/* Line items header */}
              <Section className="px-8 pt-4">
                <Row>
                  <Column className="w-3/5">
                    <Text className="text-xs font-semibold text-gray-500 uppercase m-0">
                      Item
                    </Text>
                  </Column>
                  <Column className="w-1/5 text-center">
                    <Text className="text-xs font-semibold text-gray-500 uppercase m-0">
                      Qty
                    </Text>
                  </Column>
                  <Column className="w-1/5 text-right">
                    <Text className="text-xs font-semibold text-gray-500 uppercase m-0">
                      Price
                    </Text>
                  </Column>
                </Row>
              </Section>

              {/* Line items */}
              {items.map((item, i) => (
                <Section key={i} className="px-8">
                  <Row>
                    <Column className="w-3/5">
                      <Text className="text-sm text-gray-900 m-0 py-2">
                        {item.name}
                      </Text>
                    </Column>
                    <Column className="w-1/5 text-center">
                      <Text className="text-sm text-gray-600 m-0 py-2">
                        {item.quantity}
                      </Text>
                    </Column>
                    <Column className="w-1/5 text-right">
                      <Text className="text-sm text-gray-900 m-0 py-2">
                        {item.price}
                      </Text>
                    </Column>
                  </Row>
                </Section>
              ))}

              <Hr className="border-gray-200 mx-8" />

              {/* Totals */}
              <Section className="px-8 py-2">
                <Row>
                  <Column className="w-3/5" />
                  <Column className="w-2/5">
                    <Row>
                      <Column>
                        <Text className="text-sm text-gray-600 m-0 py-1">
                          Subtotal
                        </Text>
                      </Column>
                      <Column className="text-right">
                        <Text className="text-sm text-gray-900 m-0 py-1">
                          {subtotal}
                        </Text>
                      </Column>
                    </Row>
                    <Row>
                      <Column>
                        <Text className="text-sm text-gray-600 m-0 py-1">
                          Tax
                        </Text>
                      </Column>
                      <Column className="text-right">
                        <Text className="text-sm text-gray-900 m-0 py-1">
                          {tax}
                        </Text>
                      </Column>
                    </Row>
                    <Hr className="border-gray-200 my-2" />
                    <Row>
                      <Column>
                        <Text className="text-sm font-bold text-gray-900 m-0 py-1">
                          Total
                        </Text>
                      </Column>
                      <Column className="text-right">
                        <Text className="text-sm font-bold text-gray-900 m-0 py-1">
                          {total}
                        </Text>
                      </Column>
                    </Row>
                  </Column>
                </Row>
              </Section>

              {/* Shipping address */}
              {shippingAddress && (
                <>
                  <Hr className="border-gray-200 mx-8" />
                  <Section className="px-8 py-4">
                    <Text className="text-xs font-semibold text-gray-500 uppercase m-0 mb-2">
                      Shipping Address
                    </Text>
                    <Text className="text-sm text-gray-700 m-0 leading-5">
                      {shippingAddress.name}
                      <br />
                      {shippingAddress.line1}
                      <br />
                      {shippingAddress.line2 && (
                        <>
                          {shippingAddress.line2}
                          <br />
                        </>
                      )}
                      {shippingAddress.city}, {shippingAddress.state}{" "}
                      {shippingAddress.zip}
                    </Text>
                  </Section>
                </>
              )}

              {/* Support note */}
              {supportEmail && (
                <Section className="px-8 py-4 bg-gray-50">
                  <Text className="text-xs text-gray-500 text-center m-0">
                    Questions about your order? Contact us at{" "}
                    <a
                      href={`mailto:${supportEmail}`}
                      className="text-indigo-600 underline"
                    >
                      {supportEmail}
                    </a>
                  </Text>
                </Section>
              )}

              {/* Footer */}
              <Section className="px-8">
                <Footer
                  companyName={companyName}
                  address={companyAddress}
                />
              </Section>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

Receipt.PreviewProps = {
  previewText: "Your order confirmation from Acme Inc.",
  companyName: "Acme Inc.",
  orderNumber: "ORD-2026-1234",
  orderDate: "March 9, 2026",
  items: [
    { name: "Pro Plan (Annual)", quantity: 1, price: "$199.00" },
    { name: "Extra Storage (50GB)", quantity: 2, price: "$9.99" },
    { name: "Priority Support Add-on", quantity: 1, price: "$49.00" },
  ],
  subtotal: "$267.98",
  tax: "$21.44",
  total: "$289.42",
  shippingAddress: {
    name: "Jane Smith",
    line1: "456 Oak Avenue",
    line2: "Suite 200",
    city: "Portland",
    state: "OR",
    zip: "97201",
  },
  supportEmail: "support@acme.com",
  companyAddress: "123 Main St, San Francisco, CA 94102",
} satisfies ReceiptProps;
```

**Step 2: Verify in dev server**

```bash
pnpm dev
```

Expected: Receipt email renders in the React Email preview alongside the newsletter.

**Step 3: Commit**

```bash
git add src/emails/receipt.tsx
git commit -m "feat: add receipt/transactional email template"
```

---

### Task 5: Add render utility and build verification

**Files:**
- Create: `src/utils/render.ts`

**Step 1: Create the render utility**

Create `src/utils/render.ts`:

```ts
import { render } from "@react-email/components";

export { render };
```

**Step 2: Test the full build**

```bash
pnpm build
```

Expected: HTML files appear in `out/` directory for both newsletter and receipt.

**Step 3: Verify the exported HTML is valid**

```bash
ls out/
cat out/newsletter.html | head -20
```

Expected: Two HTML files, well-formed markup with inlined styles.

**Step 4: Commit**

```bash
git add src/utils/render.ts
git commit -m "feat: add render utility and verify build output"
```

---

### Task 6: Update README and clean up

**Files:**
- Modify: `README.md`
- Modify: `.editorconfig` (keep as-is, still useful)
- Verify: `.gitignore` includes `out/` and `.react-email/`

**Step 1: Rewrite README.md**

Replace `README.md` with updated content covering:
- Project description (React Email + TypeScript email starter)
- Requirements (Node 18+, pnpm)
- Installation (`pnpm install`)
- Usage (`pnpm dev`, `pnpm build`)
- Project structure explanation
- How to add new templates
- How to customize components
- License

**Step 2: Final verification**

```bash
pnpm dev
```

Expected: Dev server shows both templates, hot-reloads on changes.

**Step 3: Commit**

```bash
git add README.md .gitignore
git commit -m "docs: rewrite README for React Email starter v2"
```

---

### Task 7: Final build and smoke test

**Step 1: Clean build from scratch**

```bash
rm -rf node_modules out .react-email
pnpm install
pnpm build
```

Expected: Clean install and build succeeds with no errors.

**Step 2: Verify dev server**

```bash
pnpm dev
```

Expected: Both templates render correctly in the browser.

**Step 3: Final commit if any adjustments**

```bash
git status
# Only commit if there are changes
```
