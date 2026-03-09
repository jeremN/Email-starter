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
  previewText = "This week's top stories and updates",
  heroImageUrl = "https://placehold.co/600x300/6366f1/ffffff?text=Newsletter",
  heroTitle = "This Week in Tech",
  heroSubtitle,
  articles = [],
  ctaText = "Visit Our Blog",
  ctaUrl = "https://example.com/blog",
  companyName = "Acme Inc.",
  companyAddress,
  unsubscribeUrl = "https://example.com/unsubscribe",
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
