import { Hr, Link, Section, Text } from "@react-email/components";
import * as React from "react";

import { SocialLinks } from "./SocialLinks";

export interface FooterProps {
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
          <Link href={unsubscribeUrl} className="text-gray-400 underline">
            Unsubscribe
          </Link>
        </Text>
      )}
    </Section>
  );
}
