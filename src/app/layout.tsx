import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'StoryWorld Architect — Worldbuilding & What-If Simulation Laboratory',
  description: 'An AI-powered worldbuilding laboratory where creators synthesize interconnected worlds, challenge foundational laws, and simulate cascading consequences with causal reasoning.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="color-scheme" content="dark" />
      </head>
      <body>{children}</body>
    </html>
  );
}
