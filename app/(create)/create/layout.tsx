import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Your Scope",
  robots: { index: false, follow: false },
};

export default function CreateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
