import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Tailwind,
  pixelBasedPreset,
} from "@react-email/components";
import * as React from "react";

import { Footer, type FooterProps } from "./Footer";
import { Header } from "./Header";

export interface EmailLayoutProps {
  previewText: string;
  companyName: string;
  companyAddress?: string;
  unsubscribeUrl?: string;
  socials?: FooterProps["socials"];
  children: React.ReactNode;
}

export function EmailLayout({
  previewText,
  companyName,
  companyAddress,
  unsubscribeUrl,
  socials,
  children,
}: EmailLayoutProps) {
  return (
    <Html lang="en">
      <Tailwind config={{ presets: [pixelBasedPreset] }}>
        <Head />
        <Preview>{previewText}</Preview>
        <Body className="bg-gray-100 font-sans">
          <Container className="mx-auto py-8 px-4 max-w-xl">
            <Section className="bg-white rounded-lg overflow-hidden">
              <Header title={companyName} />
              {children}
              <Footer
                companyName={companyName}
                address={companyAddress}
                unsubscribeUrl={unsubscribeUrl}
                socials={socials}
              />
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
