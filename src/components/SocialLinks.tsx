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
