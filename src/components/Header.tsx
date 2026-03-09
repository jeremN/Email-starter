import { Heading, Img, Section } from "@react-email/components";
import * as React from "react";

export interface HeaderProps {
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
        <Heading as="h2" className="text-xl font-bold text-gray-900 m-0">
          {title}
        </Heading>
      )}
    </Section>
  );
}
