import {
  Column,
  Heading,
  Hr,
  Link,
  Row,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

import { EmailLayout } from "../components/EmailLayout";

export interface LineItem {
  name: string;
  quantity: number;
  price: string;
}

export interface ReceiptProps {
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
  previewText = "Your order confirmation",
  companyName = "Acme Inc.",
  orderNumber = "ORD-0000",
  orderDate = new Date().toLocaleDateString(),
  items = [],
  subtotal = "$0.00",
  tax = "$0.00",
  total = "$0.00",
  shippingAddress,
  supportEmail,
  companyAddress,
}: ReceiptProps) {
  return (
    <EmailLayout
      previewText={previewText}
      companyName={companyName}
      companyAddress={companyAddress}
    >
      <Section className="px-8 pb-4">
        <Heading as="h1" className="text-2xl font-bold text-gray-900 m-0 mb-1">
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
            <Link
              href={`mailto:${supportEmail}`}
              className="text-indigo-600 underline"
            >
              {supportEmail}
            </Link>
          </Text>
        </Section>
      )}
    </EmailLayout>
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
