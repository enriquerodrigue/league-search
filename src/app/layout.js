import "./globals.css";

export const metadata = {
  title: "League Search",
  description: "Search League of Legends player profiles",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
