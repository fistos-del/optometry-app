import "./globals.css";

export const metadata = { title: "Optometry Portal", description: "Patient filing system" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
